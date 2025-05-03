package com.lambda.function;

import com.lambda.function.rest.TestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.function.Function;

@SpringBootApplication
class Application {

    @Autowired
    private TestRepository repository;

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Bean
    public Function<String,String> uppercase() {
        return value->repository.getMethod().getBody().toString();
    }
}