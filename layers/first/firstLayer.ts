   
   
// interface Albums {
//   userId: string;
//   id: string;
//   title: string
// }

import Albums from "../../interfaces/Albums";

export const firstLayer = async () => {
 

    let resp: Albums[] = [];
   console.log("response " );   

    const res = await fetch("https://jsonplaceholder.typicode.com/albums");

    resp = await res.json();
    console.log("response " +resp );   
   
return resp;

}