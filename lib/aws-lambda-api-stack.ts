import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {aws_lambda} from "aws-cdk-lib";
import * as path from "node:path";
import {LambdaRestApi} from "aws-cdk-lib/aws-apigateway";

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwsLambdaApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'AwsLambdaApiQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    /*const lambda_multiply = new aws_lambda.Function(this,"LambdaHandler" , {
      runtime : aws_lambda.Runtime.NODEJS_20_X,
      code :  aws_lambda.Code.fromAsset(path.join(__dirname,'/../lambda')),
      handler : "lambda_handler_test.handler"
    });*/

    const lambda_multiply = new aws_lambda.Function(this,"LambdaHandler" , {
      runtime : aws_lambda.Runtime.JAVA_17,
      code :  aws_lambda.Code.fromAsset(path.join(__dirname,'/../app/target/app-0.0.1-SNAPSHOT-aws.jar')),
      handler : "org.springframework.cloud.function.adapter.aws.FunctionInvoker::handleRequest"

    });

    const api = new LambdaRestApi(this, 'LambdaApi', {
      handler: lambda_multiply,
      proxy: false,
    });

    const lambdaResource = api.root.addResource('lambda');
    lambdaResource.addMethod('GET');
  }
}
