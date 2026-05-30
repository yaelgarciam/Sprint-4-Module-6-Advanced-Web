package com.tutorbot.session.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.tutorbot.session.model.SessionContext;
import com.tutorbot.session.model.SessionMessage;
import com.tutorbot.session.repository.SessionContextRepository;

@Service
public class SessionService {

    private final SessionContextRepository sessionContextRepository;
    private final Map<String, List<SessionMessage>> messagesBySession = new ConcurrentHashMap<>();

    public SessionService(SessionContextRepository sessionContextRepository) {
        this.sessionContextRepository = sessionContextRepository;
    }

    public List<SessionContext> findAll() {
        return sessionContextRepository.findAll();
    }

    public SessionContext findById(String sessionId) {
        return sessionContextRepository.findById(sessionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Session not found: " + sessionId));
    }

    public SessionContext save(SessionContext sessionContext) {
        if (sessionContext.getId() == null || sessionContext.getId().isBlank()) {
            sessionContext.setId(UUID.randomUUID().toString());
        }
        if (sessionContext.getStatus() == null || sessionContext.getStatus().isBlank()) {
            sessionContext.setStatus("ACTIVE");
        }
        return sessionContextRepository.save(sessionContext);
    }

    public SessionContext update(String sessionId, SessionContext patch) {
        SessionContext current = findById(sessionId);

        if (patch.getStatus() != null) {
            current.setStatus(patch.getStatus());
        }
        if (patch.getSkillLevel() != null) {
            current.setSkillLevel(patch.getSkillLevel());
        }
        if (patch.getTopicId() != null) {
            current.setTopicId(patch.getTopicId());
        }
        if (patch.getTopicName() != null) {
            current.setTopicName(patch.getTopicName());
        }
        if (patch.getExamResults() != null) {
            current.setExamResults(patch.getExamResults());
        }
        if (patch.getExamSummary() != null) {
            current.setExamSummary(patch.getExamSummary());
        }
        if (patch.getRecommendedTopics() != null) {
            current.setRecommendedTopics(patch.getRecommendedTopics());
        }

        return sessionContextRepository.save(current);
    }

    public List<SessionMessage> findMessages(String sessionId) {
        findById(sessionId);
        return new ArrayList<>(messagesBySession.getOrDefault(sessionId, List.of()));
    }

    public SessionMessage saveMessage(String sessionId, SessionMessage message) {
        SessionContext current = findById(sessionId);
        if (message.getId() == null || message.getId().isBlank()) {
            message.setId(UUID.randomUUID().toString());
        }
        message.setSessionId(sessionId);
        if (message.getTimestamp() == null) {
            message.setTimestamp(System.currentTimeMillis());
        }
        messagesBySession.computeIfAbsent(sessionId, key -> new ArrayList<>()).add(message);
        current.setLatestAnswerId(message.getId());
        sessionContextRepository.save(current);
        return message;
    }
}
