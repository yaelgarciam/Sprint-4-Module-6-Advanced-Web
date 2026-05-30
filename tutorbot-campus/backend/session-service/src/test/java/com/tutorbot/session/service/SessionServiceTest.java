package com.tutorbot.session.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import com.tutorbot.session.model.SessionContext;
import com.tutorbot.session.repository.SessionContextRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

class SessionServiceTest {

    @Test
    void shouldReturnExistingSession() {
        SessionContextRepository repository = Mockito.mock(SessionContextRepository.class);
        when(repository.findById("session-1"))
                .thenReturn(Optional.of(new SessionContext("session-1", "student-1", "ACTIVE", "answer-2")));

        SessionService service = new SessionService(repository);

        assertEquals("ACTIVE", service.findById("session-1").getStatus());
    }
}
