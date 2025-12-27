package com.idcell.backend.config;

import io.r2dbc.spi.ConnectionFactories;
import io.r2dbc.spi.ConnectionFactory;
import io.r2dbc.pool.ConnectionPool;
import io.r2dbc.pool.ConnectionPoolConfiguration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.ReactiveTransactionManager;
import org.springframework.transaction.reactive.TransactionalOperator;

import java.time.Duration;

@Configuration
public class DataBaseConfig {

    @Value("${spring.r2dbc.url}")
    private String URL_DB;

    @Bean
    public ConnectionFactory connectionFactory(){

        ConnectionFactory baseFactory = ConnectionFactories.get(URL_DB);

        ConnectionPoolConfiguration poolConfig = ConnectionPoolConfiguration.builder(baseFactory)
                .maxSize(20)
                .initialSize(2)
                .maxIdleTime(Duration.ofMinutes(10))
                .maxLifeTime(Duration.ofMinutes(30))
                .validationQuery("SELECT 1")
                .acquireRetry(3)
                .build();


        return new ConnectionPool(poolConfig);
    }
    @Bean
    public TransactionalOperator transactionalOperator(ReactiveTransactionManager transactionManager){
        return TransactionalOperator.create(transactionManager);
    }

}
