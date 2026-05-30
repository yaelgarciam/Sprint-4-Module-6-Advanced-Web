package com.tutorbot.evaluator.event;

import java.io.Serializable;

public record EvaluationCompletedEvent(
        String evaluationId,
        String sessionId,
        String studentId,
        Long topicId,
        Integer score,
        String feedback,
        String evaluatedAt) implements Serializable {

}
