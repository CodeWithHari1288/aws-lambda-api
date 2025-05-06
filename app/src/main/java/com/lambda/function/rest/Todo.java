package com.lambda.function.rest;

import lombok.Data;

@Data
public class Todo {

    private String userId;
    private String id;
    private String title;
    private String completed;


}
