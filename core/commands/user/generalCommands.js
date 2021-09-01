const { SlashCommandBuilder } = require('@discordjs/builders');
const { prefix } = require('../../config.json');
const { MessageEmbed } = require('discord.js');
const { client } = require('../../index.js') ;

module.exports = {
	// Defines the Basic Command Data
	data: new SlashCommandBuilder()
		.setName(prefix + 'general')
		.setDescription('Replies with Pong!')
		.addSubcommand(subcommand =>
			subcommand.setName('joined')
				.setDescription('Gives you a date & time of when you joined the discord server you are in.')
				.addMentionableOption(option =>
					option.setName('member')
						.setDescription('mention the member you wish to check')
						.setRequired(false)))
		.addSubcommand(subcommand =>
			subcommand.setName('guilds')
				.setDescription('Will display how many servers MODUS is in.'))
		.addSubcommand(subcommand =>
			subcommand.setName('credits')
				.setDescription('Will display information about the bot and its creator.'))
		.addSubcommand(subcommand =>
			subcommand.setName('support')
				.setDescription('Will send a link straight to the support channel.'))
		.addSubcommand(subcommand =>
			subcommand.setName('invite')
				.setDescription('Will send a link to allow you to invite MODUS to your own server.'))
		.addSubcommand(subcommand =>
			subcommand.setName('ping')
				.setDescription('Will report back the latency of the bot.')),

	async joined(interaction) {
		if (!interaction.guild) return;
		let member = interaction.member;
		console.log(`A user requested when it joined "${interaction.guild.name}" `);

		// look for mentioned member
		if (interaction.options.get('member')) {
			member = interaction.options.get('member').member;
		}

		// create and send embed with the join date
		const embed = new MessageEmbed()
			.setTitle('Joined the server at')
			.setDescription(`\`${member.joinedAt.toUTCString()}\``)
			.setColor(member.displayHexColor)
			.setAuthor(member.displayName, member.user.avatarURL());
		await interaction.reply({ embeds: [embed] });
	},

	async guilds(interaction) {
		if (interaction.guild) {
			console.log(`A user requested the guilds command in ${interaction.guild.name}`);
		} else {
			console.log('A user requested the guilds command in a private message');
		}

		await interaction.reply({ content: `MODUS is in ${(await client.guilds.fetch()).size} servers so far!` });
	},

	async credits(interaction) {
		if (interaction.guild) {
			console.log(`A user requested the credits command in ${interaction.guild.name}`);
		} else {
			console.log('A user requested the credits command in a private message');
		}

		await interaction.reply({ content: 'You can find the credits to the bot right here: https://modus.enclavedb.net/books/changelog-credits-other/page/credits-significant-contributors' });
	},

	async support(interaction) {
		if (interaction.guild) {
			console.log(`A user requested the support command in ${interaction.guild.name}`);
		} else {
			console.log('A user requested the support command in a private message');
		}
		await interaction.reply({ content: 'https://discord.gg/hMfgSaN' });
	},

	async invite(interaction) {
		if (interaction.guild) {
			console.log(`A user requested the invite command in ${interaction.guild.name}`);
		} else {
			console.log('A user requested the invite command in a private message');
		}

		await interaction.reply({ content: 'https://discord.com/oauth2/authorize?client_id=532591107553624084&permissions=1879960790&scope=bot' });
	},

	async ping(interaction) {
		if (interaction.guild) {
			console.log(`A user requested the "ping" command in ${interaction.guild.name}`);
		} else {
			console.log('A user requested the "ping" command in a private message');
		}

		await interaction.reply({ content: `Ping result: \`${client.ws.ping} ms\`` });
	},


};
