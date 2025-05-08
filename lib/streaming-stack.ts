import { Stack, StackProps, aws_lambda } from "aws-cdk-lib";
import { FunctionUrlAuthType, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as cdk from 'aws-cdk-lib';
import path = require("path");


export class Streaming extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
      super(scope, id, props);



        const nodeJsFnProps: NodejsFunctionProps = {
              runtime: Runtime.NODEJS_20_X,
              timeout: cdk.Duration.minutes(3),
              memorySize: 128,
            };
        
         const streamingLamdba = new NodejsFunction(this, 'streamingwithLambda', {
              entry: path.join(__dirname, '../streamify', 'streaming.ts'),
              ...nodeJsFnProps,
              functionName: 'streaminglambda',
              handler: 'handler',
              bundling: {
                nodeModules: ["lambda-stream"]
              }
            });

          
         //Implement APIGateway here

  }
}