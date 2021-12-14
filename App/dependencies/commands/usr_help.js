const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Gives you the link to the wiki!'),
	async execute(interaction) {
		await interaction.reply('You can find all the commands here: https://modus.enclavedb.net');
	},
};