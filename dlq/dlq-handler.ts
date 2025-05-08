export const handler =  async (event: { Records: any[]; }) => {
    event.Records.forEach((record) => {
      console.log('DLQ  SQS ', record);
    });
  };