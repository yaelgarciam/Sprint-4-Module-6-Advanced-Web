package com.tutorbot.gapdetector.event;

import java.util.List;

import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tutorbot.gapdetector.dto.GapResponse;
import com.tutorbot.gapdetector.service.GapDetectorService;

@Component
@ConditionalOnProperty(name = "tutorbot.messaging.enabled", havingValue = "true")
@Slf4j
public class GapDetectorEventListener {

    private final GapDetectorService gapDetectorService;
    private final ObjectMapper objectMapper;
    private final GapDetectorEventPublisher publisher;

    public GapDetectorEventListener(GapDetectorService gapDetectorService,
            ObjectMapper objectMapper,
            GapDetectorEventPublisher publisher) {
        this.gapDetectorService = gapDetectorService;
        this.objectMapper = objectMapper;
        this.publisher = publisher;
    }

    @RabbitListener(queues = "${rabbitmq.queues.evaluation-completed}")
    public void onEvaluationCompleted(String message) {
        try {
            EvaluationCompletedEvent event = objectMapper.readValue(message, EvaluationCompletedEvent.class);
            log.info("Received evaluation.completed for student={} evaluationId={}",
                    event.studentId(), event.evaluationId());

            // event.score is 0-100 (percentage), pass maxScore=100 so existing service computes correctly
            List<GapResponse> detectedGaps = gapDetectorService.analyzeFromEvaluation(
                    event.studentId(),
                    event.topicId(),
                    event.score() == null ? 0 : event.score(),
                    100,
                    event.feedback());

            for (GapResponse gap : detectedGaps) {
                String gapId = gap.id() == null ? null : String.valueOf(gap.id());
                String detectedAt = gap.detectedAt() == null ? null : gap.detectedAt().toString();

                // Map existing GapResponse into GapDetectedEvent. We don't yet classify gapType,
                // so use a default and include the concept as the description.
                var toPublish = new GapDetectedEvent(
                        gapId,
                        gap.studentId(),
                        gap.topicId(),
                        "CONCEPTUAL",
                        gap.concept(),
                        gap.confidence(),
                        detectedAt);

                publisher.publishGapDetected(toPublish);
            }

            log.info("Gap analysis complete: {} gaps detected for student={}",
                    detectedGaps.size(), event.studentId());

        } catch (Exception e) {
            log.error("Error processing evaluation.completed message='{}' error='{}'", message, e.getMessage(), e);
        }
    }
}
