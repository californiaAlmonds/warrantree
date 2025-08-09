package com.warrantree.controller;

import com.warrantree.dto.CreateVaultRequest;
import com.warrantree.dto.VaultDto;
import com.warrantree.dto.VaultSummaryDto;
import com.warrantree.entity.User;
import com.warrantree.service.VaultService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vaults")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Vaults", description = "Vault management operations")
public class VaultController {

    private final VaultService vaultService;

    @GetMapping
    @Operation(summary = "Get all vaults", description = "Retrieve all vaults accessible by the current user")
    public ResponseEntity<List<VaultSummaryDto>> getAllVaults() {
        // TODO: Get current user from security context
        // For now, create a dummy user for testing
        User dummyUser = createDummyUser();
        
        List<VaultSummaryDto> vaults = vaultService.getAllVaultsForUser(dummyUser);
        return ResponseEntity.ok(vaults);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get vault by ID", description = "Retrieve a specific vault by its ID")
    public ResponseEntity<VaultDto> getVaultById(
            @Parameter(description = "Vault ID") @PathVariable Long id) {
        // TODO: Get current user from security context
        User dummyUser = createDummyUser();
        
        VaultDto vault = vaultService.getVaultById(id, dummyUser);
        return ResponseEntity.ok(vault);
    }

    @PostMapping
    @Operation(summary = "Create vault", description = "Create a new vault")
    public ResponseEntity<VaultSummaryDto> createVault(@Valid @RequestBody CreateVaultRequest request) {
        // TODO: Get current user from security context
        User dummyUser = createDummyUser();
        
        VaultSummaryDto vault = vaultService.createVault(request, dummyUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(vault);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update vault", description = "Update an existing vault")
    public ResponseEntity<VaultDto> updateVault(
            @Parameter(description = "Vault ID") @PathVariable Long id,
            @Valid @RequestBody CreateVaultRequest request) {
        // TODO: Get current user from security context
        User dummyUser = createDummyUser();
        
        VaultDto vault = vaultService.updateVault(id, request, dummyUser);
        return ResponseEntity.ok(vault);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete vault", description = "Delete a vault and all its items")
    public ResponseEntity<Void> deleteVault(
            @Parameter(description = "Vault ID") @PathVariable Long id) {
        // TODO: Get current user from security context
        User dummyUser = createDummyUser();
        
        vaultService.deleteVault(id, dummyUser);
        return ResponseEntity.noContent().build();
    }

    // TODO: Remove this dummy user creation once authentication is implemented
    private User createDummyUser() {
        return User.builder()
                .id(1L)
                .email("demo@warrantree.com")
                .name("Demo User")
                .emailVerified(true)
                .role(User.Role.USER)
                .build();
    }
} 