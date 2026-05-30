package com.tutorbot.learningpath;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class LearningPathServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(LearningPathServiceApplication.class, args);
    }
}
