const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('Displays server information'),
	async execute(interaction) {
		const GuildOwner = await interaction.guild.fetchOwner();
		// Channels
		const Channels = interaction.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').size;
		const Public_Threads = interaction.guild.channels.cache.filter(c => c.type === 'GUILD_PUBLIC_THREAD').size;
		const Private_Threads = interaction.guild.channels.cache.filter(c => c.type === 'GUILD_PRIVATE_THREAD').size;
		const News_Threads = interaction.guild.channels.cache.filter(c => c.type === 'GUILD_NEWS_THREAD').size;
		const Voice = interaction.guild.channels.cache.filter(c => c.type === 'GUILD_VOICE').size;
		// Users & Bots
		const Users = interaction.guild.members.cache.filter(member => !member.user.bot).size;
		const Bots = interaction.guild.members.cache.filter(member => member.user.bot).size;
		const Members = interaction.guild.memberCount;

		// const Threads = await interaction.guild.channels.GuildChannelManager.fetchActiveThreads();
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
				{ name: 'Channels', value: `Text: \`${Channels}\`
											Threads: \`${Public_Threads + Private_Threads + News_Threads}\`
											Voice: \`${Voice}\``, inline: true },
				{ name: '\u200B', value: '\u200B' },
				{ name: 'Members', value: `Users: \`${Users}\`
											Bots: \`${Bots}\`
											Members: \`${Members}\``, inline: true },
				{ name: 'Inline field title', value: 'Some value here', inline: true },
			)
			.addField('Inline field title', 'Some value here', true)
			// .setImage('https://i.imgur.com/AfFp7pu.png')
			// .setTimestamp()
			.setFooter('Some footer text here', 'https://i.imgur.com/AfFp7pu.png');
		await interaction.reply({ embeds: [embed] });
	},
};