package com.tutorbot.notifier.config;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableRedisRepositories(basePackages = "com.tutorbot.notifier.repository")
@EnableWebSocketMessageBroker
public class NotifierInfrastructureConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic", "/queue");
        registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws/notifications")
                .setAllowedOriginPatterns("http://localhost:5173", "http://localhost:5174", "http://localhost:5175");
    }

    @Bean
    public Queue gapDetectedQueue() {
        return new Queue("gap.detected", true);
    }

    @Bean
    public Queue pathUpdatedQueue() {
        return new Queue("path.updated", true);
    }
}
