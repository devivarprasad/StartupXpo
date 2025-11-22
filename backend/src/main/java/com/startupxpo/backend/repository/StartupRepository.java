package com.startupxpo.backend.repository;

import com.startupxpo.backend.model.Startup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StartupRepository  extends JpaRepository<Startup, Long> {
}
