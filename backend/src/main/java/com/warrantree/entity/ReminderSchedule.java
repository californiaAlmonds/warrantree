package com.warrantree.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "reminder_schedules")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReminderSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    @JsonIgnore
    private Item item;

    @Column(name = "reminder_days", nullable = false)
    private Integer reminderDays;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ReminderType type = ReminderType.EMAIL;

    public enum ReminderType {
        EMAIL,      // Email reminder
        SMS,        // SMS reminder (future)
        PUSH        // Push notification (future)
    }
} 