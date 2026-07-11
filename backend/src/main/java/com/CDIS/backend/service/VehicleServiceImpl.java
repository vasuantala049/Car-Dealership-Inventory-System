package com.CDIS.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;

import com.CDIS.backend.dto.VehicleRequest;
import com.CDIS.backend.dto.VehicleResponse;
import com.CDIS.backend.entity.Purchase;
import com.CDIS.backend.entity.Vehicle;
import com.CDIS.backend.exception.OutOfStockException;
import com.CDIS.backend.exception.VehicleNotFoundException;
import com.CDIS.backend.repository.PurchaseRepository;
import com.CDIS.backend.repository.VehicleRepository;
import com.CDIS.backend.repository.VehicleSpecifications;
import org.springframework.data.jpa.domain.Specification;

@Service
@Transactional
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;
    private final PurchaseRepository purchaseRepository;

    public VehicleServiceImpl(VehicleRepository vehicleRepository, PurchaseRepository purchaseRepository) {
        this.vehicleRepository = vehicleRepository;
        this.purchaseRepository = purchaseRepository;
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
    @Transactional(readOnly = true)
    public List<VehicleResponse> searchVehicles(String make, String model, String category, BigDecimal minPrice, BigDecimal maxPrice) {
        Specification<Vehicle> spec = VehicleSpecifications.searchVehicles(make, model, category, minPrice, maxPrice);
        return vehicleRepository.findAll(spec).stream().map(this::toResponse).toList();
    }

    @Override
    public VehicleResponse purchase(Long id, String userEmail) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new VehicleNotFoundException(id));
        
        if (vehicle.getQuantity() <= 0) {
            throw new OutOfStockException("Vehicle with id " + id + " is out of stock.");
        }
        
        // Decrement the vehicle stock
        vehicle.setQuantity(vehicle.getQuantity() - 1);
        Vehicle updated = vehicleRepository.save(vehicle);

        // Record a snapshot of the purchase so the user can see it in their garage
        Purchase purchase = new Purchase(
                userEmail,
                vehicle.getId(),
                vehicle.getMake(),
                vehicle.getModel(),
                vehicle.getCategory(),
                vehicle.getPrice(),
                Instant.now()
        );
        purchaseRepository.save(purchase);

        return toResponse(updated);
    }

    @Override
    public VehicleResponse restock(Long id, Integer amount) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new VehicleNotFoundException(id));
        
        vehicle.setQuantity(vehicle.getQuantity() + amount);
        Vehicle updated = vehicleRepository.save(vehicle);
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
