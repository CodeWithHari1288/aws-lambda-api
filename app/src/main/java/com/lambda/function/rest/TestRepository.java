package com.lambda.function.rest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@RestController
public class TestRepository {

   
    
   /* @GetMapping
    public ResponseEntity getMethod(){


         return new ResponseEntity<>("Returning Value from REST Get",HttpStatus.ACCEPTED);

    }*/


    @GetMapping
    public ResponseEntity getMethod(){
        System.out.println("REST CLIENT");

        RestClient client = RestClient.create();
System.out.println("REST CLIENT");

System.out.println("RESPONSE : "+client.get()
        .uri("https://jsonplaceholder.typicode.com/todos")
        .retrieve()
        .body(Todo[].class).toString());
        return  new ResponseEntity<>(client.get()
                .uri("https://jsonplaceholder.typicode.com/todos")
                .retrieve()
                .body(Todo[].class), HttpStatus.ACCEPTED);

  /*      HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://jsonplaceholder.typicode.com/todos"))
                .GET().build();
        HttpResponse<String> resp = null;
        try{
            resp = client.send(request,HttpResponse.BodyHandlers.ofString());
            System.out.println("Test " +resp);
        }
        catch(Exception e){
            System.out.println("Error : " +e);
        }

        return (ResponseEntity) resp;
*/
    }

}
