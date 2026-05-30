package com.tutorbot.notifier.repository;

import com.tutorbot.notifier.model.NotificationMessage;
import java.util.List;
import org.springframework.data.repository.CrudRepository;

public interface NotificationMessageRepository extends CrudRepository<NotificationMessage, String> {

    List<NotificationMessage> findAll();
}
