package com.CDIS.backend.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import com.CDIS.backend.dto.QuantityRequest;
import com.CDIS.backend.dto.VehicleRequest;
import com.CDIS.backend.dto.VehicleResponse;
import com.CDIS.backend.exception.OutOfStockException;
import com.CDIS.backend.exception.VehicleNotFoundException;
import com.CDIS.backend.service.VehicleService;

/**
 * REST Controller for managing vehicle inventory operations.
 * Exposes endpoints for CRUD operations, searching, purchasing, and restocking vehicles.
 * Secured via Spring Security roles defined in SecurityConfig.
 */
@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    /**
     * Creates a new vehicle in the inventory.
     * @param request The vehicle details to create.
     * @return The created vehicle wrapped in a ResponseEntity with HTTP 201 Created.
     */
    @PostMapping
    public ResponseEntity<VehicleResponse> create(@RequestBody VehicleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(vehicleService.create(request));
    }

    /**
     * Retrieves all vehicles currently in the inventory.
     * @return A list of all vehicles.
     */
    @GetMapping
    public ResponseEntity<List<VehicleResponse>> getAll() {
        return ResponseEntity.ok(vehicleService.getAll());
    }

    /**
     * Searches the inventory based on various optional criteria.
     * @param make Make of the vehicle (e.g., Toyota).
     * @param model Model of the vehicle (e.g., Camry).
     * @param category Category of the vehicle (e.g., Sedan).
     * @param minPrice Minimum price boundary.
     * @param maxPrice Maximum price boundary.
     * @return A list of vehicles matching the criteria.
     */
    @GetMapping("/search")
    public ResponseEntity<List<VehicleResponse>> search(
            @RequestParam(required = false) String make,
            @RequestParam(required = false) String model,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice
    ) {
        return ResponseEntity.ok(vehicleService.searchVehicles(make, model, category, minPrice, maxPrice));
    }

    /**
     * Updates an existing vehicle's details.
     * @param id The ID of the vehicle to update.
     * @param request The updated vehicle details.
     * @return The updated vehicle.
     */
    @PutMapping("/{id}")
    public ResponseEntity<VehicleResponse> update(@PathVariable Long id, @RequestBody VehicleRequest request) {
        return ResponseEntity.ok(vehicleService.update(id, request));
    }

    /**
     * Simulates the purchase of a vehicle by decrementing its stock quantity by 1.
     * Also records the purchase under the authenticated user's email for their garage.
     * @param id The ID of the vehicle to purchase.
     * @param userDetails The authenticated user (injected by Spring Security)
     * @return The updated vehicle details reflecting the new quantity.
     */
    @PostMapping("/{id}/purchase")
    public ResponseEntity<VehicleResponse> purchase(
            @PathVariable Long id,
            @AuthenticationPrincipal String email) {
        // The buyer's email is stored directly as the principal string
        return ResponseEntity.ok(vehicleService.purchase(id, email));
    }

    @PostMapping("/{id}/restock")
    public ResponseEntity<VehicleResponse> restock(@PathVariable Long id, @Valid @RequestBody QuantityRequest request) {
        return ResponseEntity.ok(vehicleService.restock(id, request.amount()));
    }

    /**
     * Deletes a vehicle from the inventory entirely.
     * @param id The ID of the vehicle to delete.
     * @return A 204 No Content response.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        vehicleService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(VehicleNotFoundException.class)
    public ResponseEntity<Void> handleVehicleNotFound(VehicleNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @ExceptionHandler(OutOfStockException.class)
    public ResponseEntity<Void> handleOutOfStock(OutOfStockException exception) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}
