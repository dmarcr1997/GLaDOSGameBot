const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const generateAction = async (prompt, brainstorm) => {
  // Run first prompt
  console.log(`API: ${prompt}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-002',
    prompt: `${basePromptPrefix}${req.body.userInput}/n`,
    temperature: 0.85,
    max_tokens: 450,
  });

  const basePromptOutput = baseCompletion.data.choices.pop();

  const secondPrompt =
    `
    Take the generated idea below and refine it 
    Original text: ${prompt}
    Generated Ideas: ${basePromptOutput.text}
    Refined Text:
    `
  const secondPromptCompletion = await openai.createCompletion({
    model: 'text-davinci-002',
    prompt: `${secondPrompt}`,
    // I set a higher temperature for this one. Up to you!
    temperature: 0.9,
    // I also increase max_tokens.
    max_tokens: 750,
  });

  const secondPromptOutput = secondPromptCompletion.data.choices.pop();
  return secondPromptOutput;
};

module.exports = { generateAction };