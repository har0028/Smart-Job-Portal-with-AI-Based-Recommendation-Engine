package com.smartjobportal.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Bean
    @Primary
    public DataSource dataSource() {
        String dbUrl = System.getenv("SPRING_DATASOURCE_URL");
        if (dbUrl == null || dbUrl.isBlank()) {
            dbUrl = System.getenv("DATABASE_URL");
        }
        if (dbUrl == null || dbUrl.isBlank()) {
            dbUrl = System.getenv("MYSQL_URL");
        }

        String username = System.getenv("SPRING_DATASOURCE_USERNAME");
        if (username == null || username.isBlank()) {
            username = System.getenv("MYSQLUSER");
        }

        String password = System.getenv("SPRING_DATASOURCE_PASSWORD");
        if (password == null || password.isBlank()) {
            password = System.getenv("MYSQLPASSWORD");
        }

        String driverClassName = "org.h2.Driver";

        if (dbUrl != null && (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://") || dbUrl.startsWith("jdbc:postgresql://"))) {
            driverClassName = "org.postgresql.Driver";
            if (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://")) {
                try {
                    String cleanUrl = dbUrl.replaceFirst("^postgres(ql)?://", "http://");
                    URI uri = new URI(cleanUrl);

                    String host = uri.getHost();
                    int port = uri.getPort() > 0 ? uri.getPort() : 5432;
                    String path = uri.getPath();

                    if (uri.getUserInfo() != null) {
                        String[] userInfo = uri.getUserInfo().split(":", 2);
                        username = userInfo[0];
                        if (userInfo.length > 1) {
                            password = userInfo[1];
                        }
                    }

                    dbUrl = "jdbc:postgresql://" + host + ":" + port + path + "?sslmode=require";
                    log.info("Configured PostgreSQL datasource for Render: host={}:{}, database={}", host, port, path);
                } catch (Exception e) {
                    log.error("Failed to parse PostgreSQL database URL: {}", dbUrl, e);
                }
            } else if (!dbUrl.contains("sslmode=")) {
                dbUrl += (dbUrl.contains("?") ? "&" : "?") + "sslmode=require";
            }
        } else if (dbUrl != null && dbUrl.startsWith("jdbc:mysql://")) {
            driverClassName = "com.mysql.cj.jdbc.Driver";
        } else {
            dbUrl = "jdbc:h2:mem:smartjobdb;DB_CLOSE_DELAY=-1;MODE=PostgreSQL";
            driverClassName = "org.h2.Driver";
            username = "sa";
            password = "";
            log.info("Using embedded H2 database fallback for application context");
        }

        log.info("Initializing DataSource with driver: {} and URL: {}", driverClassName, dbUrl);

        return DataSourceBuilder.create()
                .driverClassName(driverClassName)
                .url(dbUrl)
                .username(username)
                .password(password)
                .build();
    }
}
