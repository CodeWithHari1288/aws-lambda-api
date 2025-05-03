package com.lambda.function.rest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.GetMapping;

@Repository
public class TestRepository {

   
    
    @GetMapping
    public ResponseEntity getMethod(){


         return new ResponseEntity<>("Returning Value from REST Get",HttpStatus.ACCEPTED);

    }
}
