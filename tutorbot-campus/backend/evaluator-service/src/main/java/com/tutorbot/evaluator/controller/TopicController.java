package com.tutorbot.evaluator.controller;

import com.tutorbot.evaluator.model.Topic;
import com.tutorbot.evaluator.repository.TopicRepository;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/topics")
public class TopicController {

    private final TopicRepository topicRepository;

    public TopicController(TopicRepository topicRepository) {
        this.topicRepository = topicRepository;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> listTopics() {
        List<Map<String, Object>> topics = topicRepository.findAll().stream()
                .filter(topic -> Boolean.TRUE.equals(topic.getActive()))
                .map(this::toTopicResponse)
                .toList();
        return ResponseEntity.ok(topics);
    }

    private Map<String, Object> toTopicResponse(Topic topic) {
        return Map.of(
                "id", topic.getId(),
                "topicId", topic.getId(),
                "name", topic.getName(),
                "label", topic.getName(),
                "description", "Practice " + topic.getName() + " with TutorBot.");
    }
}
