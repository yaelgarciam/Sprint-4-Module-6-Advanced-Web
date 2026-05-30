package com.tutorbot.session.model;

import java.io.Serializable;
import java.util.List;

public class StudyRecommendation implements Serializable {

    private String title;
    private String reason;
    private String priority;
    private String studyPlan;
    private List<StudyResource> resources;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getStudyPlan() {
        return studyPlan;
    }

    public void setStudyPlan(String studyPlan) {
        this.studyPlan = studyPlan;
    }

    public List<StudyResource> getResources() {
        return resources;
    }

    public void setResources(List<StudyResource> resources) {
        this.resources = resources;
    }
}
