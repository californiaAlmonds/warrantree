package com.warrantree.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categories")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    @NotBlank(message = "Category name is required")
    @Size(max = 50, message = "Category name must not exceed 50 characters")
    private String name;

    @Size(max = 200, message = "Description must not exceed 200 characters")
    private String description;

    @Size(max = 50, message = "Icon must not exceed 50 characters")
    private String icon;

    @Column(name = "reminder_days_default")
    @Builder.Default
    private Integer reminderDaysDefault = 30;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    @Builder.Default
    @JsonIgnore
    private List<Item> items = new ArrayList<>();

    // Predefined categories
    public static final String ELECTRONICS = "Electronics";
    public static final String APPLIANCES = "Appliances";
    public static final String INSURANCE = "Insurance";
    public static final String DOCUMENTS = "Documents";
    public static final String VEHICLES = "Vehicles";
    public static final String HOME_GARDEN = "Home & Garden";
    public static final String HEALTH_BEAUTY = "Health & Beauty";
    public static final String OTHER = "Other";
} 