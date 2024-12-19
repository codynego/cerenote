import { pipeline, PipelineType } from '@xenova/transformers';
import { MessageTypes } from './presets';

class MyTranscriptionPipeline {
    static task: string = 'automatic-speech-recognition';
    static model: string = 'openai/whisper-tiny.en';
    private static instance: any = null;

    static async getInstance(progress_callback: ((data: any) => void) | undefined): Promise<any> {
        if (this.instance === null) {
            this.instance = await pipeline(this.task as PipelineType, this.model, { progress_callback });
        }
        return this.instance;
    }
}

self.addEventListener('message', async (event: MessageEvent) => {
    const { type, audio } = event.data;
    if (type === MessageTypes.INFERENCE_REQUEST) {
        await transcribe(audio);
    }
});

async function transcribe(audio: any): Promise<void> {
    sendLoadingMessage('loading');

    let transcriptionPipeline;

    try {
        transcriptionPipeline = await MyTranscriptionPipeline.getInstance(loadModelCallback);
    } catch (err: any) {
        console.error(err.message);
    }

    sendLoadingMessage('success');

    const strideLengthS = 5;
    const generationTracker = new GenerationTracker(transcriptionPipeline, strideLengthS);

    await transcriptionPipeline(audio, {
        top_k: 0,
        do_sample: false,
        chunk_length: 30,
        stride_length_s: strideLengthS,
        return_timestamps: true,
        callback_function: generationTracker.callbackFunction.bind(generationTracker),
        chunk_callback: generationTracker.chunkCallback.bind(generationTracker),
    });

    generationTracker.sendFinalResult();
}

async function loadModelCallback(data: any): Promise<void> {
    const { status } = data;
    if (status === 'progress') {
        const { file, progress, loaded, total } = data;
        sendDownloadingMessage(file, progress, loaded, total);
    }
}

function sendLoadingMessage(status: string): void {
    self.postMessage({
        type: MessageTypes.LOADING,
        status,
    });
}

async function sendDownloadingMessage(file: string, progress: number, loaded: number, total: number): Promise<void> {
    self.postMessage({
        type: MessageTypes.DOWNLOADING,
        file,
        progress,
        loaded,
        total,
    });
}

class GenerationTracker {
    private pipeline: any;
    private strideLengthS: number;
    private chunks: any[] = [];
    private timePrecision: number;
    private processedChunks: any[] = [];
    private callbackFunctionCounter: number = 0;

    constructor(pipeline: any, strideLengthS: number) {
        this.pipeline = pipeline;
        this.strideLengthS = strideLengthS;
        this.timePrecision = pipeline?.processor.feature_extractor.config.chunk_length / pipeline.model.config.max_source_positions;
    }

    sendFinalResult(): void {
        self.postMessage({ type: MessageTypes.INFERENCE_DONE });
    }

    callbackFunction(beams: any[]): void {
        this.callbackFunctionCounter += 1;
        if (this.callbackFunctionCounter % 10 !== 0) {
            return;
        }

        const bestBeam = beams[0];
        const text = this.pipeline.tokenizer.decode(bestBeam.output_token_ids, {
            skip_special_tokens: true,
        });

        const result = {
            text,
            start: this.getLastChunkTimestamp(),
            end: undefined,
        };

        createPartialResultMessage(result);
    }

    chunkCallback(data: any): void {
        this.chunks.push(data);

        const [{ chunks }] = this.pipeline.tokenizer._decode_asr(this.chunks, {
            time_precision: this.timePrecision,
            return_timestamps: true,
            force_full_sequence: false,
        });

        this.processedChunks = chunks.map((chunk: any, index: number) => {
            return this.processChunk(chunk, index);
        });

        createResultMessage(this.processedChunks, false, this.getLastChunkTimestamp());
    }

    private getLastChunkTimestamp(): number {
        if (this.processedChunks.length === 0) {
            return 0;
        }
        return this.processedChunks[this.processedChunks.length - 1].end;
    }

    private processChunk(chunk: any, index: number): any {
        const { text, timestamp } = chunk;
        const [start, end] = timestamp;

        return {
            index,
            text: `${text.trim()}`,
            start: Math.round(start),
            end: Math.round(end) || Math.round(start + 0.9 * this.strideLengthS),
        };
    }
}

function createResultMessage(results: any[], isDone: boolean, completedUntilTimestamp: number): void {
    self.postMessage({
        type: MessageTypes.RESULT,
        results,
        isDone,
        completedUntilTimestamp,
    });
}

function createPartialResultMessage(result: any): void {
    self.postMessage({
        type: MessageTypes.RESULT_PARTIAL,
        result,
    });
}