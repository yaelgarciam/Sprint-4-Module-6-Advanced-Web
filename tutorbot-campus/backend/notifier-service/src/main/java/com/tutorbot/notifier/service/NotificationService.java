package com.tutorbot.notifier.service;

import com.tutorbot.notifier.model.NotificationMessage;
import com.tutorbot.notifier.repository.NotificationMessageRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final NotificationMessageRepository notificationMessageRepository;

    public NotificationService(NotificationMessageRepository notificationMessageRepository) {
        this.notificationMessageRepository = notificationMessageRepository;
    }

    public List<NotificationMessage> findAll() {
        return notificationMessageRepository.findAll();
    }

    public NotificationMessage save(NotificationMessage notificationMessage) {
        return notificationMessageRepository.save(notificationMessage);
    }
}
