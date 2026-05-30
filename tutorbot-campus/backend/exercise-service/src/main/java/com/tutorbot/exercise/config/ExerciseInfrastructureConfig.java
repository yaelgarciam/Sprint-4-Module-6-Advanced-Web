package com.tutorbot.exercise.config;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ExerciseInfrastructureConfig {

    @Bean
    public Queue evaluationCompletedQueue() {
        return new Queue("evaluation.completed", true);
    }
}
