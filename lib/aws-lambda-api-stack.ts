import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {aws_ec2, aws_lambda, RemovalPolicy} from "aws-cdk-lib";
import * as path from "node:path";
import {LambdaRestApi} from "aws-cdk-lib/aws-apigateway";
import {Vpc} from "aws-cdk-lib/aws-ec2";
import {Alias, Architecture, Code, Runtime, SnapStartConf} from "aws-cdk-lib/aws-lambda";
import {ScalableTarget, ServiceNamespace} from "aws-cdk-lib/aws-applicationautoscaling";
import { BlockPublicAccess, Bucket, EventType } from 'aws-cdk-lib/aws-s3';
import { Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { S3EventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwsLambdaApiStack extends cdk.Stack {
  private minCapacity: any;
  private maxCapacity: any;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'AwsLambdaApiQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    const vpc =  aws_ec2.Vpc.fromLookup(this, "VPC", {
      isDefault: true
    });

    /*const alias = new Alias(this, "AliasProvisioned" , {
      aliasName: "",
      version:  ,
      provisionedConcurrentExecutions :10
    })
    // Application Auto Scaler
    const autoscaler = new ScalableTarget(this, 'AutoScaler', {
      serviceNamespace: ServiceNamespace.LAMBDA,
      this.minCapacity,
      this.maxCapacity,
      resourceId: `function:${handler.lambda.functionName}:${alias.aliasName}`,
      scalableDimension: 'lambda:function:ProvisionedConcurrency'
    })
    autoscaler.node.addDependency(alias)*/


    const lambda_multiply_typescript = new aws_lambda.Function(this,"TypescriptLambdaHandler" , {
      runtime : aws_lambda.Runtime.NODEJS_20_X,
      code :  aws_lambda.Code.fromAsset(path.join(__dirname,'/../lambda')),
      handler : "lambda_handler_test.handler",
      vpc: vpc,
      allowPublicSubnet: true
    }
  );

    const lambda_multiply_java = new aws_lambda.Function(this,"JavaLambdaHandler" , {
      runtime : aws_lambda.Runtime.JAVA_17,
      code :  aws_lambda.Code.fromAsset(path.join(__dirname,'/../app/target/app-0.0.1-SNAPSHOT-aws.jar')),
      handler : "org.springframework.cloud.function.adapter.aws.FunctionInvoker::handleRequest",
      environment : {
              "MAIN_CLASS" : "com.lambda.function.Application"
      },
      // reservedConcurrentExecutions : 11,
      // snapStart : SnapStartConf.ON_PUBLISHED_VERSIONS,
      architecture : Architecture.X86_64
    });

    //UnreservedConcurrentExecution below its minimum value of [10]. So you cannot test this 
    // const aliasOptions = {
    //   aliasName: 'ConAlias',
    //   version: lambda_multiply_java.currentVersion,
    //   provisionedConcurrentExecutions: 2 //there will always be at least two Lambda functions running
    // };
    
    // new aws_lambda.Alias(this, 'ConLambdaAlias', aliasOptions);


     const lambda_serverless = new aws_lambda.Function(this,"JavaLambdaServerlessHandler" , {
           runtime : aws_lambda.Runtime.JAVA_17,
           code :  aws_lambda.Code.fromAsset(path.join(__dirname,'/../app-serverless/target/app-serverless-1.0.0-SNAPSHOT.jar')),
           handler : "com.lambda.serverless.ServerlessHandler::handleRequest",
           environment : {
            "MAIN_CLASS" : "com.lambda.serverless.Application"
           }
         });

    const api_typescript = new LambdaRestApi(this, 'TypescriptLambda', {
      handler: lambda_multiply_typescript,
      proxy: false,
    });


    const typescriptResource = api_typescript.root.addResource('lambda');
    typescriptResource.addMethod('GET');

    const api_java = new LambdaRestApi(this, 'JavaLambda', {
      handler: lambda_multiply_java,
      proxy: false,
    });

    const javaResource = api_java.root.addResource('lambda');
    javaResource.addMethod('GET');

    const api_java_serverless = new LambdaRestApi(this, 'JavaLambdaServerless', {
      handler: lambda_serverless,
      proxy: false

    });

  const javaServerlessResource = api_java_serverless.root.addResource('test');
  javaServerlessResource.addMethod('GET');
    
    // Lambda Function to read from Stream
    const lambdaReadStream = new aws_lambda.Function(this,"S3LambdaHandler" , {
      runtime : aws_lambda.Runtime.NODEJS_20_X,
      code :  aws_lambda.Code.fromAsset(path.join(__dirname,'/../s3')),
      handler : "lambda_handler_s3.handler",
      vpc: vpc,
      allowPublicSubnet: true,

    }
  );


      //Change this if desired
      const BUCKET_NAME = 's3-bucket-dummy'

      // S3 bucket
      const bucket = new Bucket(this, BUCKET_NAME, {
       
        autoDeleteObjects: true,
        removalPolicy: RemovalPolicy.DESTROY
      });
   
    // Event Source Mapping S3 -> Lambda
    const s3PutEventSource = new S3EventSource(bucket, {
      events: [
        EventType.OBJECT_CREATED_PUT
      ]
    });

    lambdaReadStream.addEventSource(s3PutEventSource);  


    
    const dynamoDBTable = new Table(this, "DummyDynamoDB", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING
      },
    });


  }

}
