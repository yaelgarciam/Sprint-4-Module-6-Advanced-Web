package com.tutorbot.learningpath.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tutorbot.learningpath.model.LearningPath;
import com.tutorbot.learningpath.model.LearningPath.Milestone;
import com.tutorbot.learningpath.ollama.OllamaService;
import com.tutorbot.learningpath.repository.LearningPathRepository;

@Service
public class LearningPathService {

    private static final Logger log = LoggerFactory.getLogger(LearningPathService.class);

    private final LearningPathRepository learningPathRepository;
    private final OllamaService ollamaService;
    private final ObjectMapper objectMapper;

    public LearningPathService(LearningPathRepository learningPathRepository,
            OllamaService ollamaService,
            ObjectMapper objectMapper) {
        this.learningPathRepository = learningPathRepository;
        this.ollamaService = ollamaService;
        this.objectMapper = objectMapper;
    }

    public List<LearningPath> findAll() {
        return learningPathRepository.findAll();
    }

    public Optional<LearningPath> findById(String id) {
        return learningPathRepository.findById(id);
    }

    public List<LearningPath> findByStudentId(String studentId) {
        return learningPathRepository.findByStudentId(studentId);
    }

    public List<LearningPath> findActiveByStudentId(String studentId) {
        return learningPathRepository.findByStudentIdAndStatus(studentId, "ACTIVE");
    }

    public LearningPath save(LearningPath learningPath) {
        return learningPathRepository.save(learningPath);
    }

    /**
     * Mark existing active paths for the same student+concept as SUPERSEDED.
     */
    public void supersedeExistingPaths(String studentId, String concept) {
        List<LearningPath> existing = learningPathRepository
                .findByStudentIdAndConceptAndStatus(studentId, concept, "ACTIVE");
        for (LearningPath path : existing) {
            path.setStatus("SUPERSEDED");
            path.setUpdatedAt(Instant.now());
            learningPathRepository.save(path);
            log.info("Superseded path id={} for student={} concept={}", path.getId(), studentId, concept);
        }
    }

    /**
     * Generate a new learning path from a detected gap using Ollama AI.
     */
    public LearningPath generatePathFromGap(String studentId, String concept,
            String severity, Long topicId) {

        LearningPath path = new LearningPath();
        path.setStudentId(studentId);
        path.setConcept(concept);
        path.setSeverity(severity);
        path.setTopicId(topicId);
        path.setStatus("ACTIVE");
        path.setCreatedAt(Instant.now());
        path.setUpdatedAt(Instant.now());

        // Try AI generation
        List<Milestone> milestones = generateMilestonesWithAI(studentId, concept, severity);

        if (milestones != null && !milestones.isEmpty()) {
            path.setMilestones(milestones);
            path.setGeneratedBy("ollama");
        } else {
            path.setMilestones(buildFallbackMilestones(concept, severity));
            path.setGeneratedBy("fallback");
            log.warn("Using fallback milestones for student={} concept={}", studentId, concept);
        }

        return learningPathRepository.save(path);
    }

    /**
     * Mark a specific milestone as completed.
     */
    public Optional<LearningPath> completeMilestone(String pathId, int milestoneOrder) {
        return learningPathRepository.findById(pathId).map(path -> {
            for (Milestone m : path.getMilestones()) {
                if (m.getOrder() == milestoneOrder) {
                    m.setCompleted(true);
                    break;
                }
            }
            // Check if all milestones are done
            boolean allDone = path.getMilestones().stream().allMatch(Milestone::isCompleted);
            if (allDone) {
                path.setStatus("COMPLETED");
            }
            path.setUpdatedAt(Instant.now());
            return learningPathRepository.save(path);
        });
    }

    private List<Milestone> generateMilestonesWithAI(String studentId, String concept, String severity) {
        try {
            String response = ollamaService.generateLearningPath(studentId, concept, severity);
            if (response == null) {
                return null;
            }

            // Extract JSON array from response (handle possible markdown fences)
            String json = extractJsonArray(response);
            List<Map<String, Object>> raw = objectMapper.readValue(json, new TypeReference<>() {
            });

            List<Milestone> milestones = new ArrayList<>();
            for (Map<String, Object> item : raw) {
                Milestone m = new Milestone();
                m.setOrder(((Number) item.get("order")).intValue());
                m.setTitle((String) item.get("title"));
                m.setDescription((String) item.get("description"));
                m.setType((String) item.getOrDefault("type", "REVIEW"));
                m.setCompleted(false);
                milestones.add(m);
            }
            return milestones;

        } catch (Exception e) {
            log.error("Failed to parse Ollama response for path generation: {}", e.getMessage());
            return null;
        }
    }

    private String extractJsonArray(String response) {
        // Strip markdown code fences if present
        String cleaned = response.replaceAll("```json\\s*", "").replaceAll("```\\s*", "").trim();
        int start = cleaned.indexOf('[');
        int end = cleaned.lastIndexOf(']');
        if (start >= 0 && end > start) {
            return cleaned.substring(start, end + 1);
        }
        return cleaned;
    }

    private List<Milestone> buildFallbackMilestones(String concept, String severity) {
        List<Milestone> milestones = new ArrayList<>();
        int count = "HIGH".equals(severity) ? 5 : "MEDIUM".equals(severity) ? 4 : 3;

        Milestone m1 = new Milestone();
        m1.setOrder(1);
        m1.setTitle("Revisión de fundamentos de " + concept);
        m1.setDescription("Repasar los conceptos básicos y definiciones clave.");
        m1.setType("REVIEW");
        milestones.add(m1);

        Milestone m2 = new Milestone();
        m2.setOrder(2);
        m2.setTitle("Ejemplos guiados de " + concept);
        m2.setDescription("Analizar ejemplos resueltos paso a paso.");
        m2.setType("REVIEW");
        milestones.add(m2);

        if (count >= 4) {
            Milestone m3 = new Milestone();
            m3.setOrder(3);
            m3.setTitle("Ejercicios básicos de " + concept);
            m3.setDescription("Resolver ejercicios de dificultad baja para afianzar conceptos.");
            m3.setType("PRACTICE");
            milestones.add(m3);
        }

        Milestone mPractice = new Milestone();
        mPractice.setOrder(milestones.size() + 1);
        mPractice.setTitle("Práctica avanzada de " + concept);
        mPractice.setDescription("Resolver problemas de dificultad media-alta.");
        mPractice.setType("PRACTICE");
        milestones.add(mPractice);

        if (count >= 5) {
            Milestone mExtra = new Milestone();
            mExtra.setOrder(milestones.size() + 1);
            mExtra.setTitle("Proyecto aplicado de " + concept);
            mExtra.setDescription("Aplicar los conocimientos en un mini-proyecto integrador.");
            mExtra.setType("PRACTICE");
            milestones.add(mExtra);
        }

        Milestone mAssess = new Milestone();
        mAssess.setOrder(milestones.size() + 1);
        mAssess.setTitle("Evaluación de dominio de " + concept);
        mAssess.setDescription("Realizar una evaluación para verificar que el gap ha sido cerrado.");
        mAssess.setType("ASSESSMENT");
        milestones.add(mAssess);

        return milestones;
    }
}
