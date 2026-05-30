package com.tutorbot.apigateway.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Mono;

@RestController
public class LabProxyController {

    private final WebClient webClient = WebClient.builder().build();

    @GetMapping("/api/v1/topics")
    public Mono<ResponseEntity<byte[]>> topics() {
        return get("http://localhost:8082/api/v1/topics");
    }

    @GetMapping("/api/v1/evaluations")
    public Mono<ResponseEntity<byte[]>> evaluations() {
        return get("http://localhost:8082/api/v1/evaluations");
    }

    @GetMapping("/api/v1/evaluations/session/{sessionId}")
    public Mono<ResponseEntity<byte[]>> evaluationsBySession(@PathVariable String sessionId) {
        return get("http://localhost:8082/api/v1/evaluations/session/" + sessionId);
    }

    @PostMapping("/api/v1/evaluations")
    public Mono<ResponseEntity<byte[]>> createEvaluation(@RequestBody byte[] body) {
        return post("http://localhost:8082/api/v1/evaluations", body);
    }

    @GetMapping("/api/v1/gaps/student/{studentId}/latest")
    public Mono<ResponseEntity<byte[]>> latestGap(@PathVariable String studentId) {
        return get("http://localhost:8084/api/v1/gaps/student/" + studentId + "/unresolved");
    }

    @GetMapping("/api/v1/gaps/leaderboard")
    public Mono<ResponseEntity<byte[]>> leaderboard(@RequestParam String topicId) {
        return get("http://localhost:8084/api/v1/gaps?topicId=" + topicId);
    }

    @PatchMapping("/api/v1/sessions/{sessionId}")
    public Mono<ResponseEntity<byte[]>> updateSession(@PathVariable String sessionId, @RequestBody byte[] body) {
        return patch("http://localhost:8086/api/v1/sessions/" + sessionId, body);
    }

    private Mono<ResponseEntity<byte[]>> get(String uri) {
        return webClient.get().uri(uri).exchangeToMono(response -> response.toEntity(byte[].class));
    }

    private Mono<ResponseEntity<byte[]>> post(String uri, byte[] body) {
        return webClient.post()
                .uri(uri)
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(body))
                .exchangeToMono(response -> response.toEntity(byte[].class));
    }

    private Mono<ResponseEntity<byte[]>> patch(String uri, byte[] body) {
        return webClient.patch()
                .uri(uri)
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(body))
                .exchangeToMono(response -> response.toEntity(byte[].class));
    }
}
