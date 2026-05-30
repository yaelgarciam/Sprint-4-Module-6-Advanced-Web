package com.tutorbot.apigateway.service;

import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class RouteCatalogService {

    public List<String> defaultRoutes() {
        return List.of(
                "lb://session-service",
                "lb://evaluator-service",
                "lb://exercise-service",
                "lb://gap-detector-service",
                "lb://learning-path-service",
                "lb://notifier-service");
    }
}
