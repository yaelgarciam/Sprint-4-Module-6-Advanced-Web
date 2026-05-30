package com.tutorbot.notifier.agent;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class NotifierAgentTest {

    @Test
    void shouldDescribeNotificationEnvelope() {
        NotifierAgent agent = new NotifierAgent();

        assertEquals("websocket-or-email", agent.notificationEnvelope("student-feed", "gap.detected").get("delivery"));
    }
}
