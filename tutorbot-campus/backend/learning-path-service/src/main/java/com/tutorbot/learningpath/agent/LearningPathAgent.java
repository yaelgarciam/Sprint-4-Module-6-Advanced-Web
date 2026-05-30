package com.tutorbot.learningpath.agent;

import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class LearningPathAgent {

    public Map<String, String> pathUpdated(String pathId, String nextMilestone) {
        return Map.of(
                "event", "path.updated",
                "pathId", pathId,
                "nextMilestone", nextMilestone);
    }
}
