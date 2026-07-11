package com.CDIS.backend.service;

import java.util.List;

import com.CDIS.backend.dto.VehicleRequest;
import com.CDIS.backend.dto.VehicleResponse;

public interface VehicleService {

    VehicleResponse create(VehicleRequest request);

    List<VehicleResponse> getAll();

    VehicleResponse update(Long id, VehicleRequest request);

    void delete(Long id);
}
