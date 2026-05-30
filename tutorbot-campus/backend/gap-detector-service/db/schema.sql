-- Schema for gap-detector-service (Oracle)
-- NOTE: The canonical schema is in infrastructure/oracle/V1__init_schema.sql
-- This file is kept as a reference for this service's tables only.

-- =====================  SEQUENCES  ==========================

DECLARE
    seq_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO seq_exists FROM user_sequences WHERE sequence_name = 'SEQ_COURSES';
    IF seq_exists = 0 THEN
        EXECUTE IMMEDIATE 'CREATE SEQUENCE SEQ_COURSES START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE';
    END IF;
END;
/

DECLARE
    seq_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO seq_exists FROM user_sequences WHERE sequence_name = 'SEQ_TOPICS';
    IF seq_exists = 0 THEN
        EXECUTE IMMEDIATE 'CREATE SEQUENCE SEQ_TOPICS START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE';
    END IF;
END;
/

DECLARE
    seq_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO seq_exists FROM user_sequences WHERE sequence_name = 'SEQ_SUBTOPICS';
    IF seq_exists = 0 THEN
        EXECUTE IMMEDIATE 'CREATE SEQUENCE SEQ_SUBTOPICS START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE';
    END IF;
END;
/

DECLARE
    seq_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO seq_exists FROM user_sequences WHERE sequence_name = 'SEQ_GAPS';
    IF seq_exists = 0 THEN
        EXECUTE IMMEDIATE 'CREATE SEQUENCE SEQ_GAPS START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE';
    END IF;
END;
/

-- =====================  TABLES  =============================

-- COURSES
DECLARE
    table_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO table_exists FROM user_tables WHERE table_name = 'COURSES';
    IF table_exists = 0 THEN
        EXECUTE IMMEDIATE '
            CREATE TABLE COURSES (
                ID   NUMBER        NOT NULL,
                NAME VARCHAR2(255) NOT NULL,
                CODE VARCHAR2(50),
                CONSTRAINT PK_COURSES PRIMARY KEY (ID)
            )
        ';
    END IF;
END;
/

-- TOPICS
DECLARE
    table_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO table_exists FROM user_tables WHERE table_name = 'TOPICS';
    IF table_exists = 0 THEN
        EXECUTE IMMEDIATE '
            CREATE TABLE TOPICS (
                ID        NUMBER        NOT NULL,
                NAME      VARCHAR2(255) NOT NULL,
                COURSE_ID NUMBER,
                CONSTRAINT PK_TOPICS PRIMARY KEY (ID)
            )
        ';
    END IF;
END;
/

-- SUBTOPICS
DECLARE
    table_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO table_exists FROM user_tables WHERE table_name = 'SUBTOPICS';
    IF table_exists = 0 THEN
        EXECUTE IMMEDIATE '
            CREATE TABLE SUBTOPICS (
                ID       NUMBER        NOT NULL,
                NAME     VARCHAR2(255) NOT NULL,
                TOPIC_ID NUMBER,
                CONSTRAINT PK_SUBTOPICS PRIMARY KEY (ID)
            )
        ';
    END IF;
END;
/

-- GAPS
DECLARE
    table_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO table_exists FROM user_tables WHERE table_name = 'GAPS';
    IF table_exists = 0 THEN
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
            )
        ';
    END IF;
END;
/

-- =====================  INDEXES  ============================

DECLARE
    idx_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO idx_exists FROM user_indexes WHERE index_name = 'IDX_GAPS_STUDENT';
    IF idx_exists = 0 THEN
        EXECUTE IMMEDIATE 'CREATE INDEX IDX_GAPS_STUDENT ON GAPS(STUDENT_ID)';
    END IF;

    SELECT COUNT(*) INTO idx_exists FROM user_indexes WHERE index_name = 'IDX_GAPS_TOPIC';
    IF idx_exists = 0 THEN
        EXECUTE IMMEDIATE 'CREATE INDEX IDX_GAPS_TOPIC ON GAPS(TOPIC_ID)';
    END IF;
END;
/
