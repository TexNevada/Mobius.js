const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	// Defines the Basic Command Data
	data: new SlashCommandBuilder()
		.setName('m-roll')
		.setDescription('Replies with User Info!'),

	// Is executed when the command is called.
	async execute(interaction) {
		await interaction.reply({ content: 'rolling' });
	},
};
