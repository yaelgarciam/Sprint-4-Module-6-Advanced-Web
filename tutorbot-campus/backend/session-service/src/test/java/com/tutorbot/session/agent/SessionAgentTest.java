package com.tutorbot.session.agent;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class SessionAgentTest {

    @Test
    void shouldDescribeStudentAnsweredEvent() {
        SessionAgent agent = new SessionAgent();

        assertEquals("student.answered", agent.publishAnswerEvent("session-1", "answer-1").get("event"));
    }
}
