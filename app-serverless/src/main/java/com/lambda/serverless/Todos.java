package com.lambda.serverless;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class Todos {

    private Integer userId;
    private Integer id;
    private String title;
    private String body;

    public Todos(int i, int i1, String title1, String body1) {
           this.userId = i;
           this.id = i1;
           this.title = title1;
           this.body = body1;
    }
}
