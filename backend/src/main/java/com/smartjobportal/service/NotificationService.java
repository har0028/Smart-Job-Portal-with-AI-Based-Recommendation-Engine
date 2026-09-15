package com.smartjobportal.service;

import com.smartjobportal.dto.response.NotificationResponse;
import com.smartjobportal.entity.Job;
import com.smartjobportal.entity.User;
import com.smartjobportal.enums.NotificationType;

import java.util.List;

public interface NotificationService {

    NotificationResponse createNotification(User user, String title, String message, NotificationType type, Long relatedJobId);

    List<NotificationResponse> getUserNotifications(Long userId);

    long getUnreadCount(Long userId);

    NotificationResponse markAsRead(Long notificationId, Long userId);

    void markAllAsRead(Long userId);

    void notifyJobSeekersForNewJob(Job job);
}
