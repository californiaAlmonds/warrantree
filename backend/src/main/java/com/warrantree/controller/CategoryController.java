package com.warrantree.controller;

import com.warrantree.entity.Category;
import com.warrantree.repository.CategoryRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Categories", description = "Category management operations")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    @GetMapping
    @Operation(summary = "Get all categories", description = "Retrieve all available categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        log.debug("Getting all categories");
        List<Category> categories = categoryRepository.findAllOrderByName();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/with-items")
    @Operation(summary = "Get categories with items", description = "Retrieve categories that have items")
    public ResponseEntity<List<Category>> getCategoriesWithItems() {
        log.debug("Getting categories with items");
        List<Category> categories = categoryRepository.findCategoriesWithItems();
        return ResponseEntity.ok(categories);
    }
} 