const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tpc')
		.setDescription('Allows you to look up plans through The Plan Collectors Database')
		.addStringOption(option =>
			option.setName('search')
				.setDescription('What you want to search for here')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('page')
				.setDescription('Type in the number page here')),
	async execute(interaction) {
		const search = interaction.options.getString('search');
		const page = interaction.options.getString('page');
		const response = await fetch(`https://fed76.info/plan-api/?q=${search}&o=${page}`);
		const data = await response.json();
		if (data.plan_count > 5) {
			// const Threads = await interaction.guild.channels.GuildChannelManager.fetchActiveThreads();
			const embed = new MessageEmbed()
				.setColor('#477097')
				.setTitle('The Plan Collectors Database')
				.setURL(data.link)
			// .setAuthor('Some name', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
			// .setDescription('Some description here')
				.setThumbnail('https://cdn.edb.tools/MODUS_Project/images/Fed76/PlanCollectors.png')
				.addFields(
					{ name: 'Your search yielded to many results', value: data.message },
				);
			// .addField('Inline field title', 'Some value here', true)
			// .setImage('https://fed76.s3.eu-west-2.amazonaws.com/HowToPricing.jpg')
			// .setTimestamp()
			// .setFooter(`Returned: ${data.plan_count} results`);
			await interaction.reply({ embeds: [embed] });
		}
		else {

			// const Threads = await interaction.guild.channels.GuildChannelManager.fetchActiveThreads();
			const embed = new MessageEmbed()
				.setColor('#477097')
				.setTitle('The Plan Collectors Database')
				.setURL(data.link)
			// .setAuthor('Some name', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
			// .setDescription('Some description here')
				.setThumbnail('https://cdn.edb.tools/MODUS_Project/images/Fed76/PlanCollectors.png');
			// .addField('Inline field title', 'Some value here', true)
			// .setImage('https://fed76.s3.eu-west-2.amazonaws.com/HowToPricing.jpg')
			// .setTimestamp()
				// .setFooter(`Returned: ${data.plan_count} results`);
			for (const x in data.plans) {
				embed.addFields(
					{ name: data.plans[x].name, value: `${data.plans[x].verdict}\n**Plan type:** ${data.plans[x].plan_type}\n**Tradeable:** ${data.plans[x].tradeable}` },
				);
			}
			await interaction.reply({ embeds: [embed] });
		}
	},
};