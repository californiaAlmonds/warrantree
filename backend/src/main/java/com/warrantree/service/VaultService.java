package com.warrantree.service;

import com.warrantree.dto.CreateVaultRequest;
import com.warrantree.dto.VaultDto;
import com.warrantree.dto.VaultSummaryDto;
import com.warrantree.entity.User;
import com.warrantree.entity.Vault;
import com.warrantree.entity.VaultMember;
import com.warrantree.repository.ItemRepository;
import com.warrantree.repository.VaultRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class VaultService {

    private final VaultRepository vaultRepository;
    private final ItemRepository itemRepository;

    public List<VaultSummaryDto> getAllVaultsForUser(User user) {
        log.debug("Getting all vaults for user: {}", user.getEmail());
        List<Vault> vaults = vaultRepository.findByOwner(user);  // Use simple query
        return vaults.stream()
                .map(this::convertToSummaryDto)
                .collect(Collectors.toList());
    }

    public VaultDto getVaultById(Long vaultId, User user) {
        log.debug("Getting vault {} for user: {}", vaultId, user.getEmail());
        Vault vault = vaultRepository.findVaultAccessibleByUser(vaultId, user)
                .orElseThrow(() -> new RuntimeException("Vault not found or access denied"));
        return convertToDto(vault);
    }

    public VaultSummaryDto createVault(CreateVaultRequest request, User owner) {
        log.debug("Creating vault for user: {}", owner.getEmail());
        
        // Check if vault name already exists for this user
        if (vaultRepository.existsByNameAndOwner(request.getName(), owner)) {
            throw new RuntimeException("Vault with this name already exists");
        }

        Vault vault = Vault.builder()
                .name(request.getName())
                .description(request.getDescription())
                .owner(owner)
                .build();

        // Add owner as a member with OWNER role
        VaultMember ownerMember = VaultMember.builder()
                .vault(vault)
                .user(owner)
                .role(VaultMember.Role.OWNER)
                .build();
        
        vault.addMember(ownerMember);

        Vault savedVault = vaultRepository.save(vault);
        log.info("Created vault {} for user {}", savedVault.getId(), owner.getEmail());
        
        return convertToSummaryDto(savedVault);
    }

    public VaultDto updateVault(Long vaultId, CreateVaultRequest request, User user) {
        log.debug("Updating vault {} for user: {}", vaultId, user.getEmail());
        
        Vault vault = vaultRepository.findVaultAccessibleByUser(vaultId, user)
                .orElseThrow(() -> new RuntimeException("Vault not found or access denied"));

        // Check if user has permission to edit
        boolean canEdit = vault.getMembers().stream()
                .anyMatch(member -> member.getUser().equals(user) && member.canEdit());

        if (!canEdit) {
            throw new RuntimeException("Insufficient permissions to edit vault");
        }

        vault.setName(request.getName());
        vault.setDescription(request.getDescription());

        Vault savedVault = vaultRepository.save(vault);
        log.info("Updated vault {}", savedVault.getId());
        
        return convertToDto(savedVault);
    }

    public void deleteVault(Long vaultId, User user) {
        log.debug("Deleting vault {} for user: {}", vaultId, user.getEmail());
        
        Vault vault = vaultRepository.findVaultAccessibleByUser(vaultId, user)
                .orElseThrow(() -> new RuntimeException("Vault not found or access denied"));

        // Check if user is the owner
        if (!vault.getOwner().equals(user)) {
            throw new RuntimeException("Only vault owner can delete the vault");
        }

        vaultRepository.delete(vault);
        log.info("Deleted vault {}", vaultId);
    }

    private VaultDto convertToDto(Vault vault) {
        // Calculate statistics
        long itemCount = itemRepository.countByVault(vault);
        long expiringSoonCount = itemRepository.findExpiringSoonItems(
                List.of(vault), LocalDate.now().plusDays(30)
        ).size();

        return VaultDto.builder()
                .id(vault.getId())
                .name(vault.getName())
                .description(vault.getDescription())
                .owner(VaultDto.UserSummaryDto.builder()
                        .id(vault.getOwner().getId())
                        .name(vault.getOwner().getName())
                        .email(vault.getOwner().getEmail())
                        .build())
                .members(vault.getMembers().stream()
                        .map(member -> VaultDto.VaultMemberDto.builder()
                                .id(member.getId())
                                .user(VaultDto.UserSummaryDto.builder()
                                        .id(member.getUser().getId())
                                        .name(member.getUser().getName())
                                        .email(member.getUser().getEmail())
                                        .build())
                                .role(member.getRole().name())
                                .joinedAt(member.getJoinedAt())
                                .build())
                        .collect(Collectors.toList()))
                .itemCount(itemCount)
                .expiringSoonCount(expiringSoonCount)
                .createdAt(vault.getCreatedAt())
                .updatedAt(vault.getUpdatedAt())
                .build();
    }

    private VaultSummaryDto convertToSummaryDto(Vault vault) {
        return VaultSummaryDto.builder()
                .id(vault.getId())
                .name(vault.getName())
                .description(vault.getDescription())
                .ownerName(vault.getOwner().getName())
                .ownerEmail(vault.getOwner().getEmail())
                .itemCount(vault.getItems().size())
                .memberCount(vault.getMembers().size())
                .createdAt(vault.getCreatedAt())
                .updatedAt(vault.getUpdatedAt())
                .build();
    }
} 