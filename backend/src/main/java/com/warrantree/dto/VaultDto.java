package com.warrantree.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VaultDto {
    private Long id;
    private String name;
    private String description;
    private UserSummaryDto owner;
    private List<VaultMemberDto> members;
    private Long itemCount;
    private Long expiringSoonCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserSummaryDto {
        private Long id;
        private String name;
        private String email;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VaultMemberDto {
        private Long id;
        private UserSummaryDto user;
        private String role;
        private LocalDateTime joinedAt;
    }
} 