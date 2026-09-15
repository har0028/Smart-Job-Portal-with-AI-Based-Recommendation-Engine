package com.smartjobportal.service.impl;

import com.smartjobportal.dto.response.NotificationResponse;
import com.smartjobportal.entity.Job;
import com.smartjobportal.entity.Notification;
import com.smartjobportal.entity.User;
import com.smartjobportal.enums.NotificationType;
import com.smartjobportal.enums.Role;
import com.smartjobportal.exception.ResourceNotFoundException;
import com.smartjobportal.exception.UnauthorizedException;
import com.smartjobportal.repository.NotificationRepository;
import com.smartjobportal.repository.UserRepository;
import com.smartjobportal.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public NotificationResponse createNotification(User user, String title, String message, NotificationType type, Long relatedJobId) {
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .relatedJobId(relatedJobId)
                .isRead(false)
                .build();
        Notification saved = notificationRepository.save(notification);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Override
    @Transactional
    public NotificationResponse markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        if (!notification.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Not authorized to access this notification");
        }
        notification.setIsRead(true);
        return mapToResponse(notificationRepository.save(notification));
    }

    @Override
    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsReadForUser(userId);
    }

    @Override
    @Transactional
    public void notifyJobSeekersForNewJob(Job job) {
        // Find all active job seekers
        List<User> jobSeekers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.JOB_SEEKER && Boolean.TRUE.equals(u.getIsActive()))
                .collect(Collectors.toList());

        String company = job.getRecruiterProfile() != null ? job.getRecruiterProfile().getCompanyName() : "A Company";
        boolean isFeatured = Boolean.TRUE.equals(job.getIsFeatured());

        for (User seeker : jobSeekers) {
            String title = isFeatured
                    ? "🔥 Featured Job Alert: " + job.getTitle()
                    : "🔔 New Job Alert: " + job.getTitle();
            String message = isFeatured
                    ? company + " has posted a featured opportunity for " + job.getTitle() + ". Apply now with priority!"
                    : company + " has just posted a new job listing for " + job.getTitle() + " in " + (job.getLocation() != null ? job.getLocation() : "Remote") + ".";

            NotificationType type = isFeatured ? NotificationType.FEATURED_JOB_ALERT : NotificationType.JOB_ALERT;

            createNotification(seeker, title, message, type, job.getId());
        }
    }

    private NotificationResponse mapToResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .title(n.getTitle())
                .message(n.getMessage())
                .type(n.getType())
                .relatedJobId(n.getRelatedJobId())
                .isRead(n.getIsRead())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
