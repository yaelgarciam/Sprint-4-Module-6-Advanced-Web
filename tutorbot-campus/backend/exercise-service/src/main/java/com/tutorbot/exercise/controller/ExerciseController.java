package com.tutorbot.exercise.controller;

import com.tutorbot.exercise.model.ExerciseRecommendation;
import com.tutorbot.exercise.service.ExerciseService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/exercises")
public class ExerciseController {

    private final ExerciseService exerciseService;

    public ExerciseController(ExerciseService exerciseService) {
        this.exerciseService = exerciseService;
    }

    @GetMapping
    public List<ExerciseRecommendation> listRecommendations() {
        return exerciseService.findAll();
    }

    @PostMapping
    public ExerciseRecommendation createRecommendation(@RequestBody ExerciseRecommendation recommendation) {
        return exerciseService.save(recommendation);
    }
}
