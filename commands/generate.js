const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
        .setName('generate')
        .setDescription('Generates game ideas'),
  async execute(interaction) {
    await interaction.reply("Ah, I see you've decided not to send a message. Great choice. You should make all your decisions like that.");
  },
};