package com.tutorbot.learningpath.event;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tutorbot.learningpath.model.LearningPath;
import com.tutorbot.learningpath.service.LearningPathService;

@Component
@ConditionalOnProperty(name = "tutorbot.messaging.enabled", havingValue = "true")
public class LearningPathEventListener {

    private static final Logger log = LoggerFactory.getLogger(LearningPathEventListener.class);

    private final LearningPathService learningPathService;
    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;

    public LearningPathEventListener(LearningPathService learningPathService,
            RabbitTemplate rabbitTemplate,
            ObjectMapper objectMapper) {
        this.learningPathService = learningPathService;
        this.rabbitTemplate = rabbitTemplate;
        this.objectMapper = objectMapper;
    }

    @RabbitListener(queues = "gap.detected")
    public void onGapDetected(String message) {
        try {
            GapDetectedEvent event = objectMapper.readValue(message, GapDetectedEvent.class);
            log.info("Received gap.detected for student={} concept={} severity={}",
                    event.studentId(), event.concept(), event.severity());

            // Supersede any existing active path for the same student+concept
            learningPathService.supersedeExistingPaths(event.studentId(), event.concept());

            // Generate a new learning path using AI
            LearningPath path = learningPathService.generatePathFromGap(
                    event.studentId(),
                    event.concept(),
                    event.severity(),
                    event.topicId());

            // Publish path.updated event
            publishPathUpdated(path);

            log.info("Learning path created: id={} milestones={} for student={}",
                    path.getId(), path.getMilestones().size(), path.getStudentId());

        } catch (Exception e) {
            log.error("Error processing gap.detected event: {}", e.getMessage(), e);
        }
    }

    private void publishPathUpdated(LearningPath path) {
        try {
            var event = new PathUpdatedEvent(
                    path.getId(),
                    path.getStudentId(),
                    path.getConcept(),
                    path.getSeverity(),
                    path.getMilestones().size(),
                    path.getStatus());

            String json = objectMapper.writeValueAsString(event);
            rabbitTemplate.convertAndSend("path.updated", json);
            log.info("Published path.updated for pathId={} student={}", path.getId(), path.getStudentId());
        } catch (Exception e) {
            log.error("Failed to publish path.updated event: {}", e.getMessage(), e);
        }
    }
}
