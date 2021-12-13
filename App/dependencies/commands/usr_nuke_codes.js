const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const { NukaCryptAPI } = require('../../dependencies/configs/config.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('codes')
		.setDescription('Replies back with nuke codes'),
	async execute(interaction) {
		const response = await fetch(`https://nukacrypt.com/api/codes?${NukaCryptAPI}`);
		const data = await response.json();
		const message = `**Alpha:** ${data.ALPHA}\n**Bravo:** ${data.BRAVO}\n**Charlie:** ${data.CHARLIE}`;
		// await interaction.reply(message);

		// const Threads = await interaction.guild.channels.GuildChannelManager.fetchActiveThreads();
		const embed = new MessageEmbed()
			.setColor('#eeff00')
			.setTitle('Fallout 76 Nuclear Codes')
		// .setURL('')
		// .setAuthor('Some name', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
		// .setDescription('Some description here')
			.setThumbnail('https://cdn.edb.tools/MODUS_Project/images/PerkCardsAnimated/Ghoulish.gif')
			.addFields(
				{ name: 'This week\'s Nuclear Codes', value: `Nuke Codes reset every <t:${data.since_epoch + 604800}:F>\n${message}`, inline: false },
			)
			// .addField('Inline field title', 'Some value here', true)
		// .setImage('https://i.imgur.com/AfFp7pu.png')
		// .setTimestamp()
			.setFooter('Nuke codes are provided by our partner at https://nukacrypt.com/');
		await interaction.reply({ embeds: [embed] });
	},
};