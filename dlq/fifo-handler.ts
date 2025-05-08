import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

export const handler = async ()=>{
    console.log("Processing in fifo-handler");

    const messageBody = {
        message: "Hello from Lambda!",
        timestamp: new Date().toISOString(),
      };

    
      const params = {
        QueueUrl: "https://sqs.us-east-1.amazonaws.com/253490753676/first.fifo",
        MessageBody: JSON.stringify(messageBody),
        MessageGroupId: "TEST",
        MessageDeduplicationId: Date.now().toString()
      };
      try {
        const client = new SQSClient({region: "us-east-1"});

        const command = new SendMessageCommand(params);

         
         await client
            .send(command)
            .then((data) => {
                console.log("Response returned ..... "+data);
            })
            .catch((error) => {
                console.log("Response returned ..... "+error);
            })
            .finally(() => {
                console.log("Response returned ..... ");
            });


        console.log("Message sent to SQS:");
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