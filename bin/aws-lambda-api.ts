#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AwsLambdaApiStack } from '../lib/aws-lambda-api-stack';
import { DLQ } from '../lib/dlq-stack';
import { Streaming } from '../lib/streaming-stack';
import { EventBridgeStack } from '../lib/eventbridge-stack';

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


new Streaming(app, 'Streaming' , {
  env: {  account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1'
},
})


new EventBridgeStack(app, 'EventBridge' , {
  env: {  account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1'
},
})