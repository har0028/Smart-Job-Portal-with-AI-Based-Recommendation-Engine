package com.smartjobportal.dto.request;

import com.smartjobportal.enums.PaymentType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PaymentRequest {

    @NotNull(message = "Payment type is required")
    private PaymentType paymentType;

    @NotNull(message = "Amount is required")
    private BigDecimal amount;

    private String currency = "INR";

    private String paymentMethod; // UPI, CARD, NETBANKING

    private Long relatedJobId; // Optional job ID for JOB_FEATURE payment
}
