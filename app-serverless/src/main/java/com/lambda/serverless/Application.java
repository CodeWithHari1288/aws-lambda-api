package com.lambda.serverless;



import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
@Import(RestControllerDummy.class)
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class);

    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
