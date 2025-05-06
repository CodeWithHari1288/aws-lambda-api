export const handler  = async (event: { Records: any[]; }) => {
    event.Records.forEach((record) => {
      console.log('Dummy SNS ', record);
    });
  };