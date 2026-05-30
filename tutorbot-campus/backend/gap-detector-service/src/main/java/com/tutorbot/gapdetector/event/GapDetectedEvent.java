package com.tutorbot.gapdetector.event;

import java.io.Serializable;

public record GapDetectedEvent(
        String gapId,
        String studentId,
        Long topicId,
        String gapType,
        String description,
        Double severity,
        String detectedAt) implements Serializable {

}
