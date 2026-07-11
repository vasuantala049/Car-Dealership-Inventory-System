package com.CDIS.backend.service;

import java.math.BigDecimal;
import java.util.List;

import com.CDIS.backend.dto.VehicleRequest;
import com.CDIS.backend.dto.VehicleResponse;

public interface VehicleService {

    VehicleResponse create(VehicleRequest request);

    List<VehicleResponse> getAll();

    VehicleResponse update(Long id, VehicleRequest request);

    List<VehicleResponse> searchVehicles(String make, String model, String category, BigDecimal minPrice, BigDecimal maxPrice);

    /**
     * Decrements vehicle stock by 1 and records the purchase against the given user.
     * @param id Vehicle ID
     * @param userEmail Email of the user making the purchase
     */
    VehicleResponse purchase(Long id, String userEmail);

    VehicleResponse restock(Long id, Integer amount);

    void delete(Long id);
}
