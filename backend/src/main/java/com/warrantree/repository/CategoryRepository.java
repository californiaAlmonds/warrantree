package com.warrantree.repository;

import com.warrantree.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findByName(String name);

    boolean existsByName(String name);

    @Query("SELECT c FROM Category c ORDER BY c.name ASC")
    List<Category> findAllOrderByName();

    @Query("SELECT c FROM Category c WHERE SIZE(c.items) > 0 ORDER BY c.name ASC")
    List<Category> findCategoriesWithItems();
} 