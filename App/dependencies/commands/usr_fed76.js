const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fed')
		.setDescription('Allows you to check Fallout 76 prices through FED 76!')
		.addStringOption(option =>
			option.setName('item')
				.setDescription('Type in armor or weapon here')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('legendary')
				.setDescription('Type in your legendary effect here. Example: q/25/25')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('grade')
				.setDescription('Type in the grade of armor here if you are searching for armor.')
				.setRequired(false)),
	async execute(interaction) {
		const item = interaction.options.getString('item');
		const modifier = interaction.options.getString('legendary');
		const grade = interaction.options.getString('grade');
		const response = await fetch(`https://fed76.info/pricing-api/?item=${item}&mods=${modifier}&grade=${grade}`);
		const data = await response.json();
		// console.log(data);

		// const Threads = await interaction.guild.channels.GuildChannelManager.fetchActiveThreads();
		const embed = new MessageEmbed()
			.setColor('#c7974b')
			.setTitle('FED Legendary Item Value Estimator')
			.setURL(data.review.author.url)
		// .setAuthor('Some name', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
		// .setDescription('Some description here')
			.setThumbnail(data.review.author.logo)
			.addFields(
				{ name: `__**${data.category}**__`, value: data.name, inline: true },
				{ name: '__**FED Rating**__', value: `${data.review.reviewRating.ratingValue}/5`, inline: true },
				{ name: '__**Recommendation**__', value: `${data.review.description}`, inline: false },
			)
			// .addField('Inline field title', 'Some value here', true)
			.setImage('https://fed76.s3.eu-west-2.amazonaws.com/HowToPricing.jpg')
		// .setTimestamp()
			.setFooter(data.review.author.description);
		await interaction.reply({ embeds: [embed] });
	},
};