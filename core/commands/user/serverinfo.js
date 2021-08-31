const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { prefix } = require('../../config.json');

/**
 * This function aims to imitate the date format used in the old code in order to fit best into embed with the least
 * noticeable change. The date returned is in UTC.
 * @param date the time to format (Date object)
 * @returns {Promise<string>} a string representing the date (UTC)
 */
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
	// Defines the Basic Command Data
	data: new SlashCommandBuilder()
		.setName(prefix + 'serverinfo')
		.setDescription('Replies with Server Info!'),

	// Is executed when the command is called.
	async execute(interaction) {

		console.log(`The serverinfo command was requested in ${interaction.guild.name}`);
		try {

			const owner = await interaction.guild.members.fetch(interaction.guild.ownerId);
			// create an embed
			const embed = new MessageEmbed()
				.setTitle(`Server information for ${interaction.guild.name}`)
				.setColor(0xe74d3c)
				.setThumbnail(interaction.guild.iconURL())
				.addField('Server owner', owner.user.tag, true)
				.addField('Region', interaction.guild.preferredLocale, true)
				.addField('Server ID', interaction.guild.id, true);


			// channel count
			const channels = await interaction.guild.channels.fetch();
			const textChannels = channels.filter(c => c.isText() === true).size;
			const voiceChannels = channels.filter(c => c.isVoice() === true).size;
			const activeThreads = channels.filter(c => c.isThread() === true).size;
			embed.addField('Channels', `Text channels: \`${textChannels}\`\nVoice channels: \`${voiceChannels}\`\nActive Threads: \`${activeThreads}\`\nTotal: \`${textChannels + voiceChannels}\``, true);


			// member count
			const members = interaction.guild.memberCount;
			const bots = (await interaction.guild.members.fetch()).filter(member => member.user.bot).size;
			const users = members - bots;
			embed.addField('Members', `Users: \`${users}\`\nBots: \`${bots}\`\nTotal: \`${members}\``, true);


			// prune estimate
			try {
				const estimate = await interaction.guild.members.prune({ dry: 1 });
				const estimate2 = await interaction.guild.members.prune({ dry: 7 });
				const estimate3 = await interaction.guild.members.prune({ dry: 30 });
				embed.addField('Prune estimate', `1 day: \`${estimate}\`\n7 days: \`${estimate2}\`\n30 days: \`${estimate3}\`\n`, true);
			} catch {
				embed.addField('Prune estimate', 'Missing kick perm', true);
			}


			// set the emoji and upload limit based on server boost status
			const boostLevel = (interaction.guild.premiumTier !== 'NONE') ? parseInt(interaction.guild.premiumTier[-1]) : 0;
			const emojiLimitOptions = [50, 100, 150, 250];
			const uploadLimitOptions = [8, 8, 50, 100];
			const emojiLimit = emojiLimitOptions[boostLevel];
			const uploadLimit = uploadLimitOptions[boostLevel];
			embed.addField('Emoji limit', `\`${emojiLimit}\``, true);
			// yes, the .0 is a string. no I don't want to turn it into a float / double.
			embed.addField('Upload limit', `\`${uploadLimit}.0 MB\``, true);


			// server bans
			try {
				const bans = (await interaction.guild.bans.fetch()).size;
				embed.addField('Bans', `\`${bans}\``, true);
			} catch (err) {
				embed.addField('Bans', 'Missing ban perm', true);
			}


			// server boosts
			if (interaction.guild.premiumTier !== 'NONE') {
				embed.addField('Server\'s Nitro Tier', `\`${boostLevel}\``, true);
			}
			if (interaction.guild.premiumSubscriptionCount !== 0) {
				embed.addField('Total server boosts', `\`${boostLevel}\``, true);
				embed.addField('\uFEFF', '\uFEFF', true);
			}
			if (interaction.guild.features === false) {
				embed.addField('Server features', interaction.guild.features, true);
			}


			// creation and join dates
			embed.addField('Server created at', await dateFormat(interaction.guild.createdAt), true);
			embed.addField('Bot joined date', await dateFormat(interaction.guild.me.joinedAt), true);


			// verification level
			if (interaction.guild.mfaLevel === 'NONE') {
				embed.addField('Verification level',
					'**Poor.**\nWe recommend turning on 2FA on the server for good security\nThis prevents any hackers gaining access to a admin account.',
					false);
			} else if (interaction.guild.mfaLevel === 'ELEVATED') {
				embed.addField('Verification level', '**Great!**\n2FA is enabled on this server', true);
			}


			await interaction.reply({ embeds:[embed] });
		} catch (err) {
			console.log(err);
			await interaction.reply('That\'s odd. I can\'t seem to give you that information. You better report this in to support.');
		}
	},
};
