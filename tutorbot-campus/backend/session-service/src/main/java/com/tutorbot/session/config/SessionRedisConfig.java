package com.tutorbot.session.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;

@Configuration
@EnableRedisRepositories(basePackages = "com.tutorbot.session.repository")
public class SessionRedisConfig {
}
