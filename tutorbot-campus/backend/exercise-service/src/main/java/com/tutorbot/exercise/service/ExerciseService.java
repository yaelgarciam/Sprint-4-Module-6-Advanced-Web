package com.tutorbot.exercise.service;

import com.tutorbot.exercise.model.ExerciseRecommendation;
import com.tutorbot.exercise.repository.ExerciseRecommendationRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ExerciseService {

    private final ExerciseRecommendationRepository exerciseRecommendationRepository;

    public ExerciseService(ExerciseRecommendationRepository exerciseRecommendationRepository) {
        this.exerciseRecommendationRepository = exerciseRecommendationRepository;
    }

    public List<ExerciseRecommendation> findAll() {
        return exerciseRecommendationRepository.findAll();
    }

    public ExerciseRecommendation save(ExerciseRecommendation recommendation) {
        return exerciseRecommendationRepository.save(recommendation);
    }
}
