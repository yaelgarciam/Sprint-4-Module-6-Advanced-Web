package com.tutorbot.session.model;

import java.io.Serializable;

public class ExamSummary implements Serializable {

    private Integer answeredQuestions;
    private Integer totalQuestions;
    private Integer averageScore;
    private String performanceLabel;
    private String recommendedFocus;

    public Integer getAnsweredQuestions() {
        return answeredQuestions;
    }

    public void setAnsweredQuestions(Integer answeredQuestions) {
        this.answeredQuestions = answeredQuestions;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public Integer getAverageScore() {
        return averageScore;
    }

    public void setAverageScore(Integer averageScore) {
        this.averageScore = averageScore;
    }

    public String getPerformanceLabel() {
        return performanceLabel;
    }

    public void setPerformanceLabel(String performanceLabel) {
        this.performanceLabel = performanceLabel;
    }

    public String getRecommendedFocus() {
        return recommendedFocus;
    }

    public void setRecommendedFocus(String recommendedFocus) {
        this.recommendedFocus = recommendedFocus;
    }
}
