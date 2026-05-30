package com.tutorbot.exercise.agent;

import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class ExerciseAgent {

    public Map<String, String> describeRecommendation(String recommendationId, String learnerStage) {
        return Map.of(
                "recommendationId", recommendationId,
                "learnerStage", learnerStage,
                "sourceEvent", "evaluation.completed");
    }
}
