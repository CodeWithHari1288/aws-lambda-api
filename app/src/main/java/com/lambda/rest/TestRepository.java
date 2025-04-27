package com.lambda.rest;

import com.lambda.objects.Posts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Repository
public class TestRepository {

    
    @GetMapping
    public ResponseEntity getMethod(){

         return new ResponseEntity<>("Returning Value from REST Get",HttpStatus.ACCEPTED);

    }
}
