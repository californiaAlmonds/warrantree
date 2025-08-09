package com.warrantree.repository;

import com.warrantree.entity.Item;
import com.warrantree.entity.Vault;
import com.warrantree.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

        @Query("SELECT DISTINCT i FROM Item i " +
           "LEFT JOIN FETCH i.vault v " +
           "LEFT JOIN FETCH i.category c " +
           "WHERE i.vault = :vault")
    List<Item> findByVault(@Param("vault") Vault vault);
    
    List<Item> findByVaultId(Long vaultId);
    
    Page<Item> findByVaultId(Long vaultId, Pageable pageable);

    List<Item> findByVaultAndCategory(Vault vault, Category category);

    @Query("SELECT i FROM Item i WHERE i.vault = :vault AND " +
           "(LOWER(i.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(i.brand) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(i.model) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Item> findByVaultAndSearchTerm(@Param("vault") Vault vault, 
                                       @Param("search") String search, 
                                       Pageable pageable);

    @Query("SELECT i FROM Item i WHERE i.vault = :vault AND i.category = :category AND " +
           "(LOWER(i.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(i.brand) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(i.model) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Item> findByVaultAndCategoryAndSearchTerm(@Param("vault") Vault vault, 
                                                   @Param("category") Category category,
                                                   @Param("search") String search, 
                                                   Pageable pageable);

    @Query("SELECT i FROM Item i WHERE i.vault = :vault AND i.expiryDate BETWEEN :startDate AND :endDate")
    List<Item> findByVaultAndExpiryDateBetween(@Param("vault") Vault vault, 
                                              @Param("startDate") LocalDate startDate, 
                                              @Param("endDate") LocalDate endDate);

    @Query("SELECT i FROM Item i WHERE i.vault IN :vaults AND i.expiryDate BETWEEN :startDate AND :endDate")
    List<Item> findByVaultsAndExpiryDateBetween(@Param("vaults") List<Vault> vaults, 
                                               @Param("startDate") LocalDate startDate, 
                                               @Param("endDate") LocalDate endDate);

    @Query("SELECT i FROM Item i WHERE i.vault IN :vaults AND i.expiryDate <= :expiryDate AND i.status = 'ACTIVE'")
    List<Item> findExpiringSoonItems(@Param("vaults") List<Vault> vaults, @Param("expiryDate") LocalDate expiryDate);

    @Query("SELECT i FROM Item i WHERE i.vault IN :vaults AND i.expiryDate < :currentDate AND i.status = 'ACTIVE'")
    List<Item> findExpiredItems(@Param("vaults") List<Vault> vaults, @Param("currentDate") LocalDate currentDate);

    @Query("SELECT COUNT(i) FROM Item i WHERE i.vault = :vault")
    long countByVault(@Param("vault") Vault vault);

    @Query("SELECT COUNT(i) FROM Item i WHERE i.vault = :vault AND i.status = :status")
    long countByVaultAndStatus(@Param("vault") Vault vault, @Param("status") Item.Status status);
} 