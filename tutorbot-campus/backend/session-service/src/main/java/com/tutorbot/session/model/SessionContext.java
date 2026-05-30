package com.tutorbot.session.model;

import java.io.Serializable;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@RedisHash("session_context")
public class SessionContext implements Serializable {

    @Id
    private String id;
    private String studentId;
    private String status;
    private String latestAnswerId;
    private Long topicId;
    private String topicName;
    private String skillLevel;
    private List<ExamResult> examResults;
    private ExamSummary examSummary;
    private List<StudyRecommendation> recommendedTopics;

    public SessionContext() {
    }

    public SessionContext(String id, String studentId, String status, String latestAnswerId) {
        this.id = id;
        this.studentId = studentId;
        this.status = status;
        this.latestAnswerId = latestAnswerId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getLatestAnswerId() {
        return latestAnswerId;
    }

    public void setLatestAnswerId(String latestAnswerId) {
        this.latestAnswerId = latestAnswerId;
    }

    public Long getTopicId() {
        return topicId;
    }

    public void setTopicId(Long topicId) {
        this.topicId = topicId;
    }

    public String getTopicName() {
        return topicName;
    }

    public void setTopicName(String topicName) {
        this.topicName = topicName;
    }

    public String getSkillLevel() {
        return skillLevel;
    }

    public void setSkillLevel(String skillLevel) {
        this.skillLevel = skillLevel;
    }

    public List<ExamResult> getExamResults() {
        return examResults;
    }

    public void setExamResults(List<ExamResult> examResults) {
        this.examResults = examResults;
    }

    public ExamSummary getExamSummary() {
        return examSummary;
    }

    public void setExamSummary(ExamSummary examSummary) {
        this.examSummary = examSummary;
    }

    public List<StudyRecommendation> getRecommendedTopics() {
        return recommendedTopics;
    }

    public void setRecommendedTopics(List<StudyRecommendation> recommendedTopics) {
        this.recommendedTopics = recommendedTopics;
    }
}
