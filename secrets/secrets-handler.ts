
export const handler = async ()=>{

    console.log("Inside secrets Manager");
    const result = await fetch(
        `http://localhost:2773/secretsmanager/get?secretId=${process.env.SECRET_NAME}`,
        {
            headers: {
                "X-Aws-Parameters-Secrets-Token": process.env
                    .AWS_SESSION_TOKEN as string,
            },
        },
    )
    .then((response) => console.log(response.json()));

  


}

