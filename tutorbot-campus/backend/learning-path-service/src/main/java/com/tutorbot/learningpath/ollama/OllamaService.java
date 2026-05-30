package com.tutorbot.learningpath.ollama;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
public class OllamaService {

    private static final Logger log = LoggerFactory.getLogger(OllamaService.class);

    private final RestTemplate restTemplate;
    private final String model;

    public OllamaService(
            @Qualifier("ollamaRestTemplate") RestTemplate restTemplate,
            @Value("${ollama.model}") String model) {
        this.restTemplate = restTemplate;
        this.model = model;
    }

    public String generateLearningPath(String studentId, String concept, String severity) {
        String prompt = buildPathPrompt(studentId, concept, severity);
        return callOllama(prompt);
    }

    private String callOllama(String prompt) {
        try {
            var request = new OllamaDto.GenerateRequest(model, prompt);
            var response = restTemplate.postForObject("/api/generate", request, OllamaDto.GenerateResponse.class);
            if (response != null && response.response() != null) {
                log.debug("Ollama responded in {} ns", response.totalDuration());
                return response.response().trim();
            }
            log.warn("Ollama returned null response");
            return null;
        } catch (RestClientException e) {
            log.error("Ollama call failed: {}", e.getMessage());
            return null;
        }
    }

    private String buildPathPrompt(String studentId, String concept, String severity) {
        return """
                You are a university learning path designer. A student has a %s learning gap \
                in the concept: "%s".

                Generate a personalized learning path with 4-6 milestones to help the student \
                master this concept. Each milestone should build on the previous one.

                Respond ONLY with a JSON array (no markdown, no explanation, no code fences):
                [
                  {
                    "order": 1,
                    "title": "<short milestone title in Spanish>",
                    "description": "<1-2 sentence description in Spanish>",
                    "type": "REVIEW|PRACTICE|ASSESSMENT"
                  }
                ]

                Rules:
                - Start with REVIEW milestones for foundational concepts
                - Include PRACTICE milestones with hands-on exercises
                - End with an ASSESSMENT milestone to verify mastery
                - All text must be in Spanish
                - For HIGH severity: 5-6 milestones starting from basics
                - For MEDIUM severity: 4-5 milestones
                - For LOW severity: 3-4 milestones focused on practice
                """.formatted(severity, concept);
    }
}
