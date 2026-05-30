package com.tutorbot.apigateway.controller;

import java.net.URI;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;

import reactor.core.publisher.Mono;

@RestController
public class ProxyController {

    private static final Map<String, String> SERVICE_URLS = Map.of(
            "sessions", "http://localhost:8086",
            "topics", "http://localhost:8082",
            "evaluations", "http://localhost:8082",
            "gaps", "http://localhost:8084");

    private final WebClient webClient = WebClient.builder().build();

    @RequestMapping({
            "/api/v1/sessions",
            "/api/v1/sessions/**",
            "/api/v1/topics",
            "/api/v1/topics/**",
            "/api/v1/evaluations",
            "/api/v1/evaluations/**",
            "/api/v1/gaps",
            "/api/v1/gaps/**"
    })
    public Mono<ResponseEntity<byte[]>> forward(ServerWebExchange exchange, @RequestBody(required = false) Mono<byte[]> body) {
        String path = exchange.getRequest().getURI().getRawPath();
        String service = path.split("/", 5)[3];
        String baseUrl = SERVICE_URLS.get(service);
        String query = exchange.getRequest().getURI().getRawQuery();
        URI target = URI.create(baseUrl + path + (query == null ? "" : "?" + query));
        boolean hasContentType = exchange.getRequest().getHeaders().getContentType() != null;

        WebClient.RequestBodySpec request = webClient
                .method(exchange.getRequest().getMethod())
                .uri(target)
                .headers(headers -> {
                    headers.addAll(exchange.getRequest().getHeaders());
                    headers.remove(HttpHeaders.HOST);
                });

        return body.defaultIfEmpty(new byte[0])
                .flatMap(bytes -> {
                    if (bytes.length > 0 && !hasContentType) {
                        request.contentType(MediaType.APPLICATION_JSON);
                    }
                    return request.body(BodyInserters.fromValue(bytes))
                            .exchangeToMono(response -> response.toEntity(byte[].class));
                });
    }
}
