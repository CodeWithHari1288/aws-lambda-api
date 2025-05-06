export const firstLayer: any = async () => {
    
    await fetch("https://jsonplaceholder.typicode.com/albums")
    .then(data=>console.log("DATA.......... "+ JSON.stringify(data)))
    .catch(e=>console.log("Error : " + e));

  };