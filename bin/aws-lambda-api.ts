#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AwsLambdaApiStack } from '../lib/aws-lambda-api-stack';
import { DLQ } from '../lib/dlq-stack';

const app = new cdk.App();
new AwsLambdaApiStack(app, 'AwsLambdaApiStack', {
   env: {  account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1'
},
});



new DLQ(app, 'Dlq' , {
  env: {  account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1'
},
})