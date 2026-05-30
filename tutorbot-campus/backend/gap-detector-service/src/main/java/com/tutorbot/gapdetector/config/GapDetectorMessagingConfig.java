package com.tutorbot.gapdetector.config;

import java.util.HashMap;
import java.util.Map;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnProperty(name = "tutorbot.messaging.enabled", havingValue = "true")
public class GapDetectorMessagingConfig {

    @Bean
    public Queue evaluationCompletedQueue(@Value("${rabbitmq.queues.evaluation-completed}") String name,
            @Value("${rabbitmq.queues.gap-detector-dlq}") String dlqName) {
        Map<String, Object> args = new HashMap<>();
        args.put("x-dead-letter-exchange", "gap-detector.dlx");
        args.put("x-dead-letter-routing-key", dlqName);
        return new Queue(name, true, false, false, args);
    }

    @Bean
    public Queue gapDetectedQueue(@Value("${rabbitmq.queues.gap-detected}") String name) {
        return new Queue(name, true);
    }

    @Bean
    public Queue gapDetectorDlq(@Value("${rabbitmq.queues.gap-detector-dlq}") String dlqName) {
        return new Queue(dlqName, true);
    }

    @Bean
    public DirectExchange dlx() {
        return new DirectExchange("gap-detector.dlx");
    }

    @Bean
    public Binding dlqBinding(Queue gapDetectorDlq, DirectExchange dlx,
            @Value("${rabbitmq.queues.gap-detector-dlq}") String dlqName) {
        return BindingBuilder.bind(gapDetectorDlq).to(dlx).with(dlqName);
    }
}
