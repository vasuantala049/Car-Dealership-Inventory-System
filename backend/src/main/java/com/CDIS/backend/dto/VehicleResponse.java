package com.CDIS.backend.dto;

import java.math.BigDecimal;

public record VehicleResponse(
        Long id,
        String make,
        String model,
        String category,
        BigDecimal price,
        Integer quantity,
        Long version
) {
}
