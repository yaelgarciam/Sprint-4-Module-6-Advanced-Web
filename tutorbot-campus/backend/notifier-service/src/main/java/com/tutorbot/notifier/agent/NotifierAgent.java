package com.tutorbot.notifier.agent;

import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class NotifierAgent {

    public Map<String, String> notificationEnvelope(String channel, String event) {
        return Map.of(
                "channel", channel,
                "event", event,
                "delivery", "websocket-or-email");
    }
}
