# TutorBot Campus — Installation & Setup Guide

**Target audience:** Students and teaching assistants setting up the project from scratch.  
**OS tested on:** macOS (Apple Silicon / Intel). Steps are similar for Linux; Windows users should use WSL2.

---

## Table of Contents

1. [Prerequisites Overview](#1-prerequisites-overview)
2. [Java 21+](#2-java-21)
3. [Apache Maven](#3-apache-maven)
4. [Docker Desktop](#4-docker-desktop)
5. [Oracle XE 21 (Docker)](#5-oracle-xe-21-docker)
6. [Ollama (Local LLM)](#6-ollama-local-llm)
7. [Postman](#7-postman)
8. [Clone & Project Structure](#8-clone--project-structure)
9. [Database Initialization](#9-database-initialization)
10. [Running the Services](#10-running-the-services)
11. [Verification Checklist](#11-verification-checklist)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Prerequisites Overview

| Tool            | Required Version | Purpose                              |
|-----------------|------------------|--------------------------------------|
| Java (JDK)      | 21 or newer      | Compile and run Spring Boot services |
| Apache Maven     | 3.9+             | Build tool for Java projects         |
| Docker Desktop   | Latest           | Run Oracle DB and other containers   |
| Ollama           | Latest           | Run local LLM (gemma3:4b)           |
| Postman          | Latest           | Test REST APIs                       |
| Git              | Any              | Clone the repository                 |

---

## 2. Java 21+

### macOS (Homebrew)

```bash
brew install openjdk@21
```

After installation, add to your shell profile (`~/.zshrc`):

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
export PATH="$JAVA_HOME/bin:$PATH"
```

Reload:

```bash
source ~/.zshrc
java -version
# Expected: openjdk version "21.x.x" or newer
```

### Alternative: SDKMAN

```bash
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"
sdk install java 21.0.3-tem
```

### Verify

```bash
java -version
# openjdk version "21.0.x" ...
```

> **Note:** The project's `pom.xml` targets Java 21 (`<java.version>21</java.version>`). Java 22 or 23 also work.

---

## 3. Apache Maven

### macOS (Homebrew)

```bash
brew install maven
```

### Verify

```bash
mvn -version
# Apache Maven 3.9.x ...
# Java version: 21.0.x
```

> Maven must show Java 21+ in its output. If it shows an older Java, set `JAVA_HOME` correctly.

---

## 4. Docker Desktop

### macOS

1. Download from [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
2. Install the `.dmg` and launch Docker Desktop
3. In Docker Desktop **Settings → Resources**, allocate at least **4 GB RAM** (Oracle needs ~2 GB)

### Verify

```bash
docker --version
docker compose version
```

---

## 5. Oracle XE 21 (Docker)

The project uses the lightweight `gvenzl/oracle-xe:21-slim` image.

### Option A — Start via Docker Compose (recommended)

```bash
cd infrastructure
docker compose -f docker-compose.dev.yml up -d oracle-db
```

This creates a container named `oracledb` with:

| Setting        | Value        |
|----------------|--------------|
| Container name | `oracledb`   |
| Host port      | `1522`       |
| Container port | `1521`       |
| Service name   | `TESTDB`     |
| SYS password   | `password`   |
| App user       | `Adolfo`     |
| App password   | `password`   |
| Memory limit   | 2 GB         |

### Option B — Manual Docker run

```bash
docker run -d \
  --name oracledb \
  -p 1522:1521 \
  -e ORACLE_PASSWORD=password \
  -e APP_USER=Adolfo \
  -e APP_USER_PASSWORD=password \
  --memory=2g \
  gvenzl/oracle-xe:21-slim
```

### Wait for Oracle to be ready

The first start takes **2–5 minutes** while Oracle initializes the database.

```bash
docker logs -f oracledb
# Wait for: "DATABASE IS READY TO USE!"
```

Or check health:

```bash
docker ps
# STATUS should show (healthy)
```

### Connection details for SQL clients

| Property        | Value                                    |
|-----------------|------------------------------------------|
| JDBC URL        | `jdbc:oracle:thin:@localhost:1522/TESTDB` |
| Username        | `Adolfo`                                 |
| Password        | `password`                               |
| Hostname        | `localhost`                              |
| Port            | `1522`                                   |
| Service name    | `TESTDB`                                 |

---

## 6. Ollama (Local LLM)

Ollama runs large language models locally on your machine. We use `gemma3:4b` (3.3 GB).

### macOS Install

```bash
brew install ollama
```

Or download from [https://ollama.com/download](https://ollama.com/download)

### Start the Ollama server

```bash
ollama serve
```

This starts the API on `http://localhost:11434`. Keep this terminal open.

### Pull the model

In a **separate terminal**:

```bash
ollama pull gemma3:4b
```

This downloads ~3.3 GB. Wait for completion.

### Verify

```bash
ollama list
# NAME          SIZE
# gemma3:4b     3.3 GB
```

Test the API:

```bash
curl http://localhost:11434/api/tags
```

### System Requirements for Ollama

| Requirement | Minimum     | Recommended    |
|-------------|-------------|----------------|
| RAM         | 8 GB        | 16 GB          |
| Disk        | 5 GB free   | 10 GB free     |
| GPU         | Not required| Apple M-series benefits |

> On Apple Silicon Macs, Ollama uses the GPU automatically. On Intel Macs, it runs on CPU (slower, ~30–60s per request).

---

## 7. Postman

### Install

- Download from [https://www.postman.com/downloads/](https://www.postman.com/downloads/)
- Or via Homebrew: `brew install --cask postman`

### Import Collections

1. Open Postman
2. Click **Import** (top-left corner)
3. Navigate to `infrastructure/postman/` in the project
4. Select both files:
   - `TutorBot-Evaluator-Service.postman_collection.json`
   - `TutorBot-GapDetector-Service.postman_collection.json`
5. Click **Import**

Each collection has a `baseUrl` variable set to `http://localhost:8082` and `http://localhost:8084` respectively.

---

## 8. Clone & Project Structure

### Clone the repository

```bash
git clone <repository-url>
cd tutorbot-campus
```

### Key directories

```
tutorbot-campus/
├── backend/
│   ├── evaluator-service/     ← Port 8082
│   ├── gap-detector-service/  ← Port 8084
│   ├── session-service/       ← Port 8081 (not in today's scope)
│   ├── api-gateway/           ← Port 8080
│   ├── eureka-server/         ← Port 8761
│   └── shared/
├── infrastructure/
│   ├── docker-compose.dev.yml ← All containers
│   ├── oracle/
│   │   ├── V1__init_schema.sql  ← DDL (tables + sequences)
│   │   └── V2__seed_data.sql    ← Seed data (300 evals, 200 gaps)
│   └── postman/
│       ├── TutorBot-Evaluator-Service.postman_collection.json
│       └── TutorBot-GapDetector-Service.postman_collection.json
├── frontend/                  ← React/Next.js (future)
└── docs/
```

---

## 9. Database Initialization

After Oracle is running and healthy, you need to create the schema and load seed data.

### Connect to Oracle

Using any SQL client (SQL Developer, DBeaver, IntelliJ, or SQLPlus via Docker):

```bash
docker exec -it oracledb sqlplus Adolfo/password@//localhost:1521/TESTDB
```

### Run the DDL script

Copy the contents of `infrastructure/oracle/V1__init_schema.sql` and execute it. This creates:

- 5 sequences: `SEQ_EVALUATIONS`, `SEQ_COURSES`, `SEQ_TOPICS`, `SEQ_SUBTOPICS`, `SEQ_GAPS`
- 5 tables: `EVALUATIONS`, `COURSES`, `TOPICS`, `SUBTOPICS`, `GAPS`

All statements are **idempotent** — safe to run multiple times.

### Run the seed data script

Copy the contents of `infrastructure/oracle/V2__seed_data.sql` and execute it. This inserts:

- 6 courses (Computer Science topics)
- 20 topics
- 50 subtopics
- 300 evaluations (random scores for students A00835001–A00835015)
- 200 learning gaps

Uses `MERGE` statements — also safe to rerun.

### Verify

```sql
SELECT 'EVALUATIONS' AS tbl, COUNT(*) AS cnt FROM EVALUATIONS
UNION ALL
SELECT 'COURSES', COUNT(*) FROM COURSES
UNION ALL
SELECT 'TOPICS', COUNT(*) FROM TOPICS
UNION ALL
SELECT 'SUBTOPICS', COUNT(*) FROM SUBTOPICS
UNION ALL
SELECT 'GAPS', COUNT(*) FROM GAPS;
```

Expected: 300, 6, 20, 50, 200.

---

## 10. Running the Services

### Start order

1. **Oracle** (already running in Docker)
2. **Ollama** (already serving on port 11434)
3. **evaluator-service**
4. **gap-detector-service**

### evaluator-service

```bash
cd backend/evaluator-service
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

Wait for:

```
Oracle connection verified successfully — URL: jdbc:oracle:thin:@localhost:1522/TESTDB
Started EvaluatorServiceApplication in X.XX seconds
```

Service is now available at `http://localhost:8082`.

### gap-detector-service

```bash
cd backend/gap-detector-service
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

Wait for:

```
Oracle connection verified successfully — URL: jdbc:oracle:thin:@localhost:1522/TESTDB
Started GapDetectorServiceApplication in X.XX seconds
```

Service is now available at `http://localhost:8084`.

### The `-Dspring-boot.run.profiles=dev` flag

This activates `application-dev.properties` which:

- Points Oracle to `localhost:1522` instead of the Docker network alias
- **Disables** Eureka registration (no need to run Eureka locally)
- **Disables** RabbitMQ auto-configuration
- Sets the Ollama model to `gemma3:4b` with a 60-second timeout

---

## 11. Verification Checklist

Run these commands to confirm everything works:

```bash
# 1. Oracle is healthy
docker ps | grep oracledb
# Expected: STATUS shows (healthy)

# 2. Ollama is running
curl -s http://localhost:11434/api/tags | python3 -m json.tool
# Expected: models list includes gemma3:4b

# 3. Evaluator service is up
curl -s http://localhost:8082/api/v1/evaluations | python3 -m json.tool | head -5
# Expected: JSON array of evaluations

# 4. Gap detector service is up
curl -s http://localhost:8084/api/v1/gaps | python3 -m json.tool | head -5
# Expected: JSON array of gaps

# 5. AI evaluation works
curl -s -X POST http://localhost:8082/api/v1/evaluations \
  -H 'Content-Type: application/json' \
  -d '{"sessionId":"TEST","studentId":"A00835001","questionText":"What is a variable?","studentAnswer":"A box for data","correctAnswer":"A named memory location that stores a value.","maxScore":100,"topicId":1}' \
  | python3 -m json.tool
# Expected: score > 0, feedback in Spanish
```

---

## 12. Troubleshooting

### Oracle won't start

```bash
docker logs oracledb | tail -20
```

Common issues:
- **Port conflict:** Another process on port 1522. Change the port mapping in `docker-compose.dev.yml`.
- **Not enough memory:** Ensure Docker has at least 4 GB allocated.
- **First-time init takes long:** Wait up to 5 minutes.

### "Connection refused" to Oracle

- Oracle may still be initializing. Check `docker ps` for **healthy** status.
- Ensure you're using port `1522` (not 1521).

### Ollama is slow

- On Intel Macs, gemma3:4b runs on CPU — expect 30–60 seconds per request.
- The timeout is set to 60 seconds in `application-dev.properties`.
- If it still times out, increase `ollama.timeout` to `120000`.

### Maven build fails

```bash
mvn clean compile -e
# Check the error output
```

- Ensure `JAVA_HOME` points to Java 21+.
- Run `mvn -version` to verify Maven uses the correct Java.

### "Evaluation not found" or empty results

- Ensure you ran `V2__seed_data.sql` to populate the database.
- Check with: `docker exec -it oracledb sqlplus Adolfo/password@//localhost:1521/TESTDB -c "SELECT COUNT(*) FROM EVALUATIONS;"`

### AI returns score=0 with raw text as feedback

- Ollama may not be running. Check: `curl http://localhost:11434/api/tags`
- The model may not be pulled. Run: `ollama pull gemma3:4b`

---

*End of Installation & Setup Guide*
