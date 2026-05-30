package com.tutorbot.notifier.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import com.tutorbot.notifier.model.NotificationMessage;
import com.tutorbot.notifier.repository.NotificationMessageRepository;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

class NotificationServiceTest {

    @Test
    void shouldReturnNotifications() {
        NotificationMessageRepository repository = Mockito.mock(NotificationMessageRepository.class);
        NotificationMessage notificationMessage = new NotificationMessage();
        notificationMessage.setChannel("email");
        when(repository.findAll()).thenReturn(List.of(notificationMessage));

        NotificationService service = new NotificationService(repository);

        assertEquals("email", service.findAll().getFirst().getChannel());
    }
}
