import { ResponseStream, streamifyResponse } from 'lambda-stream';
import { Readable } from 'stream';

interface Event {
    data: string;
}

const myHandler = async (event: Event, responseStream: ResponseStream): Promise<void> => {
    
    console.log("event 0000 " + event);
    console.log("event 0000 " + JSON.stringify(event));

    responseStream.setContentType('text/plain');

    const dataStream = Readable.from(event.data.split(' '));

    for await (const chunk of dataStream) {
        responseStream.write(`${chunk}\n`);
    }

    responseStream.end();
};

export const handler = streamifyResponse(myHandler);
