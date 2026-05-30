package com.tutorbot.gapdetector.event;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
@Slf4j
@ConditionalOnProperty(name = "tutorbot.messaging.enabled", havingValue = "true")
public class GapDetectorEventPublisher {

    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;
    private final String gapDetectedQueue;

    public GapDetectorEventPublisher(RabbitTemplate rabbitTemplate,
            ObjectMapper objectMapper,
            @Value("${rabbitmq.queues.gap-detected}") String gapDetectedQueue) {
        this.rabbitTemplate = rabbitTemplate;
        this.objectMapper = objectMapper;
        this.gapDetectedQueue = gapDetectedQueue;
    }

    public void publishGapDetected(GapDetectedEvent event) {
        try {
            String gapId = event.gapId();
            if (gapId == null || gapId.isBlank()) {
                gapId = UUID.randomUUID().toString();
            }

            String detectedAt = event.detectedAt();
            if (detectedAt == null || detectedAt.isBlank()) {
                detectedAt = LocalDateTime.now().toString();
            }

            var finalEvent = new GapDetectedEvent(
                    gapId,
                    event.studentId(),
                    event.topicId(),
                    event.gapType(),
                    event.description(),
                    event.severity(),
                    detectedAt);

            String json = objectMapper.writeValueAsString(finalEvent);
            rabbitTemplate.convertAndSend(gapDetectedQueue, json);
            log.info("Published gap.detected gapId={} studentId={}", gapId, finalEvent.studentId());

        } catch (JsonProcessingException jpe) {
            log.error("Failed to serialize GapDetectedEvent for studentId={} : {}", event.studentId(), jpe.getMessage(), jpe);
            throw new RuntimeException("Failed to serialize GapDetectedEvent", jpe);
        } catch (Exception e) {
            log.error("Failed to publish GapDetectedEvent for studentId={} : {}", event.studentId(), e.getMessage(), e);
            throw e;
        }
    }
}
