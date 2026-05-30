package com.tutorbot.session.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tutorbot.session.model.SessionContext;
import com.tutorbot.session.model.SessionMessage;
import com.tutorbot.session.service.SessionService;

@RestController
@RequestMapping("/api/v1/sessions")
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @GetMapping
    public List<SessionContext> listSessions() {
        return sessionService.findAll();
    }

    @GetMapping("/{sessionId}")
    public SessionContext getSession(@PathVariable String sessionId) {
        return sessionService.findById(sessionId);
    }

    @PostMapping
    public SessionContext createSession(@RequestBody SessionContext sessionContext) {
        return sessionService.save(sessionContext);
    }

    @PatchMapping("/{sessionId}")
    public SessionContext updateSession(@PathVariable String sessionId, @RequestBody SessionContext sessionContext) {
        return sessionService.update(sessionId, sessionContext);
    }

    @GetMapping("/{sessionId}/messages")
    public List<SessionMessage> getMessages(@PathVariable String sessionId) {
        return sessionService.findMessages(sessionId);
    }

    @PostMapping("/{sessionId}/messages")
    public SessionMessage saveMessage(@PathVariable String sessionId, @RequestBody SessionMessage message) {
        return sessionService.saveMessage(sessionId, message);
    }
}
