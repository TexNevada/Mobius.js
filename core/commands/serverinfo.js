const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	// Defines the Basic Command Data
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('Replies with Server Info!'),

	// Is executed when the command is called.
	async execute(interaction) {
		const embed = new MessageEmbed().setTitle('Server Info');
		await interaction.reply({ embeds:[embed] });
	},
};
