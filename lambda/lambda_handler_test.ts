import Albums from "../interfaces/Albums";
import * as layer1 from "/opt/first";

// interface Albums {
//       userId: string;
//       id: string;
//       title: string
//     }
  
  

export const handler = async () => {

      let  a = 2;
      let  b = 3;
      
    

      return {
            statusCode: 200,
            body: "Returning addition of two number : " + a+b
      } ;

}
