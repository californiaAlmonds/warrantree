package com.warrantree.controller;

import com.warrantree.dto.CreateItemRequest;
import com.warrantree.dto.ItemDto;
import com.warrantree.dto.ItemSummaryDto;
import com.warrantree.entity.User;
import com.warrantree.service.ItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/items")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Items", description = "Item management operations")
public class ItemController {

    private final ItemService itemService;

    @GetMapping
    @Operation(summary = "Get items", description = "Retrieve items for a vault")
    public ResponseEntity<List<ItemSummaryDto>> getItems(
            @Parameter(description = "Vault ID") @RequestParam Long vaultId) {
        
        try {
            // Ultra-simple: Just get all items for vault
            List<ItemSummaryDto> items = itemService.getSimpleItemsByVault(vaultId);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            log.error("Error getting items for vault {}: {}", vaultId, e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get item by ID", description = "Retrieve a specific item by its ID")
    public ResponseEntity<ItemDto> getItemById(
            @Parameter(description = "Item ID") @PathVariable Long id) {
        // TODO: Get current user from security context
        User dummyUser = createDummyUser();
        
        ItemDto item = itemService.getItemById(id, dummyUser);
        return ResponseEntity.ok(item);
    }

    @PostMapping
    @Operation(summary = "Create item", description = "Create a new item")
    public ResponseEntity<ItemSummaryDto> createItem(@Valid @RequestBody CreateItemRequest request) {
        // TODO: Get current user from security context
        User dummyUser = createDummyUser();
        
        ItemSummaryDto item = itemService.createItem(request, dummyUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(item);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update item", description = "Update an existing item")
    public ResponseEntity<ItemDto> updateItem(
            @Parameter(description = "Item ID") @PathVariable Long id,
            @Valid @RequestBody CreateItemRequest request) {
        // TODO: Get current user from security context
        User dummyUser = createDummyUser();
        
        ItemDto item = itemService.updateItem(id, request, dummyUser);
        return ResponseEntity.ok(item);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete item", description = "Delete an item")
    public ResponseEntity<Void> deleteItem(
            @Parameter(description = "Item ID") @PathVariable Long id) {
        // TODO: Get current user from security context
        User dummyUser = createDummyUser();
        
        itemService.deleteItem(id, dummyUser);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/expiring")
    @Operation(summary = "Get expiring items", description = "Retrieve items expiring within specified days")
    public ResponseEntity<List<ItemDto>> getExpiringItems(
            @Parameter(description = "Days until expiry") @RequestParam(defaultValue = "30") int days) {
        // TODO: Get current user from security context
        User dummyUser = createDummyUser();
        
        List<ItemDto> items = itemService.getExpiringSoonItems(dummyUser, days);
        return ResponseEntity.ok(items);
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