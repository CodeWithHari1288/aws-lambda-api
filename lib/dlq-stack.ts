import { Stack, App, StackProps, Duration, aws_lambda, CfnOutput } from "aws-cdk-lib";
import { Runtime, Code } from "aws-cdk-lib/aws-lambda";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";
import path = require("path");

export class DLQ extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
      super(scope, id, props);
  
    const deadLetterQueue = new Queue(this, "eventSeqDLQ", {
      queueName: "dlq.fifo",
      deliveryDelay: Duration.millis(0),
      contentBasedDeduplication: true,
      retentionPeriod: Duration.days(14),
      fifo: true
    });

    const fifoQueue = new Queue(this, "eventSeqFifoQ", {
      queueName: "mailbox.fifo",
      deliveryDelay: Duration.millis(0),
      contentBasedDeduplication: true,
      fifo: true,
      visibilityTimeout: Duration.seconds(30),
      deadLetterQueue: {
        maxReceiveCount: 1,
        queue: deadLetterQueue
      }
    });

    const sender = new aws_lambda.Function(this, "senderFn", {
      runtime: Runtime.NODEJS_20_X,
      code: Code.fromAsset(path.join(__dirname,'/../dlq')),
      handler: "fifo-handler.handler",
      timeout: Duration.seconds(6),
      memorySize: 256,
      environment: {
        FIFO_QUEUE_URL: fifoQueue.queueUrl
      }
    });

    new CfnOutput(this, 'FIFO_QUEUE_URL', { value: fifoQueue.queueUrl});

    fifoQueue.grantSendMessages(sender);

    const processor = new aws_lambda.Function(this, "processorFn", {
      runtime: Runtime.NODEJS_20_X,
      code: aws_lambda.Code.fromAsset(path.join(__dirname,'/../dlq')),
      handler: "dlq-handler.handler",
      timeout: Duration.seconds(6),
      memorySize: 256,
      environment: {
        DLQ_QUEUE_URL: deadLetterQueue.queueUrl
      }
    });

    new CfnOutput(this, 'DEAD_QUEUE_URL', { value: deadLetterQueue.queueUrl});

    fifoQueue.grantConsumeMessages(processor);
    deadLetterQueue.grantSendMessages(processor);

    processor.addEventSource(
      new SqsEventSource(fifoQueue, {
        batchSize: 10
      })
    );
  }
}