const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	// Defines the Basic Command Data
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),

	// Is executed when the command is called.
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};
