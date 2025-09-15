import { supabase } from './supabase';

export class OpenAI {
    /**
     * Summarize a set of comments using OpenAI's GPT-3.5 API
     * @param comments the comments to summarize
     * @param header the question being asked
     */
    static async getOpenAIResponse(
        comments: string,
        header: string,
    ): Promise<string> {
        const { data, error } = await supabase.functions.invoke(
            'generate-scout-summary',
            {
                body: { header: header, comments: comments },
            },
        );
        if (error) {
            console.error('Error fetching data from OpenAI', error);
            return 'Error fetching data from OpenAI';
        } else {
            return data.choices[0].message.content;
        }
    }
}
