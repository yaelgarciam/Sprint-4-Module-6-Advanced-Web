package com.tutorbot.session.repository;

import com.tutorbot.session.model.SessionContext;
import java.util.List;
import org.springframework.data.repository.CrudRepository;

public interface SessionContextRepository extends CrudRepository<SessionContext, String> {

    List<SessionContext> findAll();
}
