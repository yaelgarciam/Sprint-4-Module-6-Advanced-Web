package com.tutorbot.exercise;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class ExerciseServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ExerciseServiceApplication.class, args);
    }
}
