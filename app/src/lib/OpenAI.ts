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
    try {
      const result = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                'The following data is a collection of scouting comments from a FIRST robotics match.',
            },
            {
              role: 'system',
              content:
                'You will summarize the comments in a concise manner, without add any filler text',
            },
            {
              role: 'user',
              content: 'The question that was asked was: ' + header,
            },
            {
              role: 'user',
              content: 'Here is the data: ' + comments,
            },
          ],
        }),
      });

      const data = await result.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error fetching data from OpenAI', error);
      return 'Error fetching data from OpenAI';
    }
  }
}
