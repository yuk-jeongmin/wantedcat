package aivle0514.backspringboot;
import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobClientBuilder;
import com.azure.storage.blob.sas.BlobSasPermission;
import com.azure.storage.blob.sas.BlobSasSignatureValues;
import com.azure.storage.common.sas.SasProtocol;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/blob")
public class SasController {

    @Value("${spring.cloud.azure.storage.blob.account-name}")
    private String accountName;

    @Value("${spring.cloud.azure.storage.blob.account-key}")
    private String accountKey;

    @Value("${spring.cloud.azure.storage.blob.container-name}")
    private String containerName;

    private String getBlobEndpoint() {
        return String.format("https://%s.blob.core.windows.net", accountName);
    }

    @GetMapping("/generate-sas")
    public ResponseEntity<Map<String, String>> generateBlobSas(
            @RequestParam("blobName") String blobName) {

        BlobClient blobClient = new BlobClientBuilder()
                .endpoint(getBlobEndpoint())
                .containerName(containerName)
                .blobName(blobName)
                .sasToken(generateSasToken(blobName))
                .buildClient();

        String sasUrl = blobClient.getBlobUrl();

        Map<String, String> response = new HashMap<>();
        response.put("sasUrl", sasUrl);
        response.put("sasToken", blobClient.getAccountUrl());

        return ResponseEntity.ok(response);
    }

    private String generateSasToken(String blobName) {
        BlobSasPermission permissions = new BlobSasPermission()
                .setReadPermission(true)
                .setWritePermission(true)
                .setCreatePermission(true);

        OffsetDateTime expiryTime = OffsetDateTime.now(ZoneOffset.UTC).plusMinutes(30);

        BlobSasSignatureValues values = new BlobSasSignatureValues(expiryTime, permissions)
                .setStartTime(OffsetDateTime.now(ZoneOffset.UTC).minusMinutes(1))
                .setProtocol(SasProtocol.HTTPS_ONLY)
                .setContainerName(containerName)
                .setBlobName(blobName);

        BlobClient blobClient = new BlobClientBuilder()
                .endpoint(getBlobEndpoint())
                .containerName(containerName)
                .blobName(blobName)
                .credential(new com.azure.storage.common.StorageSharedKeyCredential(accountName, accountKey))
                .buildClient();

        return blobClient.generateSas(values);
    }
}

