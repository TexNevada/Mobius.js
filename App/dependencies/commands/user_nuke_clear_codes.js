const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const { NukaCryptAPI } = require('../../dependencies/configs/config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cc')
		.setDescription('Gives the nuke codes in plain text without embeds'),
	async execute(interaction) {
		const response = await fetch(`https://nukacrypt.com/api/codes?${NukaCryptAPI}`);
		const data = await response.json();
		const message = `**Alpha:** ${data.ALPHA}\n**Bravo:** ${data.BRAVO}\n**Charlie:** ${data.CHARLIE}`;
		await interaction.reply(`This week's Nuclear Codes\nNuke Codes reset every <t:${data.since_epoch + 604800}:F>\n${message}`);
	},
};