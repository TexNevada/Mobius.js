const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, Message, MessageButton } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reactionroles')
		.setDescription('Sets up and managed reaction role messages')
		.addSubcommand(subcommand =>
			subcommand.setName('add')
				.setDescription('Adds a reaction role'))
		.addSubcommand(subcommand =>
			subcommand.setName('wizard')
				.setDescription('Starts the reaction role wizard.')),

	async wizard(interaction) {
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('rrWizard')
					.setLabel('Wizard')
					.setStyle('PRIMARY'),
			);

		const filter = i => ['rrWizard'].indexOf(i.customId) > -1 && i.user.id === interaction.member.user.id;
		const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });
		collector.on('collect', async i => {
			if (i.customId === 'rrWizard') {
				await i.update({ content: 'The Wizard button was pressed', components: [] });
			}
		});

		await interaction.reply({ content: 'Welcome to the Reaction Roles Wizard', components:[row] });
	},

	async add(interaction) {
		await interaction.reply('Added a Reaction role to message');
	},
};
