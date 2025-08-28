// /home/pi/ble-server.js  ← 교정본
const bleno = require('@abandonware/bleno');
const util = require('util');
const { execFile, spawn } = require('child_process');

const run = util.promisify(execFile);            // ← 시스템 커맨드용
const sleep = (ms) => new Promise(res => setTimeout(res, ms));
const mask = (s) => (typeof s === 'string' && s.length
  ? s[0] + '*'.repeat(Math.max(0, s.length - 2)) + s[s.length - 1]
  : s);

const SERVICE_UUID = 'e5f00001-3a12-4a9b-9f65-1d2c3b4a5f60';
const WRITE_CHAR_UUID = 'e5f00002-3a12-4a9b-9f65-1d2c3b4a5f60';
const LOCAL_NAME = 'Pi-BLE';
const path = require('path');
// ----- 설정: Python 경로/스크립트 경로 -----
const PYTHON_BIN = '/usr/bin/python3';
const OPER_SCRIPT = '/home/lee/바탕화면/oper_fi1.py';

// 현재 프로세스가 root가 아니면 wpa_cli에 sudo 사용
const DEFAULT_USE_SUDO = !(process.getuid && process.getuid() === 0);

// ----- 유틸 커맨드 실행(로그 포함) -----
async function cmd(bin, args, opts = {}) {
  const { stdout, stderr } = await run(bin, args, { timeout: 30_000, ...opts });
  if (stdout) console.log(`[CMD] ${bin} ${args.join(' ')}\n${stdout}`);
  if (stderr) console.warn(`[CMD:err] ${bin} ${args.join(' ')}\n${stderr}`);
  return { stdout, stderr };
}

// ----- nmcli 관리 여부 -----
async function isNmActiveAndManaging() {
  try { await run('nmcli', ['-v']); } catch { return false; }
  try {
    const { stdout } = await run('nmcli', ['dev', 'status']);
    return /wlan0\s+wifi\s+(?:connected|disconnected)/.test(stdout);
  } catch { return false; }
}

// ----- SSID 대소문자 교정 -----
async function resolveSsidCase(requested) {
  try {
    const { stdout } = await run('nmcli', ['-t', '-f', 'SSID', 'dev', 'wifi', 'list']);
    const ssids = stdout.split('\n').map(s => s.trim()).filter(Boolean);
    const exact = ssids.find(s => s === requested);
    if (exact) return exact;
    const ci = ssids.find(s => s.toLowerCase() === requested.toLowerCase());
    if (ci) {
      console.warn(`[WIFI] SSID 대소문자 교정: "${requested}" -> "${ci}"`);
      return ci;
    }
  } catch {}
  return requested;
}

// ----- 연결 완료 대기 -----
async function waitForWifiUp(timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const { stdout } = await run('iwgetid', ['-r'], { timeout: 3000 });
      const ssid = stdout.trim();
      if (ssid) {
        const { stdout: ipOut } = await run('bash', ['-lc', 'ip -4 -o addr show dev wlan0 | awk \'{print $4}\'']);
        if (ipOut.trim()) return { ssid, ip: ipOut.trim() };
      }
    } catch {}
    await sleep(1000);
  }
  throw new Error('Wi-Fi 연결/IPv4 획득 타임아웃');
}

// ----- nmcli 경로 -----
async function connectWifi_nmcli(ssid, password) {
  console.log(`[WIFI] nmcli로 연결: ssid="${ssid}", password="${mask(password)}"`);
  await cmd('rfkill', ['unblock', 'wlan']).catch(()=>{});
  await cmd('nmcli', ['radio', 'wifi', 'on']).catch(()=>{});
  await cmd('nmcli', ['dev', 'wifi', 'rescan']);
  await sleep(2000);

  const fixedSsid = await resolveSsidCase(ssid);
  await cmd('nmcli', ['-f', 'SSID,SIGNAL,SECURITY', 'dev', 'wifi', 'list']).catch(()=>{});

  await run('nmcli', ['-w', '40', 'dev', 'wifi', 'connect', fixedSsid, 'password', password, 'ifname', 'wlan0'], { timeout: 60_000 });
  console.log('[WIFI] nmcli 연결 명령 완료');
  return await waitForWifiUp(40_000);
}

// ----- wpa_cli 경로 -----
async function connectWifi_wpacli(ssid, password, useSudo = DEFAULT_USE_SUDO) {
  console.log(`[WIFI] wpa_cli로 연결: ssid="${ssid}", password="${mask(password)}"`);
  const cli = useSudo ? 'sudo' : 'wpa_cli';
  const base = useSudo ? ['wpa_cli','-i','wlan0'] : ['-i','wlan0'];

  await cmd(cli, base.concat(['scan']));
  await sleep(2000);
  await cmd(cli, base.concat(['scan_results'])).catch(()=>{});

  const { stdout: addOut } = await run(cli, base.concat(['add_network']));
  const netId = (addOut || '').toString().trim();
  if (!/^\d+$/.test(netId)) throw new Error(`wpa_cli add_network 실패: ${addOut}`);

  await run(cli, base.concat(['set_network', netId, 'ssid', `"${ssid}"`]));
  await run(cli, base.concat(['set_network', netId, 'psk',  `"${password}"`]));
  await run(cli, base.concat(['set_network', netId, 'scan_ssid', '1'])).catch(()=>{});

  await run(cli, base.concat(['enable_network', netId]));
  await run(cli, base.concat(['save_config']));
  await run(cli, base.concat(['reconfigure']));

  return await waitForWifiUp(40_000);
}

