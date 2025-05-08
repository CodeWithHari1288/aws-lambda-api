import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import path = require("path");




export class EventBridgeStack extends cdk.Stack {
    private minCapacity: any;
    private maxCapacity: any;
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
      super(scope, id, props);
  

const lambdaRole = new iam.Role(
  this,
  `eventbridge-lambda-execution-role`,
  {
    assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    roleName: "eventbridge-lambda-execution-role",
    description: "Lambda function execution role that allows the function to write to CloudWatch",
    managedPolicies: [
      iam.ManagedPolicy.fromManagedPolicyArn(
        this,
        "cloudwatch-full-access",
        "arn:aws:iam::aws:policy/CloudWatchFullAccess"
      ),
    ],
  }
);

const lambdaHandler = new lambda.Function(
  this,
  "eventbridge-lambda",
  {
    runtime: lambda.Runtime.NODEJS_18_X,
    code: cdk.aws_lambda.Code.fromAsset(path.join(__dirname,'/../eventbridge/')),
    handler: "eventbridge-handler.handler",
    functionName: "eventbridge-lambda-function",
    role: lambdaRole,
  }
);




// UTC & 24hr syntax
const CRON_EXPRESSION = {
  minute: "0",
  hour: "9",
};

const eventBridgeRule = new Rule(
  this,
  `eventbridge-rule`,
  {
    ruleName: `Eventbridge-rule`,
    schedule: Schedule.cron({
        minute : "1"
    }),
    targets: [
      new cdk.aws_events_targets.LambdaFunction(lambdaHandler, {
        retryAttempts: 2, // Max number of retries for Lambda invocation
      }),
    ],
  }
);

cdk.aws_events_targets.addLambdaPermission(eventBridgeRule, lambdaHandler);

}
}