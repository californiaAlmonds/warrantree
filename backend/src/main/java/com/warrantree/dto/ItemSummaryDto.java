package com.warrantree.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemSummaryDto {
    private Long id;
    private String title;
    private Long vaultId;
    private String vaultName;
    private String categoryName;
    private String brand;
    private String model;
    private String serialNumber;
    private LocalDate purchaseDate;
    private BigDecimal price;
    private Integer warrantyMonths;
    private LocalDate expiryDate;
    private String status;
    private String notes;
    private Boolean isExpired;
    private Boolean isExpiringSoon;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 