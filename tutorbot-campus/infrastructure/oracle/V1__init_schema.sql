-- ============================================================
-- TutorBot Campus — Idempotent Oracle DDL
-- Safe to run multiple times: every CREATE is guarded by
-- a "table/sequence already exists" check (ORA-00955 / ORA-01430).
-- Run as user ADOLFO against TESTDB.
-- ============================================================

-- =====================  SEQUENCES  ==========================

DECLARE
    v_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_exists FROM user_sequences WHERE sequence_name = 'SEQ_EVALUATIONS';
    IF v_exists = 0 THEN
        EXECUTE IMMEDIATE 'CREATE SEQUENCE SEQ_EVALUATIONS START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE';
    END IF;
END;
/

DECLARE
    v_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_exists FROM user_sequences WHERE sequence_name = 'SEQ_COURSES';
    IF v_exists = 0 THEN
        EXECUTE IMMEDIATE 'CREATE SEQUENCE SEQ_COURSES START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE';
    END IF;
END;
/

DECLARE
    v_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_exists FROM user_sequences WHERE sequence_name = 'SEQ_TOPICS';
    IF v_exists = 0 THEN
        EXECUTE IMMEDIATE 'CREATE SEQUENCE SEQ_TOPICS START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE';
    END IF;
END;
/

DECLARE
    v_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_exists FROM user_sequences WHERE sequence_name = 'SEQ_SUBTOPICS';
    IF v_exists = 0 THEN
        EXECUTE IMMEDIATE 'CREATE SEQUENCE SEQ_SUBTOPICS START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE';
    END IF;
END;
/

DECLARE
    v_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_exists FROM user_sequences WHERE sequence_name = 'SEQ_GAPS';
    IF v_exists = 0 THEN
        EXECUTE IMMEDIATE 'CREATE SEQUENCE SEQ_GAPS START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE';
    END IF;
END;
/

-- =====================  TABLES  =============================

-- 1. EVALUATIONS  (evaluator-service → EvaluationResult.java)
DECLARE
    v_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_exists FROM user_tables WHERE table_name = 'EVALUATIONS';
    IF v_exists = 0 THEN
        EXECUTE IMMEDIATE '
            CREATE TABLE EVALUATIONS (
                ID               NUMBER        NOT NULL,
                SESSION_ID       VARCHAR2(255) NOT NULL,
                STUDENT_ID       VARCHAR2(255) NOT NULL,
                QUESTION_TEXT    CLOB,
                STUDENT_ANSWER   CLOB,
                CORRECT_ANSWER   CLOB,
                SCORE            NUMBER(10),
                MAX_SCORE        NUMBER(10),
                FEEDBACK_SUMMARY CLOB,
                TOPIC_ID         NUMBER,
                EVALUATED_AT     TIMESTAMP,
                CONSTRAINT PK_EVALUATIONS PRIMARY KEY (ID)
            )';
    END IF;
END;
/

-- 2. COURSES  (gap-detector-service → Course.java)
DECLARE
    v_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_exists FROM user_tables WHERE table_name = 'COURSES';
    IF v_exists = 0 THEN
        EXECUTE IMMEDIATE '
            CREATE TABLE COURSES (
                ID   NUMBER        NOT NULL,
                NAME VARCHAR2(255) NOT NULL,
                CODE VARCHAR2(50),
                CONSTRAINT PK_COURSES PRIMARY KEY (ID)
            )';
    END IF;
END;
/

-- 3. TOPICS  (gap-detector-service → Topic.java)
DECLARE
    v_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_exists FROM user_tables WHERE table_name = 'TOPICS';
    IF v_exists = 0 THEN
        EXECUTE IMMEDIATE '
            CREATE TABLE TOPICS (
                ID        NUMBER        NOT NULL,
                NAME      VARCHAR2(255) NOT NULL,
                COURSE_ID NUMBER,
                CONSTRAINT PK_TOPICS PRIMARY KEY (ID)
            )';
    END IF;
END;
/

-- 4. SUBTOPICS  (gap-detector-service → Subtopic.java)
DECLARE
    v_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_exists FROM user_tables WHERE table_name = 'SUBTOPICS';
    IF v_exists = 0 THEN
        EXECUTE IMMEDIATE '
            CREATE TABLE SUBTOPICS (
                ID       NUMBER        NOT NULL,
                NAME     VARCHAR2(255) NOT NULL,
                TOPIC_ID NUMBER,
                CONSTRAINT PK_SUBTOPICS PRIMARY KEY (ID)
            )';
    END IF;
