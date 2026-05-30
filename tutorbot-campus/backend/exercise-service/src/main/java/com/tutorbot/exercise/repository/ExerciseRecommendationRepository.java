package com.tutorbot.exercise.repository;

import com.tutorbot.exercise.model.ExerciseRecommendation;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ExerciseRecommendationRepository extends MongoRepository<ExerciseRecommendation, String> {
}
