package com.warrantree.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateItemRequest {

    @NotBlank(message = "Item title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    @NotNull(message = "Vault ID is required")
    private Long vaultId;

    private Long categoryId;

    @Size(max = 100, message = "Brand must not exceed 100 characters")
    private String brand;

    @Size(max = 100, message = "Model must not exceed 100 characters")
    private String model;

    @Size(max = 100, message = "Serial number must not exceed 100 characters")
    private String serialNumber;

    @NotNull(message = "Purchase date is required")
    private LocalDate purchaseDate;

    private BigDecimal price;

    private Integer warrantyMonths;

    @Size(max = 1000, message = "Notes must not exceed 1000 characters")
    private String notes;
} 