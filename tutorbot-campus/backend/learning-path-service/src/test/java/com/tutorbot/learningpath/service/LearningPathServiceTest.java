package com.tutorbot.learningpath.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import com.tutorbot.learningpath.model.LearningPath;
import com.tutorbot.learningpath.repository.LearningPathRepository;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

class LearningPathServiceTest {

    @Test
    void shouldReturnPaths() {
        LearningPathRepository repository = Mockito.mock(LearningPathRepository.class);
        LearningPath learningPath = new LearningPath();
        learningPath.setStatus("ACTIVE");
        when(repository.findAll()).thenReturn(List.of(learningPath));

        LearningPathService service = new LearningPathService(repository);

        assertEquals("ACTIVE", service.findAll().getFirst().getStatus());
    }
}
