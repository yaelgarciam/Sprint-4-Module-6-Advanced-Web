package com.tutorbot.learningpath.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tutorbot.learningpath.model.LearningPath;
import com.tutorbot.learningpath.service.LearningPathService;

@RestController
@RequestMapping("/api/v1/learning-paths")
public class LearningPathController {

    private final LearningPathService learningPathService;

    public LearningPathController(LearningPathService learningPathService) {
        this.learningPathService = learningPathService;
    }

    @GetMapping
    public List<LearningPath> listPaths() {
        return learningPathService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<LearningPath> getById(@PathVariable String id) {
        return learningPathService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/student/{studentId}")
    public List<LearningPath> getByStudent(@PathVariable String studentId) {
        return learningPathService.findByStudentId(studentId);
    }

    @GetMapping("/student/{studentId}/active")
    public List<LearningPath> getActiveByStudent(@PathVariable String studentId) {
        return learningPathService.findActiveByStudentId(studentId);
    }

    @PostMapping
    public LearningPath createPath(@RequestBody LearningPath learningPath) {
        return learningPathService.save(learningPath);
    }

    @PostMapping("/generate")
    public LearningPath generatePath(@RequestParam String studentId,
            @RequestParam String concept,
            @RequestParam(defaultValue = "MEDIUM") String severity,
            @RequestParam(required = false) Long topicId) {
        return learningPathService.generatePathFromGap(studentId, concept, severity, topicId);
    }

    @PatchMapping("/{id}/milestones/{order}/complete")
    public ResponseEntity<LearningPath> completeMilestone(
            @PathVariable String id,
            @PathVariable int order) {
        return learningPathService.completeMilestone(id, order)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