END;
/

-- 5. GAPS  (gap-detector-service → LearningGap.java)
DECLARE
    v_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_exists FROM user_tables WHERE table_name = 'GAPS';
    IF v_exists = 0 THEN
        EXECUTE IMMEDIATE '
            CREATE TABLE GAPS (
                ID          NUMBER        NOT NULL,
                STUDENT_ID  VARCHAR2(255) NOT NULL,
                TOPIC_ID    NUMBER,
                SUBTOPIC_ID NUMBER,
                CONCEPT     VARCHAR2(255) NOT NULL,
                SEVERITY    VARCHAR2(50)  NOT NULL,
                CONFIDENCE  FLOAT,
                DETECTED_AT TIMESTAMP,
                RESOLVED    NUMBER(1),
                CONSTRAINT PK_GAPS PRIMARY KEY (ID)
            )';
    END IF;
END;
/

-- 6. SKILLS  (evaluator-service → Skill.java)
DECLARE
    v_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_exists FROM user_sequences WHERE sequence_name = 'SEQ_SKILLS';
    IF v_exists = 0 THEN
        EXECUTE IMMEDIATE 'CREATE SEQUENCE SEQ_SKILLS START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE';
    END IF;
END;
/

DECLARE
    v_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_exists FROM user_tables WHERE table_name = 'SKILLS';
    IF v_exists = 0 THEN
        EXECUTE IMMEDIATE '
            CREATE TABLE SKILLS (
                ID     NUMBER        NOT NULL,
                NAME   VARCHAR2(255) NOT NULL,
                ACTIVE NUMBER(1)     DEFAULT 1 NOT NULL,
                CONSTRAINT PK_SKILLS PRIMARY KEY (ID)
            )';
    END IF;
END;
/

-- 7. Add ACTIVE and SKILL_ID columns to TOPICS (idempotent)
DECLARE
    v_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_exists FROM user_tab_columns WHERE table_name = 'TOPICS' AND column_name = 'ACTIVE';
    IF v_exists = 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE TOPICS ADD ACTIVE NUMBER(1) DEFAULT 1 NOT NULL';
    END IF;
END;
/

DECLARE
    v_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_exists FROM user_tab_columns WHERE table_name = 'TOPICS' AND column_name = 'SKILL_ID';
    IF v_exists = 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE TOPICS ADD SKILL_ID NUMBER';
    END IF;
END;
/

-- 8. LEARNING_PATHS  (evaluator-service → LearningPathOracle.java)
DECLARE
    v_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_exists FROM user_sequences WHERE sequence_name = 'SEQ_LEARNING_PATHS';
    IF v_exists = 0 THEN
        EXECUTE IMMEDIATE 'CREATE SEQUENCE SEQ_LEARNING_PATHS START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE';
    END IF;
END;
/

DECLARE
    v_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_exists FROM user_tables WHERE table_name = 'LEARNING_PATHS';
    IF v_exists = 0 THEN
        EXECUTE IMMEDIATE '
            CREATE TABLE LEARNING_PATHS (
                ID         NUMBER        NOT NULL,
                STUDENT_ID VARCHAR2(255) NOT NULL,
                TOPIC_ID   NUMBER        NOT NULL,
                CONSTRAINT PK_LEARNING_PATHS PRIMARY KEY (ID)
            )';
    END IF;
END;
/

-- =====================  FOREIGN KEYS (idempotent)  ==========

DECLARE
    v_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_exists FROM user_constraints WHERE constraint_name = 'FK_TOPICS_COURSE';
    IF v_exists = 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE TOPICS ADD CONSTRAINT FK_TOPICS_COURSE FOREIGN KEY (COURSE_ID) REFERENCES COURSES(ID)';
    END IF;
END;
/

DECLARE
    v_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_exists FROM user_constraints WHERE constraint_name = 'FK_SUBTOPICS_TOPIC';
    IF v_exists = 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE SUBTOPICS ADD CONSTRAINT FK_SUBTOPICS_TOPIC FOREIGN KEY (TOPIC_ID) REFERENCES TOPICS(ID)';
    END IF;
END;
/

DECLARE
    v_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_exists FROM user_constraints WHERE constraint_name = 'FK_GAPS_TOPIC';
    IF v_exists = 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE GAPS ADD CONSTRAINT FK_GAPS_TOPIC FOREIGN KEY (TOPIC_ID) REFERENCES TOPICS(ID)';
    END IF;
END;
/

