package com.smartjobportal.dto.response;

import com.smartjobportal.enums.NotificationType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class NotificationResponse {
    private Long id;
    private String title;
    private String message;
    private NotificationType type;
    private Long relatedJobId;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
