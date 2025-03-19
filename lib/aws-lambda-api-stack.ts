import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {aws_ec2, aws_lambda} from "aws-cdk-lib";
import * as path from "node:path";
import {LambdaRestApi} from "aws-cdk-lib/aws-apigateway";
import {Vpc} from "aws-cdk-lib/aws-ec2";
import {Alias} from "aws-cdk-lib/aws-lambda";
import {ScalableTarget, ServiceNamespace} from "aws-cdk-lib/aws-applicationautoscaling";

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
      allowPublicSubnet: true,
      // snapStart
      // layers:
      // reservedConcurrentExecutions
    });

    const lambda_multiply_java = new aws_lambda.Function(this,"JavaLambdaHandler" , {
      runtime : aws_lambda.Runtime.JAVA_17,
      code :  aws_lambda.Code.fromAsset(path.join(__dirname,'/../app/target/app-0.0.1-SNAPSHOT-aws.jar')),
      handler : "org.springframework.cloud.function.adapter.aws.FunctionInvoker::handleRequest"

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
  }
}