DECLARE
    v_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_exists FROM user_constraints WHERE constraint_name = 'FK_GAPS_SUBTOPIC';
    IF v_exists = 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE GAPS ADD CONSTRAINT FK_GAPS_SUBTOPIC FOREIGN KEY (SUBTOPIC_ID) REFERENCES SUBTOPICS(ID)';
    END IF;
END;
/

DECLARE
    v_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_exists FROM user_constraints WHERE constraint_name = 'FK_TOPICS_SKILL';
    IF v_exists = 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE TOPICS ADD CONSTRAINT FK_TOPICS_SKILL FOREIGN KEY (SKILL_ID) REFERENCES SKILLS(ID)';
    END IF;
END;
/

DECLARE
    v_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_exists FROM user_constraints WHERE constraint_name = 'FK_LP_TOPIC';
    IF v_exists = 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE LEARNING_PATHS ADD CONSTRAINT FK_LP_TOPIC FOREIGN KEY (TOPIC_ID) REFERENCES TOPICS(ID)';
    END IF;
END;
/

-- =====================  INDEXES (idempotent)  ===============

DECLARE
    v_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_exists FROM user_indexes WHERE index_name = 'IDX_EVAL_STUDENT';
    IF v_exists = 0 THEN
        EXECUTE IMMEDIATE 'CREATE INDEX IDX_EVAL_STUDENT ON EVALUATIONS(STUDENT_ID)';
    END IF;
END;
/

DECLARE
    v_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_exists FROM user_indexes WHERE index_name = 'IDX_EVAL_SESSION';
    IF v_exists = 0 THEN
        EXECUTE IMMEDIATE 'CREATE INDEX IDX_EVAL_SESSION ON EVALUATIONS(SESSION_ID)';
    END IF;
END;
/

DECLARE
    v_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_exists FROM user_indexes WHERE index_name = 'IDX_EVAL_TOPIC';
    IF v_exists = 0 THEN
        EXECUTE IMMEDIATE 'CREATE INDEX IDX_EVAL_TOPIC ON EVALUATIONS(TOPIC_ID)';
    END IF;
END;
/

DECLARE
    v_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_exists FROM user_indexes WHERE index_name = 'IDX_GAPS_STUDENT';
    IF v_exists = 0 THEN
        EXECUTE IMMEDIATE 'CREATE INDEX IDX_GAPS_STUDENT ON GAPS(STUDENT_ID)';
    END IF;
END;
/

DECLARE
    v_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_exists FROM user_indexes WHERE index_name = 'IDX_GAPS_TOPIC';
    IF v_exists = 0 THEN
        EXECUTE IMMEDIATE 'CREATE INDEX IDX_GAPS_TOPIC ON GAPS(TOPIC_ID)';
    END IF;
END;
/

DECLARE
    v_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_exists FROM user_indexes WHERE index_name = 'IDX_GAPS_RESOLVED';
    IF v_exists = 0 THEN
        EXECUTE IMMEDIATE 'CREATE INDEX IDX_GAPS_RESOLVED ON GAPS(STUDENT_ID, RESOLVED)';
    END IF;
END;
/

-- =====================  SEED DATA (idempotent)  =============

-- Courses
MERGE INTO COURSES tgt
USING (SELECT 1 AS ID, 'Programación Web' AS NAME, 'TC2005B' AS CODE FROM DUAL) src
ON (tgt.ID = src.ID)
WHEN NOT MATCHED THEN INSERT (ID, NAME, CODE) VALUES (src.ID, src.NAME, src.CODE);

MERGE INTO COURSES tgt
USING (SELECT 2 AS ID, 'Estructura de Datos' AS NAME, 'TC1031' AS CODE FROM DUAL) src
ON (tgt.ID = src.ID)
WHEN NOT MATCHED THEN INSERT (ID, NAME, CODE) VALUES (src.ID, src.NAME, src.CODE);

-- Topics
MERGE INTO TOPICS tgt
USING (SELECT 1 AS ID, 'HTML y CSS' AS NAME, 1 AS COURSE_ID FROM DUAL) src
ON (tgt.ID = src.ID)
WHEN NOT MATCHED THEN INSERT (ID, NAME, COURSE_ID) VALUES (src.ID, src.NAME, src.COURSE_ID);

MERGE INTO TOPICS tgt
USING (SELECT 2 AS ID, 'JavaScript' AS NAME, 1 AS COURSE_ID FROM DUAL) src
ON (tgt.ID = src.ID)
WHEN NOT MATCHED THEN INSERT (ID, NAME, COURSE_ID) VALUES (src.ID, src.NAME, src.COURSE_ID);

