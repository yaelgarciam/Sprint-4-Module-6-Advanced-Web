package com.tutorbot.apigateway.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/gateway")
public class GatewayController {

    @GetMapping("/routes")
    public Map<String, String> routes() {
        return Map.of("status", "Route catalog placeholder");
    }
}
