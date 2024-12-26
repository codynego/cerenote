// npm i @xenova/transformers
import { pipeline } from '@xenova/transformers';

let url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/jfk.wav';

// Create translation pipeline
let transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');
let output = await transcriber(url, { return_timestamps: true });

console.log(output)