MERGE INTO TOPICS tgt
USING (SELECT 3 AS ID, 'Spring Boot' AS NAME, 1 AS COURSE_ID FROM DUAL) src
ON (tgt.ID = src.ID)
WHEN NOT MATCHED THEN INSERT (ID, NAME, COURSE_ID) VALUES (src.ID, src.NAME, src.COURSE_ID);

MERGE INTO TOPICS tgt
USING (SELECT 4 AS ID, 'Árboles Binarios' AS NAME, 2 AS COURSE_ID FROM DUAL) src
ON (tgt.ID = src.ID)
WHEN NOT MATCHED THEN INSERT (ID, NAME, COURSE_ID) VALUES (src.ID, src.NAME, src.COURSE_ID);

-- Subtopics
MERGE INTO SUBTOPICS tgt
USING (SELECT 1 AS ID, 'Selectores CSS' AS NAME, 1 AS TOPIC_ID FROM DUAL) src
ON (tgt.ID = src.ID)
WHEN NOT MATCHED THEN INSERT (ID, NAME, TOPIC_ID) VALUES (src.ID, src.NAME, src.TOPIC_ID);

MERGE INTO SUBTOPICS tgt
USING (SELECT 2 AS ID, 'Flexbox y Grid' AS NAME, 1 AS TOPIC_ID FROM DUAL) src
ON (tgt.ID = src.ID)
WHEN NOT MATCHED THEN INSERT (ID, NAME, TOPIC_ID) VALUES (src.ID, src.NAME, src.TOPIC_ID);

MERGE INTO SUBTOPICS tgt
USING (SELECT 3 AS ID, 'Closures' AS NAME, 2 AS TOPIC_ID FROM DUAL) src
ON (tgt.ID = src.ID)
WHEN NOT MATCHED THEN INSERT (ID, NAME, TOPIC_ID) VALUES (src.ID, src.NAME, src.TOPIC_ID);

MERGE INTO SUBTOPICS tgt
USING (SELECT 4 AS ID, 'Promesas y Async/Await' AS NAME, 2 AS TOPIC_ID FROM DUAL) src
ON (tgt.ID = src.ID)
WHEN NOT MATCHED THEN INSERT (ID, NAME, TOPIC_ID) VALUES (src.ID, src.NAME, src.TOPIC_ID);

MERGE INTO SUBTOPICS tgt
USING (SELECT 5 AS ID, 'REST Controllers' AS NAME, 3 AS TOPIC_ID FROM DUAL) src
ON (tgt.ID = src.ID)
WHEN NOT MATCHED THEN INSERT (ID, NAME, TOPIC_ID) VALUES (src.ID, src.NAME, src.TOPIC_ID);

-- Advance sequences past seed data
DECLARE
    v_val NUMBER;
BEGIN
    SELECT SEQ_COURSES.NEXTVAL INTO v_val FROM DUAL;
    SELECT SEQ_COURSES.NEXTVAL INTO v_val FROM DUAL;

    SELECT SEQ_TOPICS.NEXTVAL INTO v_val FROM DUAL;
    SELECT SEQ_TOPICS.NEXTVAL INTO v_val FROM DUAL;
    SELECT SEQ_TOPICS.NEXTVAL INTO v_val FROM DUAL;
    SELECT SEQ_TOPICS.NEXTVAL INTO v_val FROM DUAL;

    SELECT SEQ_SUBTOPICS.NEXTVAL INTO v_val FROM DUAL;
    SELECT SEQ_SUBTOPICS.NEXTVAL INTO v_val FROM DUAL;
    SELECT SEQ_SUBTOPICS.NEXTVAL INTO v_val FROM DUAL;
    SELECT SEQ_SUBTOPICS.NEXTVAL INTO v_val FROM DUAL;
    SELECT SEQ_SUBTOPICS.NEXTVAL INTO v_val FROM DUAL;
END;
/

