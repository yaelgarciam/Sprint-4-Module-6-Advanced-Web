package com.tutorbot.session.model;

import java.io.Serializable;

public class ExamResult implements Serializable {

    private Integer questionNumber;
    private String question;
    private String answer;
    private String feedback;
    private Integer score;
    private String topicFocus;

    public Integer getQuestionNumber() {
        return questionNumber;
    }

    public void setQuestionNumber(Integer questionNumber) {
        this.questionNumber = questionNumber;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public String getTopicFocus() {
        return topicFocus;
    }

    public void setTopicFocus(String topicFocus) {
        this.topicFocus = topicFocus;
    }
}
