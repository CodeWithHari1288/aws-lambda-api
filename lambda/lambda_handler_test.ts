export const handler = async () => {

      let  a = 2;
      let  b = 3;
      return {
            statusCode: 200,
            body: "Hello from Lambda a multiplied b is :" + a*b
      } ;

}
