package com.CDIS.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.jpa.domain.Specification;

import com.CDIS.backend.dto.VehicleResponse;
import com.CDIS.backend.entity.Vehicle;
import com.CDIS.backend.repository.VehicleRepository;

@ExtendWith(MockitoExtension.class)
class VehicleServiceSearchTest {

    @Mock
    private VehicleRepository vehicleRepository;

    private VehicleService vehicleService;

    @BeforeEach
    void setUp() {
        vehicleService = new VehicleServiceImpl(vehicleRepository);
    }

    @Test
    void searchVehicles_withFilters_returnsMappedResponses() {
        Vehicle vehicle = new Vehicle(1L, "Honda", "Civic", "Sedan", new BigDecimal("22000"), 3);
        
        // This test correctly assumes the target method searchVehicles exists (will cause RED)
        when(vehicleRepository.findAll(any(Specification.class)))
                .thenReturn(List.of(vehicle));

        List<VehicleResponse> responses = vehicleService.searchVehicles(
                "Honda", "Civic", "Sedan", new BigDecimal("20000"), new BigDecimal("25000")
        );

        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).make()).isEqualTo("Honda");
        assertThat(responses.get(0).model()).isEqualTo("Civic");
        
        verify(vehicleRepository).findAll(any(Specification.class));
    }
}
