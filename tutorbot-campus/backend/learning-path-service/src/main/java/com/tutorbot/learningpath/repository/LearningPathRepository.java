package com.tutorbot.learningpath.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.tutorbot.learningpath.model.LearningPath;

public interface LearningPathRepository extends MongoRepository<LearningPath, String> {

    List<LearningPath> findByStudentId(String studentId);

    List<LearningPath> findByStudentIdAndStatus(String studentId, String status);

    List<LearningPath> findByStudentIdAndConceptAndStatus(String studentId, String concept, String status);
}
