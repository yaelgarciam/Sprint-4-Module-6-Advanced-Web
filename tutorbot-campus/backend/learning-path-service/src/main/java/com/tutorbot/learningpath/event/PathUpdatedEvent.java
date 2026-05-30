package com.tutorbot.learningpath.event;

import java.io.Serializable;

public record PathUpdatedEvent(
        String pathId,
        String studentId,
        String concept,
        String severity,
        int milestoneCount,
        String status) implements Serializable {

}
