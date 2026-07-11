package com.CDIS.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.CDIS.backend.entity.Vehicle;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
}
