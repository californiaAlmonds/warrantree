package com.warrantree.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemDto {
    private Long id;
    private String title;
    private Long vaultId;
    private CategoryDto category;
    private String brand;
    private String model;
    private String serialNumber;
    private LocalDate purchaseDate;
    private BigDecimal price;
    private Integer warrantyMonths;
    private LocalDate expiryDate;
    private String status;
    private String notes;
    private List<AttachmentDto> attachments;
    private Boolean isExpired;
    private Boolean isExpiringSoon;
    private Integer daysUntilExpiry;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryDto {
        private Long id;
        private String name;
        private String description;
        private String icon;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AttachmentDto {
        private Long id;
        private String fileUrl;
        private String fileName;
        private Long fileSize;
        private String fileType;
        private String type;
        private LocalDateTime uploadedAt;
        private String uploadedByName;
    }
} 