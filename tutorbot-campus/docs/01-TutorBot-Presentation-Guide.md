# TutorBot Campus — Presentation Guide

**Course:** Web Development — 6th Semester  
**Date:** July 2025  
**Services Covered:** evaluator-service, gap-detector-service  
**AI Model:** Ollama — gemma3:4b

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Oracle Database Schema](#3-oracle-database-schema)
4. [Evaluator Service — Complete Walkthrough](#4-evaluator-service--complete-walkthrough)
5. [Gap Detector Service — Complete Walkthrough](#5-gap-detector-service--complete-walkthrough)
6. [Ollama AI Integration](#6-ollama-ai-integration)
7. [Postman Collection — API Test Guide](#7-postman-collection--api-test-guide)
8. [Key Bug Fixes & Lessons Learned](#8-key-bug-fixes--lessons-learned)
9. [Live Demo Steps](#9-live-demo-steps)

---

## 1. Project Overview

TutorBot Campus is a **microservices-based intelligent tutoring system** built with Spring Boot 3.3.2 and Spring Cloud 2023.0.3. It evaluates student answers using a **local LLM (Ollama)** and detects knowledge gaps automatically.

**Today's scope:**

- **Phase 1 — Consolidate the base:** Ensure both services have working REST → Service → Repository → Oracle DB round-trip.
- **Phase 2 — Ollama integration:** Connect both services to Ollama running the `gemma3:4b` model for AI-powered evaluation and gap detection.

**Tech stack:**

| Layer         | Technology                   |
|---------------|------------------------------|
| Language      | Java 21 (runs on Java 23)    |
| Framework     | Spring Boot 3.3.2            |
| Cloud         | Spring Cloud 2023.0.3        |
| Database      | Oracle XE 21 (Docker)        |
| ORM           | Hibernate / Spring Data JPA  |
| AI Engine     | Ollama with gemma3:4b        |
| Build Tool    | Maven                        |
| Containers    | Docker & Docker Compose      |

---

## 2. Architecture

```
                ┌──────────────────┐
                │   API Gateway    │  (port 8080)
                │ Spring Cloud GW  │
                └────────┬─────────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
  ┌───────▼──────┐ ┌────▼─────┐ ┌──────▼──────────┐
  │  evaluator   │ │ session  │ │ gap-detector     │
  │  service     │ │ service  │ │ service          │
  │  :8082       │ │ :8081    │ │ :8084            │
  └──────┬───────┘ └──────────┘ └───────┬──────────┘
         │                              │
         │   ┌─────────────┐            │
         ├──►│  Ollama LLM │◄───────────┤
         │   │  :11434     │            │
         │   │  gemma3:4b  │            │
         │   └─────────────┘            │
         │                              │
    ┌────▼──────────────────────────────▼────┐
    │         Oracle XE 21 (Docker)          │
    │  EVALUATIONS · COURSES · TOPICS ·      │
    │  SUBTOPICS · GAPS                      │
    │  Port: 1522  DB: TESTDB  User: Adolfo  │
    └────────────────────────────────────────┘
```

Each service follows a **layered architecture:**

```
Controller (REST) → Service (Business Logic) → Repository (JPA) → Oracle
                          ↕
                    OllamaService (HTTP → Ollama API)
```

---

## 3. Oracle Database Schema

Five tables defined in `infrastructure/oracle/V1__init_schema.sql`, seeded by `V2__seed_data.sql`.

### Entity-Relationship Diagram

```
  COURSES ──< TOPICS ──< SUBTOPICS
                │
                │  (TOPIC_ID FK)
                ▼
            EVALUATIONS
            GAPS
```

### Table: EVALUATIONS

| Column           | Type          | Notes                        |
|------------------|---------------|------------------------------|
| ID               | NUMBER (PK)   | Sequence: SEQ_EVALUATIONS    |
| SESSION_ID       | VARCHAR2(255) | NOT NULL                     |
| STUDENT_ID       | VARCHAR2(255) | NOT NULL (e.g., A00835001)   |
| QUESTION_TEXT    | CLOB          |                              |
| STUDENT_ANSWER   | CLOB          |                              |
| CORRECT_ANSWER   | CLOB          |                              |
| SCORE            | NUMBER(10)    | AI-assigned (0–100)          |
| MAX_SCORE        | NUMBER(10)    | Default: 100                 |
| FEEDBACK_SUMMARY | CLOB          | AI-generated in Spanish      |
| TOPIC_ID         | NUMBER        | FK to TOPICS                 |
| EVALUATED_AT     | TIMESTAMP     |                              |

### Table: GAPS

| Column      | Type          | Notes                     |
|-------------|---------------|---------------------------|
| ID          | NUMBER (PK)   | Sequence: SEQ_GAPS        |
| STUDENT_ID  | VARCHAR2(255) | NOT NULL                  |
| TOPIC_ID    | NUMBER        | FK to TOPICS              |
| SUBTOPIC_ID | NUMBER        | FK to SUBTOPICS           |
| CONCEPT     | VARCHAR2(255) | NOT NULL                  |
| SEVERITY    | VARCHAR2(50)  | HIGH / MEDIUM / LOW       |
| CONFIDENCE  | NUMBER(5,2)   | 0.00 – 1.00              |
| DETECTED_AT | TIMESTAMP     |                           |
| RESOLVED    | NUMBER(1)     | 0 = open, 1 = resolved   |

### Catalogue Tables: COURSES, TOPICS, SUBTOPICS

Standard ID/NAME plus parent foreign keys. Seed data includes **6 courses, 20 topics, 50 subtopics**.

### Seed Data Volume

| Table       | Rows |
|-------------|------|
| COURSES     | 6    |
| TOPICS      | 20   |
| SUBTOPICS   | 50   |
| EVALUATIONS | 300  |
| GAPS        | 200  |

---

## 4. Evaluator Service — Complete Walkthrough

### 4.1 Package Structure

```
com.tutorbot.evaluator
├── config/
│   ├── DatabaseHealthCheck.java    — @PostConstruct Oracle ping
│   └── OllamaConfig.java          — RestTemplate bean for Ollama
├── controller/
│   └── EvaluatorController.java    — REST endpoints
├── dto/
│   ├── EvaluationRequest.java      — Inbound record
│   ├── EvaluationResponse.java     — Outbound record
│   └── EvaluationMapper.java       — Entity ↔ DTO conversion
├── model/
│   └── EvaluationResult.java       — JPA entity → EVALUATIONS table
├── ollama/
│   ├── OllamaDto.java              — Request/Response records for Ollama API
│   └── OllamaService.java          — HTTP client calling Ollama /api/generate
├── repository/
│   └── EvaluationResultRepository.java — Spring Data JPA
└── service/
    └── EvaluationService.java      — Business logic + Ollama parsing
```

### 4.2 JPA Entity — `EvaluationResult.java`

```java
@Entity
@Table(name = "EVALUATIONS")
public class EvaluationResult {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_evaluations")
    @SequenceGenerator(name = "seq_evaluations", sequenceName = "SEQ_EVALUATIONS", allocationSize = 1)
    private Long id;

    @Column(name = "SESSION_ID", nullable = false)
    private String sessionId;

    @Column(name = "STUDENT_ID", nullable = false)
    private String studentId;

    @Column(name = "QUESTION_TEXT") @Lob
    private String questionText;

    @Column(name = "STUDENT_ANSWER") @Lob
    private String studentAnswer;

    @Column(name = "CORRECT_ANSWER") @Lob
    private String correctAnswer;

    @Column(name = "SCORE")
    private Integer score;

    @Column(name = "MAX_SCORE")
    private Integer maxScore;

    @Column(name = "FEEDBACK_SUMMARY") @Lob
    private String feedbackSummary;

    @Column(name = "TOPIC_ID")
    private Long topicId;

    @Column(name = "EVALUATED_AT")
    private LocalDateTime evaluatedAt;

    // getters & setters ...
}
```

### 4.3 DTOs — Java Records

```java
// Inbound
public record EvaluationRequest(
    String sessionId, String studentId,
    String questionText, String studentAnswer, String correctAnswer,
    Integer maxScore, Long topicId) {}

// Outbound
public record EvaluationResponse(
    Long id, String sessionId, String studentId,
    String questionText, String studentAnswer,
    Integer score, Integer maxScore,
    String feedbackSummary, Long topicId,
    LocalDateTime evaluatedAt) {}
```

### 4.4 Mapper — `EvaluationMapper.java`

```java
public final class EvaluationMapper {

    public static EvaluationResponse toResponse(EvaluationResult entity) {
        return new EvaluationResponse(
            entity.getId(), entity.getSessionId(), entity.getStudentId(),
            entity.getQuestionText(), entity.getStudentAnswer(),
            entity.getScore(), entity.getMaxScore(),
            entity.getFeedbackSummary(), entity.getTopicId(),
            entity.getEvaluatedAt());
    }

    public static EvaluationResult toEntity(EvaluationRequest request) {
        var entity = new EvaluationResult();
        entity.setSessionId(request.sessionId());
        entity.setStudentId(request.studentId());
        entity.setQuestionText(request.questionText());
        entity.setStudentAnswer(request.studentAnswer());
        entity.setCorrectAnswer(request.correctAnswer());
        entity.setMaxScore(request.maxScore() != null ? request.maxScore() : 100);
        entity.setTopicId(request.topicId());
        return entity;
    }
}
```

### 4.5 Repository

```java
public interface EvaluationResultRepository extends JpaRepository<EvaluationResult, Long> {
    List<EvaluationResult> findByStudentId(String studentId);
    List<EvaluationResult> findBySessionId(String sessionId);
    List<EvaluationResult> findByTopicId(Long topicId);
    List<EvaluationResult> findByStudentIdAndTopicId(String studentId, Long topicId);
}
```

Spring Data JPA generates all SQL automatically — **no manual queries needed.**

### 4.6 Service — `EvaluationService.java`

This is the **core business class**. Key method — `evaluate()`:

```java
@Transactional
public EvaluationResponse evaluate(EvaluationRequest request) {
    EvaluationResult entity = EvaluationMapper.toEntity(request);
    entity.setEvaluatedAt(LocalDateTime.now());

    // Call Ollama for AI-powered evaluation
    String ollamaResponse = ollamaService.evaluate(
        request.questionText(), request.studentAnswer(), request.correctAnswer());

    parseOllamaScore(ollamaResponse, entity);
    EvaluationResult saved = evaluationResultRepository.save(entity);
    return EvaluationMapper.toResponse(saved);
}
```

**JSON parsing with markdown-fence protection:**

```java
private void parseOllamaScore(String ollamaResponse, EvaluationResult entity) {
    try {
        JsonNode json = objectMapper.readTree(stripMarkdownFences(ollamaResponse));
        int rawScore = json.path("score").asInt(0);
        int maxScore = entity.getMaxScore() != null ? entity.getMaxScore() : 100;
        entity.setScore(Math.min(rawScore, maxScore));
        entity.setFeedbackSummary(json.path("feedback").asText("Sin retroalimentación disponible."));
    } catch (Exception e) {
        log.warn("Could not parse Ollama JSON, using raw text as feedback: {}", e.getMessage());
        entity.setScore(0);
        entity.setFeedbackSummary(ollamaResponse);
    }
}

private String stripMarkdownFences(String text) {
    if (text == null) return "";
    return text.replaceAll("(?s)```(?:json)?\\s*", "").trim();
}
```

### 4.7 Controller — `EvaluatorController.java`

```java
@RestController
@RequestMapping("/api/v1/evaluations")
public class EvaluatorController {

    @GetMapping
    public ResponseEntity<List<EvaluationResponse>> listEvaluations() { ... }

    @GetMapping("/{id}")
    public ResponseEntity<EvaluationResponse> getEvaluation(@PathVariable Long id) { ... }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<EvaluationResponse>> getByStudent(@PathVariable String studentId) { ... }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<EvaluationResponse>> getBySession(@PathVariable String sessionId) { ... }

    @PostMapping
    public ResponseEntity<EvaluationResponse> evaluate(@RequestBody EvaluationRequest request) {
        EvaluationResponse response = evaluationService.evaluate(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", ex.getMessage()));
    }
}
```

### 4.8 Ollama Integration Classes

**OllamaConfig.java** — creates a dedicated `RestTemplate` bean:

```java
@Configuration
public class OllamaConfig {
    @Value("${ollama.base-url}") private String baseUrl;
    @Value("${ollama.timeout:30000}") private long timeoutMs;

    @Bean("ollamaRestTemplate")
    public RestTemplate ollamaRestTemplate(RestTemplateBuilder builder) {
        return builder
            .rootUri(baseUrl)
            .setConnectTimeout(Duration.ofMillis(timeoutMs))
            .setReadTimeout(Duration.ofMillis(timeoutMs))
            .build();
    }
}
```

**OllamaDto.java** — request/response DTOs:

```java
public record GenerateRequest(String model, String prompt, Boolean stream, Map<String, Object> options) {
    public GenerateRequest(String model, String prompt) {
        this(model, prompt, false, Map.of("temperature", 0.3));
    }
}

@JsonIgnoreProperties(ignoreUnknown = true)
public record GenerateResponse(String model, String response, @JsonProperty("total_duration") Long totalDuration) {}
```

**OllamaService.java** — sends the evaluation prompt:

```java
@Service
public class OllamaService {
    private final RestTemplate restTemplate;
    private final String model;

    public String evaluate(String questionText, String studentAnswer, String correctAnswer) {
        String prompt = buildEvaluationPrompt(questionText, studentAnswer, correctAnswer);
        return callOllama(prompt);
    }

    private String callOllama(String prompt) {
        var request = new OllamaDto.GenerateRequest(model, prompt);
        var response = restTemplate.postForObject("/api/generate", request, OllamaDto.GenerateResponse.class);
        return response.response().trim();
    }
}
```

The prompt instructs the LLM: *"You are an academic evaluator. Evaluate the student's answer. Respond ONLY with JSON: `{score, feedback}`."*

### 4.9 Configuration Files

**application.properties** (production defaults):

```properties
spring.application.name=evaluator-service
server.port=8082
spring.datasource.url=jdbc:oracle:thin:@oracledb:1522/TESTDB
spring.datasource.username=Adolfo
spring.datasource.password=password
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
ollama.base-url=http://localhost:11434
ollama.model=llama3
```

**application-dev.properties** (local development override):

```properties
spring.datasource.url=jdbc:oracle:thin:@localhost:1522/TESTDB
eureka.client.enabled=false
tutorbot.messaging.enabled=false
spring.autoconfigure.exclude=...RabbitAutoConfiguration
ollama.base-url=http://localhost:11434
ollama.model=gemma3:4b
ollama.timeout=60000
```

### 4.10 DatabaseHealthCheck.java

```java
@Component
public class DatabaseHealthCheck {
    @PostConstruct
    public void verifyConnection() {
        try (Connection conn = dataSource.getConnection()) {
            try (Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery("SELECT 1 FROM DUAL")) {
                if (rs.next())
                    log.info("Oracle connection verified — URL: {}", conn.getMetaData().getURL());
            }
        } catch (Exception e) {
            log.error("Failed to connect to Oracle", e);
        }
    }
}
```

---

## 5. Gap Detector Service — Complete Walkthrough

### 5.1 Package Structure

```
com.tutorbot.gapdetector
├── config/
│   ├── DatabaseHealthCheck.java
│   └── OllamaConfig.java
├── controller/
│   └── GapDetectorController.java
├── dto/
│   ├── GapDetectionRequest.java
│   ├── GapResponse.java
│   └── GapMapper.java
├── model/
│   ├── Course.java             — Maps to COURSES
│   ├── Topic.java              — Maps to TOPICS
│   ├── Subtopic.java           — Maps to SUBTOPICS
│   └── LearningGap.java        — Maps to GAPS
├── ollama/
│   ├── OllamaDto.java
│   └── OllamaService.java
├── repository/
│   ├── CourseRepository.java
│   ├── TopicRepository.java
│   ├── SubtopicRepository.java
│   └── LearningGapRepository.java
└── service/
    └── GapDetectorService.java
```

### 5.2 JPA Entity — `LearningGap.java`

```java
@Entity
@Table(name = "GAPS")
public class LearningGap {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_gaps")
    @SequenceGenerator(name = "seq_gaps", sequenceName = "SEQ_GAPS", allocationSize = 1)
    private Long id;

    @Column(name = "STUDENT_ID", nullable = false) private String studentId;
    @Column(name = "TOPIC_ID")                     private Long topicId;
    @Column(name = "SUBTOPIC_ID")                  private Long subtopicId;
    @Column(name = "CONCEPT", nullable = false)     private String concept;
    @Column(name = "SEVERITY")                     private String severity;
    @Column(name = "CONFIDENCE")                   private Double confidence;
    @Column(name = "DETECTED_AT")                  private LocalDateTime detectedAt;
    @Column(name = "RESOLVED")                     private Boolean resolved;
}
```

### 5.3 DTOs

```java
public record GapDetectionRequest(
    String studentId, Long topicId, Long subtopicId,
    String concept, String severity, Double confidence) {}

public record GapResponse(
    Long id, String studentId, Long topicId, Long subtopicId,
    String concept, String severity, Double confidence,
    LocalDateTime detectedAt, Boolean resolved) {}
```

### 5.4 Controller — `GapDetectorController.java`

```java
@RestController
@RequestMapping("/api/v1/gaps")
public class GapDetectorController {

    @GetMapping                                     // List all gaps
    @GetMapping("/{id}")                            // Single gap by ID
    @GetMapping("/student/{studentId}")             // Gaps by student
    @GetMapping("/student/{studentId}/unresolved")  // Unresolved gaps only
    @PostMapping                                    // Create a new gap (201)
    @PatchMapping("/{id}/resolve")                  // Mark as resolved
}
```

### 5.5 Service — `GapDetectorService.java`

Key AI-powered method — `analyzeFromEvaluation()`:

```java
@Transactional
public List<GapResponse> analyzeFromEvaluation(
        String studentId, Long topicId, int score, int maxScore, String feedback) {

    double percent = maxScore > 0 ? (double) score / maxScore * 100 : 0;
    if (percent >= 70) return List.of();   // No gap if score >= 70%

    String summary = "Topic ID: %d, Score: %d/%d (%.0f%%), Feedback: %s"
        .formatted(topicId, score, maxScore, percent, feedback);

    String ollamaResponse = ollamaService.analyzeGaps(studentId, summary);
    return parseAndSaveGaps(studentId, topicId, ollamaResponse);
}
```

**Parsing with markdown-fence strip (same fix as evaluator):**

```java
private List<GapResponse> parseAndSaveGaps(String studentId, Long topicId, String ollamaResponse) {
    List<Map<String, Object>> gaps = objectMapper.readValue(
        stripMarkdownFences(ollamaResponse), new TypeReference<>() {});
    return gaps.stream().map(gapMap -> {
        LearningGap entity = new LearningGap();
        entity.setStudentId(studentId);
        entity.setTopicId(topicId);
        entity.setConcept(String.valueOf(gapMap.getOrDefault("concept", "Unknown")));
        entity.setSeverity(String.valueOf(gapMap.getOrDefault("severity", "MEDIUM")));
        entity.setConfidence(conf instanceof Number n ? n.doubleValue() : 0.5);
        entity.setDetectedAt(LocalDateTime.now());
        entity.setResolved(false);
        return GapMapper.toResponse(learningGapRepository.save(entity));
    }).toList();
}
```

### 5.6 OllamaService (gap-detector version)

Prompt structure is different — requests a **JSON array** of gaps:

```java
public String analyzeGaps(String studentId, String evaluationHistory) {
    // Prompt: "Identify learning gaps. Respond ONLY with JSON array:
    // [{"concept", "severity", "confidence", "reasoning"}]"
    return callOllama(prompt);
}
```

---

## 6. Ollama AI Integration

### How It Works

Both services communicate with Ollama via **synchronous REST calls**:

```
Service → POST http://localhost:11434/api/generate
        → Body: { "model": "gemma3:4b", "prompt": "...", "stream": false }
        ← Response: { "response": "{\"score\": 65, \"feedback\": \"...\"}" }
```

### The Markdown-Fence Problem

When we switched from `llama3` to `gemma3:4b`, the model started wrapping its JSON output in markdown code fences:

```
```json
{"score": 65, "feedback": "Buena respuesta básica..."}
```​
```

This caused `ObjectMapper.readTree()` to fail. **Fix applied in both services:**

```java
private String stripMarkdownFences(String text) {
    if (text == null) return "";
    return text.replaceAll("(?s)```(?:json)?\\s*", "").trim();
}
```

This regex removes any `` ``` `` or `` ```json `` fence markers, including multiline content between them.

### Configuration

| Property            | Dev Value                      |
|---------------------|--------------------------------|
| `ollama.base-url`   | `http://localhost:11434`       |
| `ollama.model`      | `gemma3:4b`                    |
| `ollama.timeout`    | `60000` (60 seconds)           |
| Temperature         | `0.3` (hardcoded in DTO)       |

---

## 7. Postman Collection — API Test Guide

Two Postman collections are provided in `infrastructure/postman/`:

### Evaluator Service — `TutorBot-Evaluator-Service.postman_collection.json`

| # | Method | Endpoint                                    | Purpose                         |
|---|--------|---------------------------------------------|---------------------------------|
| 1 | GET    | `/api/v1/evaluations`                       | List all 300 evaluations        |
| 2 | GET    | `/api/v1/evaluations/153`                   | Single evaluation by ID         |
| 3 | GET    | `/api/v1/evaluations/student/A00835001`     | Filter by student matrícula     |
| 4 | GET    | `/api/v1/evaluations/session/SESSION-0001`  | Filter by session               |
| 5 | POST   | `/api/v1/evaluations`                       | **AI evaluation (closure)**     |
| 6 | POST   | `/api/v1/evaluations`                       | AI evaluation (Spring Boot)     |
| 7 | POST   | `/api/v1/evaluations`                       | AI evaluation (SQL/normalization)|
| 8 | GET    | `/api/v1/evaluations/99999`                 | 404 error test                  |

**Example POST body (request #5):**

```json
{
  "sessionId": "SESSION-DEMO-001",
  "studentId": "A00835001",
  "questionText": "¿Qué es un closure en JavaScript y para qué sirve?",
  "studentAnswer": "Un closure es cuando una función recuerda las variables de afuera",
  "correctAnswer": "Un closure es una función junto con su entorno léxico...",
  "maxScore": 100,
  "topicId": 2
}
```

**Expected AI response (201 Created):**

```json
{
  "id": 301,
  "score": 65,
  "feedbackSummary": "Buena respuesta básica. El estudiante comprende el concepto general...",
  "evaluatedAt": "2025-07-06T..."
}
```

### Gap Detector Service — `TutorBot-GapDetector-Service.postman_collection.json`

| # | Method | Endpoint                                        | Purpose                          |
|---|--------|-------------------------------------------------|----------------------------------|
| 1 | GET    | `/api/v1/gaps`                                  | List all 200 gaps                |
| 2 | GET    | `/api/v1/gaps/42`                               | Single gap by ID                 |
| 3 | GET    | `/api/v1/gaps/student/A00835001`                | Gaps for a student               |
| 4 | GET    | `/api/v1/gaps/student/A00835001/unresolved`     | Only unresolved gaps             |
| 5 | POST   | `/api/v1/gaps`                                  | Create gap (Big-O Notation)      |
| 6 | PATCH  | `/api/v1/gaps/201/resolve`                      | Mark gap as resolved             |
| 7 | POST   | `/api/v1/gaps`                                  | Create gap (Recursion)           |
| 8 | POST   | `/api/v1/gaps`                                  | Create gap (SQL/3NF)             |

**Example POST body (request #5):**

```json
{
  "studentId": "A00835001",
  "topicId": 5,
  "subtopicId": 12,
  "concept": "Big-O Notation",
  "severity": "HIGH",
  "confidence": 0.92
}
```

### Importing into Postman

1. Open Postman → **Import** (top-left)
2. Drag both `.json` files or click **Upload Files**
3. Both collections appear with a `baseUrl` variable pre-configured
4. Click any request → **Send**

---

## 8. Key Bug Fixes & Lessons Learned

### 8.1 Broken Unit Tests — Constructor Mismatch

**Problem:** `EvaluationServiceTest` and `GapDetectorServiceTest` created the service with only the repository mock, but the constructor now requires `OllamaService` too.

**Fix:** Added `@Mock OllamaService ollamaService` and passed it to the constructor.

### 8.2 Stale `db/schema.sql` Files

**Problem:** Local schema files in both services used columns from an older design (`subtopic_id`, `feedback`, `created_at`) that didn't match the canonical `V1__init_schema.sql`.

**Fix:** Rewrote both to match the V1 DDL exactly.

### 8.3 Stale `db/data.sql` in gap-detector

**Problem:** References to `course_id` in SUBTOPICS (column doesn't exist) and missing `TOPIC_ID`, `CONCEPT`, `CONFIDENCE` in GAPS inserts.

**Fix:** Rewrote with correct column names and proper seed data.

### 8.4 Record Accessor Syntax

**Problem:** Tests used `response.getScore()` but `EvaluationResponse` is a Java **record**, so the accessor is `response.score()` (no `get` prefix).

### 8.5 Ollama Markdown Fences

**Problem:** `gemma3:4b` wraps JSON in `` ```json ``` `` fences → Jackson parse failure.  
**Fix:** `stripMarkdownFences()` regex in both services strips fences before parsing.

---

## 9. Live Demo Steps

### Step 1 — Start Oracle

```bash
docker start oracledb
# Wait ~30 seconds for healthy status
docker ps   # verify STATUS: healthy
```

### Step 2 — Start Ollama

```bash
ollama serve          # if not already running
ollama list           # verify gemma3:4b is present
```

### Step 3 — Start evaluator-service

```bash
cd backend/evaluator-service
mvn spring-boot:run -Dspring-boot.run.profiles=dev
# Wait for "Started EvaluatorServiceApplication on port 8082"
```

### Step 4 — Start gap-detector-service

```bash
cd backend/gap-detector-service
mvn spring-boot:run -Dspring-boot.run.profiles=dev
# Wait for "Started GapDetectorServiceApplication on port 8084"
```

### Step 5 — Demo GET endpoints

```bash
curl http://localhost:8082/api/v1/evaluations | python3 -m json.tool | head -20
curl http://localhost:8084/api/v1/gaps/student/A00835001/unresolved | python3 -m json.tool
```

### Step 6 — Demo AI Evaluation (the highlight)

```bash
curl -s -X POST http://localhost:8082/api/v1/evaluations \
  -H 'Content-Type: application/json' \
  -d '{
    "sessionId": "LIVE-DEMO",
    "studentId": "A00835001",
    "questionText": "¿Qué es un closure en JavaScript?",
    "studentAnswer": "Es cuando una función recuerda variables de afuera",
    "correctAnswer": "Un closure es una función junto con su entorno léxico. Permite acceder a variables del scope padre.",
    "maxScore": 100,
    "topicId": 2
  }' | python3 -m json.tool
```

**Expected:** Score between 50–80, feedback in Spanish, persisted to Oracle.

### Step 7 — Demo Gap Creation & Resolution

```bash
# Create
curl -s -X POST http://localhost:8084/api/v1/gaps \
  -H 'Content-Type: application/json' \
  -d '{"studentId":"A00835001","topicId":5,"subtopicId":12,"concept":"Big-O Notation","severity":"HIGH","confidence":0.92}' \
  | python3 -m json.tool

# Resolve
curl -s -X PATCH http://localhost:8084/api/v1/gaps/201/resolve | python3 -m json.tool
```

---

*End of Presentation Guide*
