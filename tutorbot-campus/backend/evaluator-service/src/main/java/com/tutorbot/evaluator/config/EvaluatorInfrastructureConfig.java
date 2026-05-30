package com.tutorbot.evaluator.config;

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
public class EvaluatorInfrastructureConfig {

    @Bean
    public Queue studentAnsweredQueue(@Value("${rabbitmq.queues.student-answered}") String name) {
        return new Queue(name, true);
    }

    @Bean
    public Queue evaluationCompletedQueue(@Value("${rabbitmq.queues.evaluation-completed}") String name,
            @Value("${rabbitmq.queues.evaluation-dlq}") String dlqName) {
        Map<String, Object> args = new HashMap<>();
        args.put("x-dead-letter-exchange", "evaluation.dlx");
        args.put("x-dead-letter-routing-key", dlqName);
        return new Queue(name, true, false, false, args);
    }

    @Bean
    public Queue evaluationDlq(@Value("${rabbitmq.queues.evaluation-dlq}") String dlqName) {
        return new Queue(dlqName, true);
    }

    @Bean
    public DirectExchange dlx() {
        return new DirectExchange("evaluation.dlx");
    }

    @Bean
    public Binding dlqBinding(Queue evaluationDlq, DirectExchange dlx,
            @Value("${rabbitmq.queues.evaluation-dlq}") String dlqName) {
        return BindingBuilder.bind(evaluationDlq).to(dlx).with(dlqName);
    }
}
