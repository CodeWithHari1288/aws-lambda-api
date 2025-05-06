import * as layer1 from "/opt/first";

export const handler = async () => {

      let  a = 2;
      let  b = 3;
      
     console.log("Layer 1 response : " + await layer1.firstLayer());

      return {
            statusCode: 200,
            body: "Hello from Lambda a multiplied b is :" + a*b
      } ;

}
