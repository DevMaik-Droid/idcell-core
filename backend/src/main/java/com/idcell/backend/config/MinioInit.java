package com.idcell.backend.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.Bucket;
import software.amazon.awssdk.services.s3.model.CreateBucketRequest;

import java.util.List;

@Component
@RequiredArgsConstructor
public class MinioInit {
    private final S3Client minioClient;

    @PostConstruct
    public void initBuckets() {
        try {
            List<String> existing = minioClient.listBuckets().buckets()
                    .stream().map(Bucket::name).toList();

            List<String> required = List.of("cellphones", "accesorios", "respuestos","usuarios");

            for (String b : required) {
                if (!existing.contains(b)) {
                    minioClient.createBucket(CreateBucketRequest.builder().bucket(b).build());
                    System.out.println("✅ Bucket creado: " + b);
                }
            }
        } catch (Exception e) {
            System.err.println("⚠️ Error creando buckets: " + e.getMessage());
        }
    }
}
