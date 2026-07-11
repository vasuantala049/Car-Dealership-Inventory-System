package com.CDIS.backend.repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.CDIS.backend.entity.Vehicle;

@SpringBootTest
@Testcontainers
class VehicleRepositorySearchTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private VehicleRepository vehicleRepository;

    @Test
    void search_withJfaSpecifications_returnsMatchingVehicles() {
        Vehicle v1 = new Vehicle(null, "Toyota", "Camry", "Sedan", new BigDecimal("25000"), 5);
        Vehicle v2 = new Vehicle(null, "Honda", "Civic", "Sedan", new BigDecimal("22000"), 3);
        Vehicle v3 = new Vehicle(null, "Ford", "F-150", "Truck", new BigDecimal("35000"), 2);
        vehicleRepository.saveAll(List.of(v1, v2, v3));

        Specification<Vehicle> spec = VehicleSpecifications.searchVehicles(
                null, null, "Sedan", new BigDecimal("20000"), new BigDecimal("26000")
        );

        List<Vehicle> results = vehicleRepository.findAll(spec);

        assertThat(results).hasSize(2)
                .extracting(Vehicle::getMake)
                .containsExactlyInAnyOrder("Toyota", "Honda");
    }
}
