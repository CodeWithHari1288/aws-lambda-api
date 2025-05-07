
interface Albums {
    userId: string;
    id: string;
    title: string
}

let resp : Albums[] = [];


const testing = async ()=>{
    const res = await fetch("https://jsonplaceholder.typicode.com/albums");
console.log("111" );
    resp = await res.json();
    console.log("111" +resp );

}

testing();
