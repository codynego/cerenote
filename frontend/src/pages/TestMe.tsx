import { pipeline } from '@xenova/transformers';
import { useState, useEffect } from 'react';

export const TestMe = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/jfk.wav';

    const trans = async () => {
        try {
            setLoading(true);
            // Fetch the audio file
            const audioBlob = await fetch(url).then(res => res.blob());
            // Initialize the speech recognition model
            const transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');
            console.log(transcriber)
            // Transcribe the audio file
            const output = await transcriber(audioBlob);
            console.log(output)
            setData(output);
        } catch (error) {
            console.error('Error during transcription:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        trans();  // Automatically run the transcription when the component mounts
    }, []);

    return (
        <div>
            {loading ? <p>Loading...</p> : <p>{data ? data.text : 'No transcription available'}</p>}
        </div>
    );
};
