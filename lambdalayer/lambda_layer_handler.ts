import Albums from "../interfaces/Albums";
import * as layer1 from "/opt/first";

export const handler = async () => {

   
      
    let resp : Albums[] = [];
    resp =  await layer1.firstLayer();

      return {
        "statusCode" : 200,
        "body" : JSON.stringify(resp)
      }
}
