package com.tutorbot.learningpath.config;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LearningPathMessagingConfig {

    @Bean
    public Queue gapDetectedQueue() {
        return new Queue("gap.detected", true);
    }

    @Bean
    public Queue pathUpdatedQueue() {
        return new Queue("path.updated", true);
    }
}
