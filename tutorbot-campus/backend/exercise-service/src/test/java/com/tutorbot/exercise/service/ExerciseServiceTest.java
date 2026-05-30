package com.tutorbot.exercise.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import com.tutorbot.exercise.model.ExerciseRecommendation;
import com.tutorbot.exercise.repository.ExerciseRecommendationRepository;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

class ExerciseServiceTest {

    @Test
    void shouldReturnRecommendations() {
        ExerciseRecommendationRepository repository = Mockito.mock(ExerciseRecommendationRepository.class);
        ExerciseRecommendation recommendation = new ExerciseRecommendation();
        recommendation.setTopic("calculus");
        when(repository.findAll()).thenReturn(List.of(recommendation));

        ExerciseService service = new ExerciseService(repository);

        assertEquals("calculus", service.findAll().getFirst().getTopic());
    }
}
