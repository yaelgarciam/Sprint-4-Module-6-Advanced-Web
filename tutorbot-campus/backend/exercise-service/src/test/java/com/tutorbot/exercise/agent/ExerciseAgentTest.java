package com.tutorbot.exercise.agent;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class ExerciseAgentTest {

    @Test
    void shouldDescribeSourceEvent() {
        ExerciseAgent agent = new ExerciseAgent();

        assertEquals("evaluation.completed", agent.describeRecommendation("rec-1", "intermediate").get("sourceEvent"));
    }
}
