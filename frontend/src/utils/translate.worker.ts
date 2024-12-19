import { pipeline, PipelineType } from '@xenova/transformers';

class MyTranslationPipeline {
    static task: PipelineType = 'translation';
    static model: string = 'Xenova/nllb-200-distilled-600M';
    static instance: any = null;

    static async getInstance(progress_callback: Function | undefined = undefined): Promise<any> {
        if (this.instance === null) {
            this.instance = await pipeline(this.task, this.model, { progress_callback });
        }
        return this.instance;
    }
}

self.addEventListener('message', async (event: MessageEvent) => {
    const translator = await MyTranslationPipeline.getInstance((x: any) => {
        self.postMessage(x);
    });

    console.log(event.data);

    const output = await translator(event.data.text, {
        tgt_lang: event.data.tgt_lang,
        src_lang: event.data.src_lang,
        callback_function: (x: any) => {
            self.postMessage({
                status: 'update',
                output: translator.tokenizer.decode(x[0].output_token_ids, { skip_special_tokens: true })
            });
        }
    });

    console.log('HEHEHHERERE', output);

    self.postMessage({
        status: 'complete',
        output
    });
});