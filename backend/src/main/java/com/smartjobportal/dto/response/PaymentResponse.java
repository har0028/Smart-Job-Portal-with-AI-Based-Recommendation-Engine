package com.smartjobportal.dto.response;

import com.smartjobportal.enums.PaymentStatus;
import com.smartjobportal.enums.PaymentType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class PaymentResponse {
    private Long id;
    private Long userId;
    private String userEmail;
    private String userName;
    private BigDecimal amount;
    private String currency;
    private PaymentType paymentType;
    private PaymentStatus status;
    private String transactionId;
    private String paymentMethod;
    private Long relatedEntityId;
    private LocalDateTime createdAt;
}
