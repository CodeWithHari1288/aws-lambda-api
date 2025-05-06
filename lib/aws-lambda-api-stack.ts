import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {aws_ec2, aws_lambda, RemovalPolicy} from "aws-cdk-lib";
import * as path from "node:path";
import {LambdaRestApi} from "aws-cdk-lib/aws-apigateway";
import {Subnet, SubnetType, Vpc} from "aws-cdk-lib/aws-ec2";
import {Alias, Architecture, Code, Runtime, SnapStartConf} from "aws-cdk-lib/aws-lambda";
import {ScalableTarget, ServiceNamespace} from "aws-cdk-lib/aws-applicationautoscaling";
import { BlockPublicAccess, Bucket, EventType } from 'aws-cdk-lib/aws-s3';
import { Effect, Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { S3EventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { SubnetGroup } from 'aws-cdk-lib/aws-rds';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';

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

    const firstLr = new aws_lambda.LayerVersion(this,"firstLayer",{
      layerVersionName: "restSrvc",
      code : aws_lambda.Code.fromAsset(path.join(__dirname,'/../layers/first')),
      description : "Rest end point with JSON response",
      compatibleRuntimes : [aws_lambda.Runtime.NODEJS_20_X],
      removalPolicy: RemovalPolicy.DESTROY
    });

    const nodeJsFnProps: NodejsFunctionProps = {
      runtime: Runtime.NODEJS_20_X,
      timeout: cdk.Duration.minutes(3),
      memorySize: 256,
    };

    const lambdaWithLayer = new NodejsFunction(this, 'typescriptLambdaWithLayer', {
      entry: path.join(__dirname, '../lambda', 'lambda_handler_test.ts'),
      ...nodeJsFnProps,
      functionName: 'lambdaWithRestServiceAsLayer',
      handler: 'handler',
      layers: [firstLr]
    });


    const lambda_multiply_typescript = new aws_lambda.Function(this,"TypescriptLambdaHandler" , {
      runtime : aws_lambda.Runtime.NODEJS_20_X,
      code :  aws_lambda.Code.fromAsset(path.join(__dirname,'/../lambda')),
      handler : "lambda_handler_test.handler",
      vpc: vpc,
      allowPublicSubnet: true,
    }
  );

 const myVpc =  Vpc.fromLookup(this,"defaultVpc", {
    isDefault: true
  })
    const lambda_multiply_java = new aws_lambda.Function(this,"JavaLambdaHandler" , {
      runtime : aws_lambda.Runtime.JAVA_17,
      code :  aws_lambda.Code.fromAsset(path.join(__dirname,'/../app/target/app-0.0.1-SNAPSHOT-aws.jar')),
      handler : "org.springframework.cloud.function.adapter.aws.FunctionInvoker::handleRequest",
      environment : {
              "MAIN_CLASS" : "com.lambda.function.Application"
      },
      // reservedConcurrentExecutions : 11,
      // snapStart : SnapStartConf.ON_PUBLISHED_VERSIONS,
      architecture : Architecture.X86_64,
      // vpc: myVpc,
      // vpcSubnets :{subnetType : SubnetType.PRIVATE_WITH_EGRESS}
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
  const javaServerlessResourceAlbums = api_java_serverless.root.addResource('albums');
  javaServerlessResourceAlbums.addMethod('GET');
    
    // Lambda Function to read from Stream
    const lambdaS3= new aws_lambda.Function(this,"S3LambdaHandler" , {
      runtime : aws_lambda.Runtime.NODEJS_20_X,
      code :  aws_lambda.Code.fromAsset(path.join(__dirname,'/../s3')),
      handler : "lambda_handler_s3.handler",
      allowPublicSubnet: true,
      timeout : cdk.Duration.seconds(10)
    }
  );


      //Change this if desired
      const BUCKET_NAME = 's3-bucket-dummy'

      // S3 bucket
      const bucket = new Bucket(this, BUCKET_NAME, {
        bucketName: "test"+Math.random().toString(12),
        autoDeleteObjects: true,
        removalPolicy: RemovalPolicy.DESTROY
      });
    
    // Event Source Mapping S3 -> Lambda
    const s3PutEventSource = new S3EventSource(bucket, {
      events: [
        EventType.OBJECT_CREATED_PUT
      ]
    });
 
    lambdaS3.addEventSource(s3PutEventSource);  


    
    const dynamoDBTable = new Table(this, "DummyDynamoDB", {
      tableName: "DummyTable",
      partitionKey: {
        name: "id",
        type: AttributeType.STRING
      }
    });

    lambdaS3.addToRolePolicy(
           new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['dynamodb:PutItem'],
            resources: [
              dynamoDBTable.tableArn,
              ],
            }),
         );


         //SQS
         const queue = new Queue(this, 'DummyQueue', {
          queueName: 'DummyQueue',
        });

        const lambdaSqs = new aws_lambda.Function(this, 'sqslambda', {
          code: aws_lambda.Code.fromAsset(path.join(__dirname,'/../sqs')),
          handler: 'lambda_handler_sqs.handler',
          runtime: Runtime.NODEJS_20_X,
        });

        const eventSourceSqs = new cdk.aws_lambda_event_sources.SqsEventSource(queue);

        lambdaSqs.addEventSource(eventSourceSqs);


        //SNS
        const topic = new Topic(this, 'OurSnsTopic', {
          displayName: 'Our SNS Topic',
        });
    
        const lambdaFunction = new aws_lambda.Function(this, 'snsLambda', {
          code: aws_lambda.Code.fromAsset(path.join(__dirname,'/../sns')),
          handler: 'lambda_handler_sns.handler',
          runtime: aws_lambda.Runtime.NODEJS_20_X,
        });
    
        const eventSourceSns = new cdk.aws_lambda_event_sources.SnsEventSource(topic);
    
        lambdaFunction.addEventSource(eventSourceSns);


  }

}
