package com.siaw.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardMetricsDTO {
    private Map<String, Object> kpis;
    private List<Map<String, Object>> chartVolume7Dias;
    private List<ConversationDTO> ultimosAtendimentos;
}
