exports.handler = async (event: { Records: any[]; }) => {
    event.Records.forEach((record) => {
      console.log('Dummy SQS ', record);
    });
  };