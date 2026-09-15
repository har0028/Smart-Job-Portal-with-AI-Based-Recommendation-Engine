package com.smartjobportal.service.impl;

import com.smartjobportal.dto.request.PaymentRequest;
import com.smartjobportal.dto.response.PaymentResponse;
import com.smartjobportal.dto.response.RevenueStatsResponse;
import com.smartjobportal.entity.Job;
import com.smartjobportal.entity.PaymentTransaction;
import com.smartjobportal.entity.User;
import com.smartjobportal.enums.NotificationType;
import com.smartjobportal.enums.PaymentStatus;
import com.smartjobportal.enums.PaymentType;
import com.smartjobportal.exception.BadRequestException;
import com.smartjobportal.exception.ResourceNotFoundException;
import com.smartjobportal.exception.UnauthorizedException;
import com.smartjobportal.repository.JobRepository;
import com.smartjobportal.repository.PaymentRepository;
import com.smartjobportal.repository.UserRepository;
import com.smartjobportal.service.NotificationService;
import com.smartjobportal.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public PaymentResponse processPayment(Long userId, PaymentRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Payment amount must be greater than zero");
        }

        String transactionId = "TXN_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        PaymentTransaction transaction = PaymentTransaction.builder()
                .user(user)
                .amount(request.getAmount())
                .currency(request.getCurrency() != null ? request.getCurrency() : "INR")
                .paymentType(request.getPaymentType())
                .status(PaymentStatus.SUCCESS)
                .transactionId(transactionId)
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "ONLINE")
                .relatedEntityId(request.getRelatedJobId())
                .build();

        PaymentTransaction savedTxn = paymentRepository.save(transaction);

        // Process Business Logic based on Payment Type
        if (request.getPaymentType() == PaymentType.JOB_FEATURE) {
            if (request.getRelatedJobId() == null) {
                throw new BadRequestException("Job ID is required for featured job payment");
            }
            Job job = jobRepository.findById(request.getRelatedJobId())
                    .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

            if (job.getRecruiterProfile() == null || !job.getRecruiterProfile().getUser().getId().equals(userId)) {
                throw new UnauthorizedException("You are not authorized to feature this job");
            }

            job.setIsFeatured(true);
            job.setFeaturedUntil(LocalDateTime.now().plusDays(30));
            jobRepository.save(job);

            // Send notification to Recruiter
            notificationService.createNotification(
                    user,
                    "🎉 Featured Job Activated!",
                    "Your job listing '" + job.getTitle() + "' is now Featured for 30 days. Priority notifications sent to candidates!",
                    NotificationType.SYSTEM,
                    job.getId()
            );

            // Broadcast instant alerts to all job seekers
            notificationService.notifyJobSeekersForNewJob(job);

        } else if (request.getPaymentType() == PaymentType.SEEKER_PRO) {
            user.setIsProUser(true);
            user.setProExpiryDate(LocalDateTime.now().plusMonths(1));
            userRepository.save(user);

            // Send Pro Welcome notification
            notificationService.createNotification(
                    user,
                    "🚀 Welcome to Candidate Pro!",
                    "You are now a Pro Member! You will receive instant notifications for new matching jobs and priority application badges.",
                    NotificationType.PRO_WELCOME,
                    null
            );
        }

        return mapToResponse(savedTxn);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getUserTransactions(Long userId) {
        return paymentRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public RevenueStatsResponse getRevenueStats() {
        BigDecimal total = paymentRepository.sumTotalRevenueByStatus(PaymentStatus.SUCCESS);
        BigDecimal featured = paymentRepository.sumRevenueByPaymentTypeAndStatus(PaymentType.JOB_FEATURE, PaymentStatus.SUCCESS);
        BigDecimal pro = paymentRepository.sumRevenueByPaymentTypeAndStatus(PaymentType.SEEKER_PRO, PaymentStatus.SUCCESS);
        long count = paymentRepository.countByStatus(PaymentStatus.SUCCESS);

        List<PaymentResponse> recent = paymentRepository.findAllByOrderByCreatedAtDesc().stream()
                .limit(10)
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return RevenueStatsResponse.builder()
                .totalRevenue(total != null ? total : BigDecimal.ZERO)
                .featuredJobsRevenue(featured != null ? featured : BigDecimal.ZERO)
                .seekerProRevenue(pro != null ? pro : BigDecimal.ZERO)
                .totalTransactions(count)
                .recentTransactions(recent)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getAllTransactions() {
        return paymentRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private PaymentResponse mapToResponse(PaymentTransaction p) {
        return PaymentResponse.builder()
                .id(p.getId())
                .userId(p.getUser().getId())
                .userEmail(p.getUser().getEmail())
                .userName(p.getUser().getFullName())
                .amount(p.getAmount())
                .currency(p.getCurrency())
                .paymentType(p.getPaymentType())
                .status(p.getStatus())
                .transactionId(p.getTransactionId())
                .paymentMethod(p.getPaymentMethod())
                .relatedEntityId(p.getRelatedEntityId())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
