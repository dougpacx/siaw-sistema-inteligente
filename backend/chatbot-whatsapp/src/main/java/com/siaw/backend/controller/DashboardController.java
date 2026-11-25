package com.siaw.backend.controller;

import com.siaw.backend.dto.DashboardMetricsDTO;
import com.siaw.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/dashboard", "/api/dashboard/metrics"})
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping({"", "/metrics"})
    public ResponseEntity<DashboardMetricsDTO> getMetrics() {
        DashboardMetricsDTO metrics = dashboardService.getMetrics();
        return ResponseEntity.ok(metrics);
    }
}
