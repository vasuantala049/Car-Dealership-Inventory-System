package com.CDIS.backend.entity;

import java.math.BigDecimal;
import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Represents a record of a vehicle purchase made by a user.
 * Stored in the 'purchases' table for tracking user ownership history.
 */
@Entity
@Table(name = "purchases")
public class Purchase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Email of the user who made this purchase */
    @Column(nullable = false)
    private String userEmail;

    /** Snapshot of vehicle details at the time of purchase */
    @Column(nullable = false)
    private Long vehicleId;

    @Column(nullable = false)
    private String make;

    @Column(nullable = false)
    private String model;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private BigDecimal price;

    /** Timestamp of when the purchase occurred */
    @Column(nullable = false)
    private Instant purchasedAt;

    protected Purchase() {}

    public Purchase(String userEmail, Long vehicleId, String make, String model,
                    String category, BigDecimal price, Instant purchasedAt) {
        this.userEmail = userEmail;
        this.vehicleId = vehicleId;
        this.make = make;
        this.model = model;
        this.category = category;
        this.price = price;
        this.purchasedAt = purchasedAt;
    }

    public Long getId() { return id; }
    public String getUserEmail() { return userEmail; }
    public Long getVehicleId() { return vehicleId; }
    public String getMake() { return make; }
    public String getModel() { return model; }
    public String getCategory() { return category; }
    public BigDecimal getPrice() { return price; }
    public Instant getPurchasedAt() { return purchasedAt; }
}
