package com.CDIS.backend.repository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.CDIS.backend.entity.Vehicle;

import jakarta.persistence.criteria.Predicate;

public class VehicleSpecifications {

    public static Specification<Vehicle> searchVehicles(String make, String model, String category, BigDecimal minPrice, BigDecimal maxPrice) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (make != null && !make.isBlank()) {
                predicates.add(criteriaBuilder.equal(criteriaBuilder.lower(root.get("make")), make.toLowerCase()));
            }
            if (model != null && !model.isBlank()) {
                predicates.add(criteriaBuilder.equal(criteriaBuilder.lower(root.get("model")), model.toLowerCase()));
            }
            if (category != null && !category.isBlank()) {
                predicates.add(criteriaBuilder.equal(criteriaBuilder.lower(root.get("category")), category.toLowerCase()));
            }
            if (minPrice != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
