import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import path = require('path');
import { Architecture } from 'aws-cdk-lib/aws-lambda';


export class SecretsStack extends cdk.Stack {
    private minCapacity: any;
    private maxCapacity: any;
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
      super(scope, id, props);
  

    
const secr = new cdk.aws_secretsmanager.Secret(this, 'Secret', {
  secretObjectValue: {
    username: cdk.SecretValue.unsafePlainText("Hari Krishna"),
  },
})


const myLambdaRole = new iam.Role(this, 'secretsLambdaRole', {
  roleName: 'my-lambda-role',
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
})

myLambdaRole.addToPolicy(
  new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: ['ssm:GetParameter', 'secretsmanager:GetSecretValue', 'kms:Decrypt'],
    resources: ['*'],
  }),
)

const myLambda = new cdk.aws_lambda.Function(this, 'secretshandler', {
    runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
    code: cdk.aws_lambda.Code.fromAsset(path.join(__dirname, '/../secrets')),
    handler: 'secrets-handler.handler',
    role: myLambdaRole,
    environment: {
        SECRET_NAME: "username",
    },
    architecture: Architecture.ARM_64
  });
  
  
  const parametersAndSecretsExtension = cdk.aws_lambda.LayerVersion.fromLayerVersionArn(
    this,
    'ParametersAndSecretsLambdaExtension',
    'arn:aws:lambda:us-east-1:177933569100:layer:AWS-Parameters-and-Secrets-Lambda-Extension-Arm64:17',
  )
  
  myLambda.addLayers(parametersAndSecretsExtension);

}

}