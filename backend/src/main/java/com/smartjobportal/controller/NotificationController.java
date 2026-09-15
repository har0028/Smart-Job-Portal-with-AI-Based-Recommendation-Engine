package com.smartjobportal.controller;

import com.smartjobportal.dto.response.ApiResponse;
import com.smartjobportal.dto.response.NotificationResponse;
import com.smartjobportal.service.NotificationService;
import com.smartjobportal.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final SecurityUtils securityUtils;

    /**
     * GET /api/notifications
     * Response: list of notifications for the authenticated user
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getMyNotifications() {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success("User notifications", notificationService.getUserNotifications(userId)));
    }

    /**
     * GET /api/notifications/unread-count
     * Response: number of unread notifications
     */
    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount() {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success("Unread count", notificationService.getUnreadCount(userId)));
    }

    /**
     * PATCH /api/notifications/{id}/read
     * Response: updated notification
     */
    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<NotificationResponse>> markAsRead(@PathVariable Long id) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", notificationService.markAsRead(id, userId)));
    }

    /**
     * PATCH /api/notifications/read-all
     * Response: success message
     */
    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead() {
        Long userId = securityUtils.getCurrentUserId();
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read"));
    }
}
