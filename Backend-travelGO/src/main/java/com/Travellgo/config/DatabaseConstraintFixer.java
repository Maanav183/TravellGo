package com.Travellgo.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class DatabaseConstraintFixer implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;
    private static final Logger log = LoggerFactory.getLogger(DatabaseConstraintFixer.class);

    public DatabaseConstraintFixer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        String constraintName = "UK_qyqe1jd9mecxcxmt6fok6j7ip";
        String tableName = "ticket";

        try {
            log.info("Attempting to drop obsolete unique constraint '{}' from table '{}'...", constraintName,
                    tableName);
            // MySQL syntax to drop an index (which backs the unique constraint)
            String sql = "ALTER TABLE " + tableName + " DROP INDEX " + constraintName;

            jdbcTemplate.execute(sql);
            log.info("Successfully dropped constraint '{}'. You can now delete this DatabaseConstraintFixer class.",
                    constraintName);
        } catch (Exception e) {
            if (e.getMessage().contains("check that column/key exists")) {
                log.info("Constraint '{}' does not exist. It might have already been removed.", constraintName);
            } else {
                log.warn("Could not drop constraint (it might not exist or is already gone): {}", e.getMessage());
            }
        }
    }
}
