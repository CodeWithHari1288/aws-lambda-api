exports.handler = async (event: any) => {
    try {
      console.log("Eventbridge :" +  JSON.stringify(event));
  
      return true;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };