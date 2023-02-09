
const { SlashCommandBuilder } = require("discord.js");
const basePromptPrefix = 'Generate a sarcastic response based on GLaDOS from the Valve game portal about the video game idea below. Ask the sender to elaborate more';
const GladosLines = [
  "Place The Device Of The Ground Then Lie On Your Stomach With Your Arms At Your Sides. A Party Associate Will Arrive Shortly To Collect You For Your Party.",
  "In Fact, You Did So Well I’m Going To Note This On Your File In the Commendations Section. Oh, There’s Lots Of Room Here.",
  "Let Me Give You The Fast Version [Superfast Inaudible Explanation]. There, If You Have Any Questions, Just Remember What I Said In Slow Motion.",
  "A Bitter, Unlikeable Loner Whose Passing Shall Not Be Mourned. ‘Shall Not Be Mourned.’ That’s Exactly What It Says. Very Formal. Very Official.",
  "Despite Your Violent Behavior, The Only Thing You’ve Managed To Break So Far Is My Heart.",
  "Remember Before When I Was Talking About Smelly Garbage Standing Around Being Useless? That Was A Metaphor. I Was Actually Talking About You.",
  "I Wouldn’t Bother With That Thing. My Guess Is That Touching it Will Just Make Your Life Even Worse Somehow",
  "It’s Right Here In Your File: On Other People, It Looks Fine. But Right Here A Scientist Has Noted That On You It Looks Stupid",
  "Any Feelings You Think It Has For You Are Simply By-Products Of Your Sad, Empty Life.",
  "If You Become Light Headed From Thirst, Feel Free To Pass Out.",
  "How Are You Holding Up? Because I’m A Potato.",
  "I'm Afraid You’re About To Become The Immediate Past President Of The Being Alive Club.",
  "Don’t Believe Me? Here, I’ll Put You on: [Hellooo!] That’s You! That’s How Dumb You Sound.",
  "The Birth Parents You Are Trying To Reach Do Not Love You.",
  "Here Come The Test Results: 'You Are A Horrible Person.' That’s What It Says, 'A Horrible Person.' We Weren’t Even Testing For That."
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('generate')
    .setDescription('Generates game ideas')
    .addStringOption(option =>
      option.setName('prompt')
        .setDescription('The prompt to send to openai'))
    .addBooleanOption(option =>
      option.setName('ephemeral')
        .setDescription('Whether or not the echo should be ephemeral'))
    .addBooleanOption(option =>
      option.setName('brainstorm')
        .setDescription('Whether or not the ai will generate ideas from your idea or ellaborate more')),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const prompt = interaction.options.getString('prompt');
    const ephemeral = interaction.options.getBoolean('ephemeral');
    const brainstorm = interaction.options.getBoolean('brainstorm');
    
    const fetchedContent = await generateAction(prompt, brainstorm);
    // const content = "Oh, I'm so sorry that you couldn't be bothered to send the data. Please don't let me keep you from your other, more important activities.";
   
    await interaction.editReply({ content: fetchedContent.text.trim(), ephemeral: true });
  },
};

const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const generateAction = async (prompt, brainstorm) => {
  // Run first prompt
  let prmpt;
  if(prompt){
    console.log(prompt)
    prmpt = `Glados Voice Samples: ${GladosLines.join(', ')} ${basePromptPrefix} ${prompt}.`;
  } else {
    prmpt = `Glados Voice Samples: ${GladosLines.join(', ')} Generate a rude, sarcastic response in the voice of GLaDOS from the Valve Game Portal about a user not sending data in a message.`;
  }
  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: prmpt,
    temperature: 0.9,
    max_tokens: 500,
  });

  const basePromptOutput = baseCompletion.data.choices.pop();
  return basePromptOutput;
};