// ----- 라우팅: NM이 관리하면 nmcli 우선 -----
async function connectWifi(ssid, password) {
  const nmManaging = await isNmActiveAndManaging();
  try {
    if (nmManaging) return await connectWifi_nmcli(ssid, password);
    return await connectWifi_wpacli(ssid, password, DEFAULT_USE_SUDO);
  } catch (e) {
    console.warn('[WIFI] 1차 연결 실패:', e.message);
    if (nmManaging) return await connectWifi_wpacli(ssid, password, DEFAULT_USE_SUDO);
    else            return await connectWifi_nmcli(ssid, password);
  }
}

// ----- Python 실행은 spawn (스트림 출력 직결) -----
function runOper(key, userEmail, homecamIp) {
  console.log(`[PY] ${PYTHON_BIN} ${OPER_SCRIPT} "${key}" "${userEmail}" "${homecamIp}"`);
  const pyCwd = path.dirname(OPER_SCRIPT);
  const child = spawn(PYTHON_BIN, [OPER_SCRIPT, key, userEmail, homecamIp], {
    stdio: 'inherit',
    env: process.env,
    cwd: pyCwd,      
  });
  child.on('exit', (code, signal) => {
    console.log(`[PY] oper_fi1.py 종료: code=${code} signal=${signal || 'none'}`);
  });
  child.on('error', (err) => {
    console.error('[PY] spawn error:', err);
  });
}

// ---- Write Characteristic 정의 ----
class IngressWriteCharacteristic extends bleno.Characteristic {
  constructor() {
    super({
      uuid: WRITE_CHAR_UUID,
      properties: ['write'],
      descriptors: [
        new bleno.Descriptor({
          uuid: '2901',
          value: 'Write data to configure Wi-Fi and run oper_fi1.py',
        }),
      ],
    });
  }

  onWriteRequest(data, offset, withoutResponse, callback) {
    try {
      if (offset !== 0) return callback(this.RESULT_ATTR_NOT_LONG);

      const raw = data.toString('utf8').trim();
      if (!raw || raw.length > 1024) return callback(this.RESULT_UNLIKELY_ERROR);
      console.log(`[BLE] Received payload: ${raw}`);

      let obj;
      try { obj = JSON.parse(raw); }
      catch { console.error('[BLE] JSON 파싱 실패'); return callback(this.RESULT_UNLIKELY_ERROR); }

      const ssid = obj.ssid;
      const password = obj.password;
      const key = obj.key;
      const userEmail = obj.user_email || obj.userEmail;
      const homecamIp = obj.homecamIp || obj.homecamIP || obj.homcameIP;

      if (!ssid || !password || !key || !userEmail || !homecamIp) {
        console.error('[BLE] 필수 필드 누락(ssid/password/key/user_email/homecamIp)');
        return callback(this.RESULT_UNLIKELY_ERROR);
      }

      // 즉시 성공 응답 (BLE 타임아웃 방지)
      callback(this.RESULT_SUCCESS);

      // 비동기 작업: 1) Wi-Fi 연결 -> 2) Python 실행
      (async () => {
        try {
          const net = await connectWifi(ssid, password);
          console.log(`[WIFI] connected SSID=${net.ssid}, IP=${net.ip}`);
          runOper(key, userEmail, homecamIp);  // ← 올바른 호출
        } catch (e) {
          console.error('[BLE] 처리 실패:', e.message);
        }
      })();
    } catch (e) {
      console.error('onWriteRequest 예외:', e);
      return callback(this.RESULT_UNLIKELY_ERROR);
    }
  }
}

const primaryService = new bleno.PrimaryService({
  uuid: SERVICE_UUID,
  characteristics: [new IngressWriteCharacteristic()],
});

// ---- 어댑터 상태/연결 이벤트 ----
bleno.on('stateChange', (state) => {
  console.log(`[BLE] stateChange: ${state}`);
  if (state === 'poweredOn') {
    bleno.startAdvertising(LOCAL_NAME, [SERVICE_UUID], (err) => {
      if (err) console.error('[BLE] advertising error:', err);
    });
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', (error) => {
  if (error) {
    console.error('[BLE] advertisingStart error:', error);
  } else {
    console.log(`[BLE] advertising as "${LOCAL_NAME}" (service: ${SERVICE_UUID})`);
    bleno.setServices([primaryService], (err) => {
      if (err) console.error('[BLE] setServices error:', err);
    });
  }
});

bleno.on('accept', (address) => {
  console.log(`[BLE] Central connected: ${address}`);
});

bleno.on('disconnect', (address) => {
  console.log(`[BLE] Central disconnected: ${address}`);
});
