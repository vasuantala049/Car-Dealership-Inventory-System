package com.CDIS.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.CDIS.backend.dto.VehicleRequest;
import com.CDIS.backend.dto.VehicleResponse;
import com.CDIS.backend.entity.Vehicle;
import com.CDIS.backend.exception.VehicleNotFoundException;
import com.CDIS.backend.repository.VehicleRepository;

@Service
@Transactional
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleServiceImpl(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    @Override
    public VehicleResponse create(VehicleRequest request) {
        Vehicle vehicle = new Vehicle(
                null,
                request.make(),
                request.model(),
                request.category(),
                request.price(),
                request.quantity());

        Vehicle saved = vehicleRepository.save(vehicle);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleResponse> getAll() {
        return vehicleRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public VehicleResponse update(Long id, VehicleRequest request) {
        Vehicle existing = vehicleRepository.findById(id)
                .orElseThrow(() -> new VehicleNotFoundException(id));

        existing.setMake(request.make());
        existing.setModel(request.model());
        existing.setCategory(request.category());
        existing.setPrice(request.price());
        existing.setQuantity(request.quantity());

        Vehicle updated = vehicleRepository.save(existing);
        return toResponse(updated);
    }

    @Override
    public void delete(Long id) {
        if (!vehicleRepository.existsById(id)) {
            throw new VehicleNotFoundException(id);
        }
        vehicleRepository.deleteById(id);
    }

    private VehicleResponse toResponse(Vehicle vehicle) {
        return new VehicleResponse(
                vehicle.getId(),
                vehicle.getMake(),
                vehicle.getModel(),
                vehicle.getCategory(),
                vehicle.getPrice(),
                vehicle.getQuantity(),
                vehicle.getVersion());
    }
}
