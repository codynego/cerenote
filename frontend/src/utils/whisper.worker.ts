import { pipeline, Pipeline, Processor } from '@xenova/transformers';
import { MessageTypes } from './presets';

interface AudioData {
  type: string;
  audio: ArrayBuffer;
}

interface ProgressCallbackData {
  status: 'progress' | 'done';
  file?: string;
  progress?: number;
  loaded?: number;
  total?: number;
}

interface Chunk {
  text: string;
  timestamp: [number, number];
}

interface ResultMessage {
  type: string;
  results: any[];
  isDone: boolean;
  completedUntilTimestamp?: number;
}

interface PartialResultMessage {
  type: string;
  result: {
    text: string;
    start: number;
    end?: number;
  };
}

class MyTranscriptionPipeline {
  static task = 'automatic-speech-recognition';
  static model = 'openai/whisper-tiny.en';
  private static instance: Pipeline | null = null;

  static async getInstance(progressCallback?: (data: ProgressCallbackData) => void): Promise<Pipeline> {
    if (!this.instance) {
      try {
        // Attempt to load the model, with added error handling
        this.instance = await pipeline(this.task, this.model, { progress_callback: progressCallback });
      } catch (err) {
        console.error('Error initializing Whisper pipeline:', err);
        throw new Error('Pipeline initialization failed. Check the model URL or connection.');
      }
    }
    return this.instance;
  }
}

self.addEventListener('message', async (event: MessageEvent<AudioData>) => {
  const { type, audio } = event.data;
  if (type === MessageTypes.INFERENCE_REQUEST) {
    await transcribe(audio);
  }
});

async function transcribe(audio: ArrayBuffer): Promise<void> {
  sendLoadingMessage('loading');

  let pipelineInstance: Pipeline;

  try {
    pipelineInstance = await MyTranscriptionPipeline.getInstance(loadModelCallback);
  } catch (err) {
    console.error('Pipeline initialization error:', (err as Error).message);
    return;
  }

  sendLoadingMessage('success');

  const strideLengthSeconds = 5;
  const generationTracker = new GenerationTracker(pipelineInstance, strideLengthSeconds);

  try {
    await pipelineInstance(audio, {
      top_k: 0,
      do_sample: false,
      chunk_length: 30,
      stride_length_s: strideLengthSeconds,
      return_timestamps: true,
      callback_function: generationTracker.callbackFunction.bind(generationTracker),
      chunk_callback: generationTracker.chunkCallback.bind(generationTracker),
    });
  } catch (err) {
    console.error('Error during transcription:', err);
    return;
  }

  generationTracker.sendFinalResult();
}

async function loadModelCallback(data: ProgressCallbackData): Promise<void> {
  if (data.status === 'progress') {
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

function sendDownloadingMessage(
  file?: string,
  progress?: number,
  loaded?: number,
  total?: number
): void {
  self.postMessage({
    type: MessageTypes.DOWNLOADING,
    file,
    progress,
    loaded,
    total,
  });
}

class GenerationTracker {
  private pipeline: Pipeline;
  private strideLengthSeconds: number;
  private chunks: any[] = [];
  private processedChunks: any[] = [];
  private callbackCounter = 0;
  private timePrecision?: number;

  constructor(pipeline: Pipeline, strideLengthSeconds: number) {
    this.pipeline = pipeline;
    this.strideLengthSeconds = strideLengthSeconds;
    const featureExtractor = pipeline?.processor?.feature_extractor as Processor;
    this.timePrecision =
      featureExtractor?.config.chunk_length / (pipeline.model.config as any).max_source_positions;
  }

  sendFinalResult(): void {
    self.postMessage({ type: MessageTypes.INFERENCE_DONE });
  }

  callbackFunction(beams: any[]): void {
    this.callbackCounter += 1;
    if (this.callbackCounter % 10 !== 0) {
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
    const [text, { chunks }] = this.pipeline.tokenizer._decode_asr(this.chunks, {
      time_precision: this.timePrecision,
      return_timestamps: true,
      force_full_sequence: false,
    });

    this.processedChunks = chunks.map((chunk: Chunk, index: number) => this.processChunk(chunk, index));

    createResultMessage(this.processedChunks, false, this.getLastChunkTimestamp());
  }

  private getLastChunkTimestamp(): number {
    return this.processedChunks.length > 0
      ? this.processedChunks[this.processedChunks.length - 1]?.end || 0
      : 0;
  }

  private processChunk(chunk: Chunk, index: number): any {
    const { text, timestamp } = chunk;
    const [start, end] = timestamp;

    return {
      index,
      text: text.trim(),
      start: Math.round(start),
      end: Math.round(end) || Math.round(start + 0.9 * this.strideLengthSeconds),
    };
  }
}

function createResultMessage(
  results: any[],
  isDone: boolean,
  completedUntilTimestamp?: number
): void {
  const message: ResultMessage = {
    type: MessageTypes.RESULT,
    results,
    isDone,
    completedUntilTimestamp,
  };
  self.postMessage(message);
}

function createPartialResultMessage(result: { text: string; start: number; end?: number }): void {
  const message: PartialResultMessage = {
    type: MessageTypes.RESULT_PARTIAL,
    result,
  };
  self.postMessage(message);
}
