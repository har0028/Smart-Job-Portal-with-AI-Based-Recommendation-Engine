package com.smartjobportal.controller;

import com.smartjobportal.dto.request.PaymentRequest;
import com.smartjobportal.dto.response.ApiResponse;
import com.smartjobportal.dto.response.PaymentResponse;
import com.smartjobportal.service.PaymentService;
import com.smartjobportal.util.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final SecurityUtils securityUtils;

    /**
     * POST /api/payments/process
     * Body: PaymentRequest
     * Response: 201 + PaymentResponse
     */
    @PostMapping("/process")
    public ResponseEntity<ApiResponse<PaymentResponse>> processPayment(@Valid @RequestBody PaymentRequest request) {
        Long userId = securityUtils.getCurrentUserId();
        PaymentResponse response = paymentService.processPayment(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Payment processed successfully", response));
    }

    /**
     * GET /api/payments/my-history
     * Response: list of transactions for current user
     */
    @GetMapping("/my-history")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getMyHistory() {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success("Payment history", paymentService.getUserTransactions(userId)));
    }
}
