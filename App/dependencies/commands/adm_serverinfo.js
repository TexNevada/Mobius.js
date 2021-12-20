const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');
const { TIER_0, TIER_1, TIER_2, TIER_3 } = require('../assets/discord_premium_tiers.json');

async function dateFormat(date) {
	// wanted result = 29 January 2019 12:11:39 UTC
	const day = date.getUTCDate();
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	const month = months[date.getUTCMonth()];
	const year = date.getUTCFullYear();
	const hours = date.getUTCHours();
	const minutes = date.getUTCMinutes();
	const seconds = date.getUTCSeconds();

	return `${day} ${month} ${year}\n${hours}:${minutes}:${seconds} UTC`;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('Displays server information'),
	async execute(interaction) {
		if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD, Permissions.FLAGS.MANAGE_CHANNELS) === false) return await interaction.reply('You need `Manage Guild`, `Manage Channel` or `Administrator` permission for that');

		const GuildOwner = await interaction.guild.fetchOwner();
		// Channels
		const Channels = interaction.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').size;
		const Public_Threads = interaction.guild.channels.cache.filter(c => c.type === 'GUILD_PUBLIC_THREAD').size;
		const Private_Threads = interaction.guild.channels.cache.filter(c => c.type === 'GUILD_PRIVATE_THREAD').size;
		const News_Threads = interaction.guild.channels.cache.filter(c => c.type === 'GUILD_NEWS_THREAD').size;
		const Voice = interaction.guild.channels.cache.filter(c => c.type === 'GUILD_VOICE').size;

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
				{ name: 'Server ID', value: interaction.guild.id, inline: true },
				{ name: 'Channels', value: `Text: \`${Channels}\`\nThreads: \`${Public_Threads + Private_Threads + News_Threads}\`\nVoice: \`${Voice}\``, inline: true });

		// .setImage('https://i.imgur.com/AfFp7pu.png')
		// .setTimestamp()
		// .setFooter('Some footer text here', 'https://i.imgur.com/AfFp7pu.png');

		// member count
		const members = interaction.guild.memberCount;
		const bots = (await interaction.guild.members.fetch()).filter(member => member.user.bot).size;
		const users = members - bots;
		embed.addField('Members', `Users: \`${users}\`\nBots: \`${bots}\`\nTotal: \`${members}\``, true);


		// prune estimate
		try {
			const estimate = await interaction.guild.members.prune({ dry: 30 });
			const estimate2 = await interaction.guild.members.prune({ dry: 60 });
			const estimate3 = await interaction.guild.members.prune({ dry: 180 });
			embed.addField('Inactive accounts', `30 days: \`${estimate}\`\n60 days: \`${estimate2}\`\n180 days: \`${estimate3}\``, true);
		}
		catch {
			embed.addField('Inactive accounts', 'Missing kick perm', true);
		}

		// set the emoji and upload limit based on server boost status
		if (interaction.guild.premiumTier === 'TIER_1') {
			embed.addField('Emoji slots', `Emoji slots: \`${TIER_1.emoji_slots}\``, true);
			embed.addField('Sticker slots', `Sticker slots: \`${TIER_1.sticker_slots}\``, true);
			embed.addField('Upload limit', `\`${TIER_1.upload_limit}\``, true);
		}
		else if (interaction.guild.premiumTier === 'TIER_2') {
			embed.addField('Emoji slots', `Emoji slots: \`${TIER_2.emoji_slots}\``, true);
			embed.addField('Sticker slots', `Sticker slots: \`${TIER_2.sticker_slots}\``, true);
			embed.addField('Upload limit', `\`${TIER_2.upload_limit}\``, true);
		}
		else if (interaction.guild.premiumTier === 'TIER_3') {
			embed.addField('Emoji slots', `Emoji slots: \`${TIER_3.emoji_slots}\``, true);
			embed.addField('Sticker slots', `Sticker slots: \`${TIER_3.sticker_slots}\``, true);
			embed.addField('Upload limit', `\`${TIER_3.upload_limit}\``, true);
		}
		else {
			embed.addField('Emoji slots', `Emoji slots: \`${TIER_0.emoji_slots}\``, true);
			embed.addField('Sticker slots', `Sticker slots: \`${TIER_0.sticker_slots}\``, true);
			embed.addField('Upload limit', `\`${TIER_0.upload_limit}\``, true);
		}
		// server bans
		try {
			const bans = (await interaction.guild.bans.fetch()).size;
			embed.addField('Bans', `\`${bans}\``, true);
		}
		catch (err) {
			embed.addField('Bans', 'Missing ban perm', true);
		}

		if (interaction.guild.premiumSubscriptionCount !== 0) {
			embed.addField('Server boosts', `\`${interaction.guild.premiumSubscriptionCount}\``, true);
		}
		if (interaction.guild.features === false) {
			embed.addField('Server features', interaction.guild.features, true);
		}


		// creation and join dates
		embed.addField('Server created at', await dateFormat(interaction.guild.createdAt), true);
		embed.addField('Bot joined date', await dateFormat(interaction.guild.me.joinedAt), true);


		// verification level
		if (interaction.guild.mfaLevel === 'NONE') {
			embed.addField('2FA recommendation',
				'**Poor.**\n_We recommend turning on 2FA on the server for good security\nThis helps prevents any hackers from gaining access to a admin account.\nA 2019 report from Microsoft concluded that 2FA works, blocking 99.9% of automated attacks._',
				false);
		}
		else if (interaction.guild.mfaLevel === 'ELEVATED') {
			embed.addField('2FA recommendation', '**Great!**\n2FA is enabled on this server', false);
		}

		await interaction.reply({ embeds: [embed] });
	},
};