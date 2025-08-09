package com.warrantree.repository;

import com.warrantree.entity.Vault;
import com.warrantree.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VaultRepository extends JpaRepository<Vault, Long> {

    List<Vault> findByOwner(User owner);

    @Query("SELECT DISTINCT v FROM Vault v " +
           "LEFT JOIN FETCH v.owner " +
           "LEFT JOIN FETCH v.members vm " +
           "LEFT JOIN FETCH vm.user " +
           "WHERE v.owner = :user OR vm.user = :user")
    List<Vault> findVaultsAccessibleByUser(@Param("user") User user);

    @Query("SELECT v FROM Vault v JOIN v.members vm WHERE vm.user = :user")
    List<Vault> findVaultsByMember(@Param("user") User user);

    @Query("SELECT DISTINCT v FROM Vault v " +
           "LEFT JOIN FETCH v.owner " +
           "LEFT JOIN FETCH v.members vm " +
           "LEFT JOIN FETCH vm.user " +
           "WHERE v.id = :vaultId AND (v.owner = :user OR vm.user = :user)")
    Optional<Vault> findVaultAccessibleByUser(@Param("vaultId") Long vaultId, @Param("user") User user);

    boolean existsByNameAndOwner(String name, User owner);
} 