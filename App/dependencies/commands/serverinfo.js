const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('Displays server information'),
	async execute(interaction) {
		const GuildOwner = await interaction.guild.fetchOwner();
		const Channels = interaction.guild.channels.GuildChannelManager.channelCountWithoutThreads;
		const Threads = await interaction.guild.channels.GuildChannelManager.fetchActiveThreads();
		const embed = new MessageEmbed()
			.setColor('#E74C3C')
			.setTitle(`Server information for ${interaction.guild.name}`)
			// .setURL('')
			// .setAuthor('Some name', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
			// .setDescription('Some description here')
			.setThumbnail(interaction.guild.iconURL())
			.addFields(
				{ name: 'Server owner', value: `${GuildOwner}`, inline: true },
				{ name: 'Server language', value: `${interaction.guild.preferredLocale}`, inline: true },
				{ name: 'Channels', value: `Channels ${Channels}\nThreads: ${Threads}`, inline: true },
				{ name: '\u200B', value: '\u200B' },
				{ name: 'Inline field title', value: 'Some value here', inline: true },
				{ name: 'Inline field title', value: 'Some value here', inline: true },
			)
			.addField('Inline field title', 'Some value here', true)
			.setImage('https://i.imgur.com/AfFp7pu.png')
			// .setTimestamp()
			.setFooter('Some footer text here', 'https://i.imgur.com/AfFp7pu.png');
		await interaction.reply({ embeds: [embed] });
	},
};