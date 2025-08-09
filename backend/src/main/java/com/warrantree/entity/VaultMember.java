package com.warrantree.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "vault_members", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"vault_id", "user_id"}))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VaultMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vault_id", nullable = false)
    @JsonIgnore
    private Vault vault;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Role role = Role.VIEWER;

    @Column(name = "joined_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime joinedAt = LocalDateTime.now();

    public enum Role {
        OWNER,   // Full access, can delete vault and manage members
        EDITOR,  // Can add/edit/delete items and attachments
        VIEWER   // Can only view items and attachments
    }

    // Helper methods to check permissions
    public boolean canEdit() {
        return role == Role.OWNER || role == Role.EDITOR;
    }

    public boolean canManageMembers() {
        return role == Role.OWNER;
    }

    public boolean canDelete() {
        return role == Role.OWNER;
    }
} 