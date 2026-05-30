package com.tutorbot.evaluator.event;

import java.time.LocalDateTime;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
@ConditionalOnProperty(name = "tutorbot.messaging.enabled", havingValue = "true")
public class EvaluationEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(EvaluationEventPublisher.class);

    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;
    private final String evaluationCompletedQueue;

    public EvaluationEventPublisher(RabbitTemplate rabbitTemplate,
            ObjectMapper objectMapper,
            @Value("${rabbitmq.queues.evaluation-completed}") String evaluationCompletedQueue) {
        this.rabbitTemplate = rabbitTemplate;
        this.objectMapper = objectMapper;
        this.evaluationCompletedQueue = evaluationCompletedQueue;
    }

    public void publishEvaluationCompleted(EvaluationCompletedEvent event) {
        try {
            String evalId = event.evaluationId();
            if (evalId == null || evalId.isBlank()) {
                evalId = UUID.randomUUID().toString();
            }

            String evaluatedAt = event.evaluatedAt();
            if (evaluatedAt == null || evaluatedAt.isBlank()) {
                evaluatedAt = LocalDateTime.now().toString();
            }

            var finalEvent = new EvaluationCompletedEvent(
                    evalId,
                    event.sessionId(),
                    event.studentId(),
                    event.topicId(),
                    event.score(),
                    event.feedback(),
                    evaluatedAt);

            String json = objectMapper.writeValueAsString(finalEvent);
            rabbitTemplate.convertAndSend(evaluationCompletedQueue, json);
            log.info("Published evaluation.completed evaluationId={} studentId={}", evalId, finalEvent.studentId());

        } catch (JsonProcessingException jpe) {
            log.error("Failed to serialize EvaluationCompletedEvent for studentId={} : {}", event.studentId(), jpe.getMessage(), jpe);
            throw new RuntimeException("Failed to serialize EvaluationCompletedEvent", jpe);
        } catch (Exception e) {
            log.error("Failed to publish EvaluationCompletedEvent for studentId={} : {}", event.studentId(), e.getMessage(), e);
            throw e;
        }
    }
}
