package com.lambda.serverless;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;

@Service
public class ToDoService {


    protected ArrayList<Todos> getAllTodos(){

        Todos todo = new Todos(1,111,"title1","body1");
        Todos todo1 = new Todos(1,111,"title2","body2");
        Todos todo2 = new Todos(1,111,"title3","body3");
        Todos todo3 = new Todos(1,111,"title4","body4");
        Todos todo4 = new Todos(1,111,"title5","body5");

        ArrayList<Todos> t = new ArrayList<Todos>();
                t.add(todo);
        t.add(todo1);
        t.add(todo2);
        t.add(todo3);
        t.add(todo4);

        return t;
    }
}
