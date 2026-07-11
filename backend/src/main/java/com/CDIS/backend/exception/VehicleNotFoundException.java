package com.CDIS.backend.exception;

public class VehicleNotFoundException extends RuntimeException {

    public VehicleNotFoundException(Long id) {
        super("Vehicle not found with id: " + id);
    }
}
