package com.CDIS.backend.dto;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * DTO returned to the client representing a single vehicle purchase record.
 * Captures a snapshot of the vehicle details at the time of purchase.
 */
public record PurchaseResponse(
    Long id,
    Long vehicleId,
    String make,
    String model,
    String category,
    BigDecimal price,
    Instant purchasedAt
) {}
