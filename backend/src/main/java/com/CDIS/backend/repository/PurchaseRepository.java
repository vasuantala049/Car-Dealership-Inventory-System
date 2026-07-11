package com.CDIS.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.CDIS.backend.entity.Purchase;

/**
 * Spring Data JPA repository for querying the 'purchases' table.
 */
public interface PurchaseRepository extends JpaRepository<Purchase, Long> {

    /**
     * Returns all purchases made by a specific user, ordered by most recent first.
     * @param userEmail The email of the user whose purchases to retrieve
     * @return List of Purchase records
     */
    List<Purchase> findByUserEmailOrderByPurchasedAtDesc(String userEmail);
}
