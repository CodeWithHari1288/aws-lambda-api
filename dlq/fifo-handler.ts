import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

export const handler = async ()=>{
    console.log("Processing in fifo-handler");

    const messageBody = {
        message: "Hello from Lambda!",
        timestamp: new Date().toISOString(),
      };
    
      const params = {
        QueueUrl: process.env.FIFO_QUEUE_URL,
        MessageBody: JSON.stringify(messageBody),
        MessageGroupId: "TEST",
        MessageDeduplicationId: Date.now().toString()
      };
      try {
        const command = new SendMessageCommand(params);
        const client = new SQSClient({});

        const result = await client.send(command);
        console.log("Message sent to SQS:", result);
        return {
          statusCode: 200,
          body: JSON.stringify({ message: "Message sent successfully!" }),
        };
      } catch (error) {
        console.error("Error sending message to SQS:", error);
        return {
          statusCode: 500,
          body: JSON.stringify({ message: "Failed to send message." }),
        };
      }
    
}