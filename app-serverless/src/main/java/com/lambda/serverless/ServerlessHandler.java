package com.lambda.serverless;

import com.amazonaws.serverless.exceptions.ContainerInitializationException;
import com.amazonaws.serverless.proxy.model.AwsProxyRequest;
import com.amazonaws.serverless.proxy.model.AwsProxyResponse;
import com.amazonaws.serverless.proxy.spring.SpringBootLambdaContainerHandler;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import org.crac.Core;
import org.crac.Resource;

public class ServerlessHandler implements Resource,RequestHandler<AwsProxyRequest, AwsProxyResponse> {
        private static SpringBootLambdaContainerHandler<AwsProxyRequest, AwsProxyResponse> handler;

        static {
            try {
                handler = SpringBootLambdaContainerHandler.getAwsProxyHandler(Application.class); }

            catch (ContainerInitializationException ex){
                throw new RuntimeException("Spring Boot Application error : ",ex); }
        }

        @Override
        public AwsProxyResponse handleRequest(AwsProxyRequest input, Context context) {
            return handler.proxy(input, context);
        }

    @Override
    public void beforeCheckpoint(org.crac.Context<? extends Resource> context) throws Exception {
        System.out.println("I am inside before checkpoint");
    }

    @Override
    public void afterRestore(org.crac.Context<? extends Resource> context) throws Exception {
       System.out.println("I am in after Restore");
    }

    public ServerlessHandler(){
        Core.getGlobalContext().register(this);
    }
}
