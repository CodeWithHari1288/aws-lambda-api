package com.lambda.serverless;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


@RestController
@EnableWebMvc
public class RestControllerDummy {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ToDoService handler;

    @GetMapping("/test")
    public ResponseEntity<ArrayList> getDummy(){

        System.out.println("Inside Rest Endpoint");
        return new ResponseEntity<ArrayList>(handler.getAllTodos(),HttpStatus.ACCEPTED);
    }

    @GetMapping("/albums")
    public ResponseEntity<Albums[]> getUsers(){

        RestClient client = RestClient.create();

        System.out.println("Inside Albums Rest Endpoint");
        return  new ResponseEntity<>(client.get()
                .uri("https://jsonplaceholder.typicode.com/albums")
                .retrieve()
                .body(Albums[].class), HttpStatus.ACCEPTED);


    }
}
