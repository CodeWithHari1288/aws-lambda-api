import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

export const handler = async () => {

   const client = new DynamoDBClient({});
   const docClient = DynamoDBDocumentClient.from(client);

   const command = new PutCommand({
    TableName: "DummyDynamoDB",
    Item: {
      s3inserted: "S3 Bucket Inserted/Updated",
    },
  });


}
