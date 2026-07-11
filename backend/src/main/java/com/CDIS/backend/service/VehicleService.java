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

    void delete(Long id);
}