-- =====================  SEED — SKILLS  ======================
MERGE INTO SKILLS tgt USING (SELECT 1 AS ID, 'Desarrollo Web'          AS NAME, 1 AS ACTIVE FROM DUAL) src ON (tgt.ID=src.ID) WHEN NOT MATCHED THEN INSERT(ID,NAME,ACTIVE) VALUES(src.ID,src.NAME,src.ACTIVE);
MERGE INTO SKILLS tgt USING (SELECT 2 AS ID, 'Estructuras de Datos'    AS NAME, 1 AS ACTIVE FROM DUAL) src ON (tgt.ID=src.ID) WHEN NOT MATCHED THEN INSERT(ID,NAME,ACTIVE) VALUES(src.ID,src.NAME,src.ACTIVE);
MERGE INTO SKILLS tgt USING (SELECT 3 AS ID, 'Bases de Datos'          AS NAME, 1 AS ACTIVE FROM DUAL) src ON (tgt.ID=src.ID) WHEN NOT MATCHED THEN INSERT(ID,NAME,ACTIVE) VALUES(src.ID,src.NAME,src.ACTIVE);
MERGE INTO SKILLS tgt USING (SELECT 4 AS ID, 'Inteligencia Artificial' AS NAME, 1 AS ACTIVE FROM DUAL) src ON (tgt.ID=src.ID) WHEN NOT MATCHED THEN INSERT(ID,NAME,ACTIVE) VALUES(src.ID,src.NAME,src.ACTIVE);
MERGE INTO SKILLS tgt USING (SELECT 5 AS ID, 'Redes'                   AS NAME, 0 AS ACTIVE FROM DUAL) src ON (tgt.ID=src.ID) WHEN NOT MATCHED THEN INSERT(ID,NAME,ACTIVE) VALUES(src.ID,src.NAME,src.ACTIVE);
MERGE INTO SKILLS tgt USING (SELECT 6 AS ID, 'Ingeniería de Software'  AS NAME, 1 AS ACTIVE FROM DUAL) src ON (tgt.ID=src.ID) WHEN NOT MATCHED THEN INSERT(ID,NAME,ACTIVE) VALUES(src.ID,src.NAME,src.ACTIVE);

-- Update TOPICS with SKILL_ID and ACTIVE (some inactive for testing)
UPDATE TOPICS SET SKILL_ID = 1, ACTIVE = 1 WHERE ID IN (1,2,3,20);
UPDATE TOPICS SET SKILL_ID = 2, ACTIVE = 1 WHERE ID IN (4,5,6,7);
UPDATE TOPICS SET SKILL_ID = 3, ACTIVE = 1 WHERE ID IN (8,9,10,11);
UPDATE TOPICS SET SKILL_ID = 4, ACTIVE = 1 WHERE ID IN (12,13,14);
UPDATE TOPICS SET SKILL_ID = 5, ACTIVE = 1 WHERE ID IN (15,16);
UPDATE TOPICS SET SKILL_ID = 6, ACTIVE = 1 WHERE ID IN (17,18,19);
-- Make topic 16 (Seguridad en Redes) inactive for testing
UPDATE TOPICS SET ACTIVE = 0 WHERE ID = 16;

-- =====================  SEED — LEARNING_PATHS  ==============
-- Only enroll in topics that V1 creates (1-4). V2 adds the rest.
MERGE INTO LEARNING_PATHS tgt USING (SELECT  1 AS ID, 'A00835001' AS SID, 1 AS TID FROM DUAL) src ON (tgt.ID=src.ID) WHEN NOT MATCHED THEN INSERT(ID,STUDENT_ID,TOPIC_ID) VALUES(src.ID,src.SID,src.TID);
MERGE INTO LEARNING_PATHS tgt USING (SELECT  2 AS ID, 'A00835001' AS SID, 2 AS TID FROM DUAL) src ON (tgt.ID=src.ID) WHEN NOT MATCHED THEN INSERT(ID,STUDENT_ID,TOPIC_ID) VALUES(src.ID,src.SID,src.TID);
MERGE INTO LEARNING_PATHS tgt USING (SELECT  3 AS ID, 'A00835001' AS SID, 3 AS TID FROM DUAL) src ON (tgt.ID=src.ID) WHEN NOT MATCHED THEN INSERT(ID,STUDENT_ID,TOPIC_ID) VALUES(src.ID,src.SID,src.TID);
MERGE INTO LEARNING_PATHS tgt USING (SELECT  4 AS ID, 'A00835002' AS SID, 1 AS TID FROM DUAL) src ON (tgt.ID=src.ID) WHEN NOT MATCHED THEN INSERT(ID,STUDENT_ID,TOPIC_ID) VALUES(src.ID,src.SID,src.TID);
MERGE INTO LEARNING_PATHS tgt USING (SELECT  5 AS ID, 'A00835002' AS SID, 4 AS TID FROM DUAL) src ON (tgt.ID=src.ID) WHEN NOT MATCHED THEN INSERT(ID,STUDENT_ID,TOPIC_ID) VALUES(src.ID,src.SID,src.TID);

COMMIT;
