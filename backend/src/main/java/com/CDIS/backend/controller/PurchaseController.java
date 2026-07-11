package com.CDIS.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.CDIS.backend.dto.PurchaseResponse;
import com.CDIS.backend.repository.PurchaseRepository;

/**
 * REST Controller that exposes purchase history endpoints.
 * Allows authenticated users to retrieve their own vehicle purchase records.
 */
@RestController
@RequestMapping("/api/purchases")
public class PurchaseController {

    private final PurchaseRepository purchaseRepository;

    public PurchaseController(PurchaseRepository purchaseRepository) {
        this.purchaseRepository = purchaseRepository;
    }

    /**
     * Returns the purchase history for the currently authenticated user.
     * The user identity is extracted from the JWT via Spring Security's @AuthenticationPrincipal.
     *
     * @param email The authenticated user's email (injected by Spring Security)
     * @return List of PurchaseResponse records ordered by most recent first
     */
    @GetMapping("/my")
    public ResponseEntity<List<PurchaseResponse>> getMyPurchases(
            @AuthenticationPrincipal String email) {

        // The buyer's email is stored directly as the principal string

        List<PurchaseResponse> purchases = purchaseRepository
                .findByUserEmailOrderByPurchasedAtDesc(email)
                .stream()
                .map(p -> new PurchaseResponse(
                        p.getId(),
                        p.getVehicleId(),
                        p.getMake(),
                        p.getModel(),
                        p.getCategory(),
                        p.getPrice(),
                        p.getPurchasedAt()
                ))
                .toList();

        return ResponseEntity.ok(purchases);
    }
}
