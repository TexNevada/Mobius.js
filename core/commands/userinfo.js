const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	// Defines the Basic Command Data
	data: new SlashCommandBuilder()
		.setName('userinfo')
		.setDescription('Replies with User Info!'),

	// Is executed when the command is called.
	async execute(interaction) {
		await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
	},
};
