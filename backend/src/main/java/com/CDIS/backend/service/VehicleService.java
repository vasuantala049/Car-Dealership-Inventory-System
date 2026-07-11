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

    VehicleResponse purchase(Long id);

    VehicleResponse restock(Long id, Integer amount);

    void delete(Long id);
}
