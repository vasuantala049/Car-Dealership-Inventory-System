package com.CDIS.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.CDIS.backend.dto.VehicleResponse;
import com.CDIS.backend.entity.Vehicle;
import com.CDIS.backend.exception.OutOfStockException;
import com.CDIS.backend.repository.VehicleRepository;

@ExtendWith(MockitoExtension.class)
class VehicleServiceInventoryTest {

    @Mock
    private VehicleRepository vehicleRepository;

    private VehicleService vehicleService;

    @BeforeEach
    void setUp() {
        vehicleService = new VehicleServiceImpl(vehicleRepository);
    }

    @Test
    void purchase_decrementsQuantityAndSaves() {
        Vehicle vehicle = new Vehicle(1L, "Honda", "Civic", "Sedan", new BigDecimal("22000"), 3);
        
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(vehicle));
        when(vehicleRepository.save(any(Vehicle.class))).thenAnswer(i -> i.getArgument(0));

        VehicleResponse response = vehicleService.purchase(1L);

        assertThat(response.quantity()).isEqualTo(2);
        verify(vehicleRepository).save(vehicle);
        assertThat(vehicle.getQuantity()).isEqualTo(2);
    }

    @Test
    void purchase_whenQuantityIsZero_throwsOutOfStockException() {
        Vehicle vehicle = new Vehicle(1L, "Honda", "Civic", "Sedan", new BigDecimal("22000"), 0);
        
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(vehicle));

        assertThrows(OutOfStockException.class, () -> vehicleService.purchase(1L));
    }

    @Test
    void restock_incrementsQuantityAndSaves() {
        Vehicle vehicle = new Vehicle(1L, "Honda", "Civic", "Sedan", new BigDecimal("22000"), 3);
        
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(vehicle));
        when(vehicleRepository.save(any(Vehicle.class))).thenAnswer(i -> i.getArgument(0));

        VehicleResponse response = vehicleService.restock(1L, 5);

        assertThat(response.quantity()).isEqualTo(8);
        verify(vehicleRepository).save(vehicle);
        assertThat(vehicle.getQuantity()).isEqualTo(8);
    }
}
