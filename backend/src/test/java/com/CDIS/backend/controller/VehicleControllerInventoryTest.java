package com.CDIS.backend.controller;

import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.CDIS.backend.config.SecurityConfig;
import com.CDIS.backend.dto.QuantityRequest;
import com.CDIS.backend.dto.VehicleResponse;
import com.CDIS.backend.exception.OutOfStockException;
import com.CDIS.backend.security.JwtAuthenticationFilter;
import com.CDIS.backend.service.JwtService;
import com.CDIS.backend.service.VehicleService;

@WebMvcTest(VehicleController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
class VehicleControllerInventoryTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private VehicleService vehicleService;

    @Test
    @WithMockUser
    void purchase_decrementsQuantity() throws Exception {
        VehicleResponse response = new VehicleResponse(
                1L, "Toyota", "Camry", "Sedan", new BigDecimal("25000"), 4, 1L
        );

        when(vehicleService.purchase(1L)).thenReturn(response);

        mockMvc.perform(post("/api/vehicles/1/purchase"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity").value(4));
    }

    @Test
    @WithMockUser
    void purchase_whenOutOfStock_returnsBadRequest() throws Exception {
        doThrow(new OutOfStockException("Vehicle is out of stock")).when(vehicleService).purchase(1L);

        mockMvc.perform(post("/api/vehicles/1/purchase"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void restock_incrementsQuantity() throws Exception {
        VehicleResponse response = new VehicleResponse(
                1L, "Toyota", "Camry", "Sedan", new BigDecimal("25000"), 10, 2L
        );

        when(vehicleService.restock(1L, 5)).thenReturn(response);

        mockMvc.perform(post("/api/vehicles/1/restock")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "amount": 5
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity").value(10));
    }
}
