package com.smartjobportal.repository;

import com.smartjobportal.entity.PaymentTransaction;
import com.smartjobportal.enums.PaymentStatus;
import com.smartjobportal.enums.PaymentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface PaymentRepository extends JpaRepository<PaymentTransaction, Long> {

    List<PaymentTransaction> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<PaymentTransaction> findAllByOrderByCreatedAtDesc();

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM PaymentTransaction p WHERE p.status = :status")
    BigDecimal sumTotalRevenueByStatus(PaymentStatus status);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM PaymentTransaction p WHERE p.status = :status AND p.paymentType = :paymentType")
    BigDecimal sumRevenueByPaymentTypeAndStatus(PaymentType paymentType, PaymentStatus status);

    long countByStatus(PaymentStatus status);
}
