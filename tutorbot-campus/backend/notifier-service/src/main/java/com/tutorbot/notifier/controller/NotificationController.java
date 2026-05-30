package com.tutorbot.notifier.controller;

import com.tutorbot.notifier.model.NotificationMessage;
import com.tutorbot.notifier.service.NotificationService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public List<NotificationMessage> listNotifications() {
        return notificationService.findAll();
    }

    @PostMapping
    public NotificationMessage createNotification(@RequestBody NotificationMessage notificationMessage) {
        return notificationService.save(notificationMessage);
    }
}
