package com.smartjobportal.service;

import com.smartjobportal.dto.request.PaymentRequest;
import com.smartjobportal.dto.response.PaymentResponse;
import com.smartjobportal.dto.response.RevenueStatsResponse;

import java.util.List;

public interface PaymentService {

    PaymentResponse processPayment(Long userId, PaymentRequest request);

    List<PaymentResponse> getUserTransactions(Long userId);

    RevenueStatsResponse getRevenueStats();

    List<PaymentResponse> getAllTransactions();
}
