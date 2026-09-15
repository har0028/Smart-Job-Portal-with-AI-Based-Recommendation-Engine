package com.smartjobportal.controller;

import com.smartjobportal.dto.response.ApiResponse;
import com.smartjobportal.dto.response.PaymentResponse;
import com.smartjobportal.dto.response.RevenueStatsResponse;
import com.smartjobportal.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/revenue")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminRevenueController {

    private final PaymentService paymentService;

    /**
     * GET /api/admin/revenue/stats
     * Response: platform revenue breakdown and stats
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<RevenueStatsResponse>> getRevenueStats() {
        return ResponseEntity.ok(ApiResponse.success("Platform revenue statistics", paymentService.getRevenueStats()));
    }

    /**
     * GET /api/admin/revenue/transactions
     * Response: list of all payment transactions
     */
    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getAllTransactions() {
        return ResponseEntity.ok(ApiResponse.success("All platform transactions", paymentService.getAllTransactions()));
    }
}
