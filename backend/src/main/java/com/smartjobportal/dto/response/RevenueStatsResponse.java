package com.smartjobportal.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class RevenueStatsResponse {
    private BigDecimal totalRevenue;
    private BigDecimal featuredJobsRevenue;
    private BigDecimal seekerProRevenue;
    private long totalTransactions;
    private List<PaymentResponse> recentTransactions;
}
