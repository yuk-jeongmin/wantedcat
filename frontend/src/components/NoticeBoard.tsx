// src/pages/NoticesBoard.tsx
import { useEffect, useMemo, useState } from 'react';
import { Button } from "./ui/button";
import { InlineSearch } from "./InlineSearch";
import { NoticeTable } from './NoticeTable';
import { NoticeDetail } from './NoticeDetail';
import { CreateNoticeForm } from './CreateNoticeForm';
import type { Notice } from './NoticeCard';
import { listNotices, getNotice, createNotice, updateNotice, deleteNotice } from '@/api/notices';

// 간단한 디바운스 훅 (없으면 별도 파일로 분리해도 됨)
function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function NoticesBoard() {
  // 로그인 붙기 전 임시 사용자
  const [currentUser] = useState<{ username: string; role: string } | null>({
    username: '관리자', // 필요 시 바꿔서 사용
    role: 'admin',
  });

  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const [resultsCount, setResultsCount] = useState(0);

  // 검색
  const [searchTerm, setSearchTerm] = useState('');
  const dq = useDebounce(searchTerm, 300);

  // 작성/수정 모달
  const [openForm, setOpenForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);

  // 상세 모달
  const [openDetail, setOpenDetail] = useState(false);
  const [selected, setSelected] = useState<Notice | null>(null);

  const fetchList = async () => {
    setLoading(true);
    try {
      const page = await listNotices({ page: 0, size: 20, q: dq || undefined });
      setNotices(page.content);
      setResultsCount(page.totalElements);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, [dq]);

  const handleRowClick = async (n: Notice) => {
    try {
      const fresh = await getNotice(n.id);
      setSelected(fresh);
      setOpenDetail(true);
    } catch {
      alert('공지를 불러오지 못했습니다.');
    }
  };

  const handleOpenCreate = () => {
    setEditingNotice(null);
    setOpenForm(true);
  };

  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setOpenForm(true);
  };

  const handleDelete = async (noticeId: number) => {
    const target = notices.find(n => n.id === noticeId);
    if (!target) return;
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      // ⚠️ 백엔드는 author 문자열로 검증
      await deleteNotice(noticeId, target.author);
      await fetchList();
      if (openDetail && selected?.id === noticeId) {
        setOpenDetail(false);
        setSelected(null);
      }
    } catch {
      alert('삭제 실패(작성자 일치 필요)');
    }
  };

  // CreateNoticeForm → onSubmit
  const handleSubmit = async (payload: Omit<Notice, 'id'|'views'|'createdAt'>) => {
  try {
    if (editingNotice) {
      const { author, ...rest } = payload;          // ← author 분리
      await updateNotice(editingNotice.id, { author, ...rest });
    } else {
      await createNotice(payload);
    }
    await fetchList();
  } catch (e) {
    console.error(e);
    alert('저장 실패');
  }
};

  const canEditSelected  = useMemo(
    () => !!(selected && (currentUser?.username === selected.author || currentUser?.role === 'admin')),
    [selected, currentUser]
  );
  const canDeleteSelected = canEditSelected;

  return (
    <div className="space-y-4">
      {/* 상단 바 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">공지사항</h2>
        <Button onClick={handleOpenCreate}>공지 등록</Button>
      </div>

      {/* 검색 */}
      <InlineSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        resultsCount={resultsCount}
      />

      {/* 목록 */}
      <NoticeTable
        notices={notices}
        onNoticeClick={handleRowClick}
        currentUser={currentUser}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* 작성/수정 모달 */}
      {openForm && (
        <CreateNoticeForm
          editingNotice={editingNotice}
          onClose={() => setOpenForm(false)}
          onSubmit={handleSubmit}
        />
      )}

      {/* 상세 모달 */}
      {openDetail && selected && (
        <NoticeDetail
          notice={selected}
          onBack={() => { setOpenDetail(false); setSelected(null); }}
          canEdit={canEditSelected}
          canDelete={canDeleteSelected}
          onEdit={() => { setOpenDetail(false); handleEdit(selected); }}
          onDelete={() => { handleDelete(selected.id); }}
        />
      )}
    </div>
  );
}
