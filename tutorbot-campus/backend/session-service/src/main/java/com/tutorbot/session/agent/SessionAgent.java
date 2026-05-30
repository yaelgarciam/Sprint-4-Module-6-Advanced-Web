package com.tutorbot.session.agent;

import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class SessionAgent {

    public Map<String, String> publishAnswerEvent(String sessionId, String answerId) {
        return Map.of(
                "event", "student.answered",
                "sessionId", sessionId,
                "answerId", answerId);
    }
}
