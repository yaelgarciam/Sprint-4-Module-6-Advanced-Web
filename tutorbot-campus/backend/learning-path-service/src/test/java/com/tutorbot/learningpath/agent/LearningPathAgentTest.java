package com.tutorbot.learningpath.agent;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class LearningPathAgentTest {

    @Test
    void shouldDescribePathUpdatedEvent() {
        LearningPathAgent agent = new LearningPathAgent();

        assertEquals("path.updated", agent.pathUpdated("path-1", "integrals").get("event"));
    }
}
