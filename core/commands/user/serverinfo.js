const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	// Defines the Basic Command Data
	data: new SlashCommandBuilder()
		.setName('m-serverinfo')
		.setDescription('Replies with Server Info!'),

	// Is executed when the command is called.
	async execute(interaction) {

		// TODO: emoji limit, upload limit, change text formats

		interaction.guild.members.fetch();
		console.log(`The serverinfo command was requested in ${interaction.guild.name}`);
		try {

			const owner = await interaction.guild.members.fetch(interaction.guild.ownerId);
			// create an embed
			const embed = new MessageEmbed()
				.setTitle(`Server information for ${interaction.guild.name}`)
				.setColor(0xFF0000)
				.setThumbnail(interaction.guild.iconURL())
				.addField('Server owner', owner.user.username, true)
				.addField('Server ID', interaction.guild.id, true);

			// server bans
			try {
				const bans = (await interaction.guild.bans.fetch()).size;
				embed.addField('Bans', `\`${bans}\``, true);
			} catch (err) {
				console.log(err);
				embed.addField('Bans', 'Missing ban perm', true);
			}

			// channel count
			const channels = await interaction.guild.channels.fetch();
			const textChannels = channels.filter(c => c.isText() === true).size;
			const voiceChannels = channels.filter(c => c.isVoice() === true).size;
			const activeThreads = channels.filter(c => c.isThread() === true).size;
			embed.addField('Channels', `Text channels: \`${textChannels}\`\nVoice channels: \`${voiceChannels}\`\nActive Threads: \`${activeThreads}\`\nTotal: \`${channels.size}\``, true);

			// member count
			const members = interaction.guild.memberCount;
			const bots = (await interaction.guild.members.fetch()).filter(member => member.user.bot).size;
			const users = members - bots;
			embed.addField('Members', `Users: \`${users}\`\nBots: \`${bots}\`\nTotal: \`${members}\``, true);


			// prune count
			try {
				const estimate = await interaction.guild.members.prune({ dry: 1 });
				const estimate2 = await interaction.guild.members.prune({ dry: 7 });
				const estimate3 = await interaction.guild.members.prune({ dry: 30 });
				embed.addField('Prune estimate', `1 day: \`${estimate}\`\n7 days: \`${estimate2}\`\n30 days: \`${estimate3}\`\n`, true);
			} catch {
				embed.addField('Prune estimate', 'Missing kick perm', true);
			}


			// server boosts
			if (interaction.guild.premiumTier !== 'NONE') {
				embed.addField('Server\'s Nitro Tier', `\`${interaction.guild.premiumTier[-1]}\``, true);
			}
			if (interaction.guild.premiumSubscriptionCount !== 0) {
				embed.addField('Total server boosts', `\`${interaction.guild.premiumSubscriptionCount}\``, true);
				embed.addField('\uFEFF', '\uFEFF', true);
			}
			if (interaction.guild.features === false) {
				embed.addField('Server features', interaction.guild.features, true);
			}

			// creation and join dates
			embed.addField('Server created at', interaction.guild.createdAt.toUTCString(), true);
			embed.addField('Bot joined date', interaction.guild.me.joinedAt.toUTCString(), true);


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
