import { Stack, StackProps, aws_lambda } from "aws-cdk-lib";
import { FunctionUrlAuthType, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as cdk from 'aws-cdk-lib';
import path = require("path");


export class Streaming extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
      super(scope, id, props);


    //   const lambda_streaming = new aws_lambda.Function(this,"streaminglambdahandler" , {
    //         runtime : aws_lambda.Runtime.NODEJS_20_X,
    //         code :  aws_lambda.Code.fromAsset(path.join(__dirname,'/../streamify')),
    //         handler : "streaming.handler",
    //         allowPublicSubnet: true,
    //       }
    //     );

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