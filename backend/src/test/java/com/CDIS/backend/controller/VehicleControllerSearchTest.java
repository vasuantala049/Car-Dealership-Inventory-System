package com.CDIS.backend.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

import java.math.BigDecimal;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.CDIS.backend.config.SecurityConfig;
import com.CDIS.backend.dto.VehicleResponse;
import com.CDIS.backend.security.JwtAuthenticationFilter;
import com.CDIS.backend.service.JwtService;
import com.CDIS.backend.service.VehicleService;

@WebMvcTest(VehicleController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
class VehicleControllerSearchTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private VehicleService vehicleService;

    @Test
    @WithMockUser
    void search_withValidParams_returnsMatchingVehicles() throws Exception {
        VehicleResponse response = new VehicleResponse(
                1L, "Toyota", "Camry", "Sedan", new BigDecimal("25000"), 5, 0L
        );

        when(vehicleService.searchVehicles("Toyota", "Camry", "Sedan", new BigDecimal("20000"), new BigDecimal("30000")))
                .thenReturn(List.of(response));

        mockMvc.perform(get("/api/vehicles/search")
                        .param("make", "Toyota")
                        .param("model", "Camry")
                        .param("category", "Sedan")
                        .param("minPrice", "20000")
                        .param("maxPrice", "30000")
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].make").value("Toyota"))
                .andExpect(jsonPath("$[0].model").value("Camry"))
                .andExpect(jsonPath("$[0].category").value("Sedan"))
                .andExpect(jsonPath("$[0].price").value(25000));
    }
}
