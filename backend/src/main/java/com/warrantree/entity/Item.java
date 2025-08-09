package com.warrantree.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank(message = "Item title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vault_id", nullable = false)
    private Vault vault;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Size(max = 100, message = "Brand must not exceed 100 characters")
    private String brand;

    @Size(max = 100, message = "Model must not exceed 100 characters")
    private String model;

    @Column(name = "serial_number")
    @Size(max = 100, message = "Serial number must not exceed 100 characters")
    private String serialNumber;

    @Column(name = "purchase_date", nullable = false)
    @NotNull(message = "Purchase date is required")
    private LocalDate purchaseDate;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "warranty_months")
    private Integer warrantyMonths;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Status status = Status.ACTIVE;

    @Column(length = 1000)
    @Size(max = 1000, message = "Notes must not exceed 1000 characters")
    private String notes;

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @JsonIgnore
    private List<Attachment> attachments = new ArrayList<>();

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @JsonIgnore
    private List<ReminderSchedule> reminderSchedules = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        // Calculate expiry date if purchase date and warranty months are provided
        if (purchaseDate != null && warrantyMonths != null && warrantyMonths > 0) {
            this.expiryDate = purchaseDate.plusMonths(warrantyMonths);
        }
    }

    // Helper methods
    public void addAttachment(Attachment attachment) {
        attachments.add(attachment);
        attachment.setItem(this);
    }

    public void removeAttachment(Attachment attachment) {
        attachments.remove(attachment);
        attachment.setItem(null);
    }

    public boolean isExpired() {
        return expiryDate != null && expiryDate.isBefore(LocalDate.now());
    }

    public boolean isExpiringSoon(int days) {
        return expiryDate != null && 
               expiryDate.isBefore(LocalDate.now().plusDays(days)) && !isExpired();
    }

    public enum Status {
        ACTIVE,     // Item is active and warranty is valid
        EXPIRED,    // Warranty has expired
        CLAIMED,    // Warranty claim has been made
        RENEWED     // Warranty has been renewed/extended
    }
} 