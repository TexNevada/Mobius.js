const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
const { persistComponents, createRoleSelection, createCancelButton, createEmojiButton } = require('../util/messageUtils');

function createSaveButton() {
	return new MessageButton()
		.setCustomId('rrWizardSave')
		.setLabel('Save')
		.setStyle('SUCCESS');
}

function createAddButton() {
	return new MessageButton()
		.setCustomId('rrWizardAdd')
		.setLabel('Add')
		.setStyle('SUCCESS');
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reactionroles')
		.setDescription('Sets up and managed reaction role messages')
		.addSubcommand(subcommand =>
			subcommand.setName('wizard')
				.setDescription('Starts the reaction role wizard.')),

	async wizard(interaction) {
		const components = [
			new MessageActionRow().addComponents(
				createRoleSelection(interaction),
			),
			new MessageActionRow().addComponents(
				createSaveButton(),
				createCancelButton(),
			),
		];
		await interaction.reply({ content: 'Welcome to the Reaction Roles Wizard, Please select a role(s) to begin!', components:components });
	},

	// Button Interactions for the Command
	buttons:{
		async cancelButton(interaction) {
			await interaction.update({ content: 'Command Cancelled', components:[] });
		},
		async rrWizardSave(interaction) {
			await interaction.update({ content: 'Reaction Roles Wizard Saved', components:[] });
		},
		async rrWizardAdd(interaction) {
			// Message was cached and was not getting the emoji
			persistComponents(interaction, ['rrWizardCancel', 'rrWizardSave', 'rrWizardAdd']);
			const components = [
				new MessageActionRow().addComponents(
					createRoleSelection(interaction),
				),
				new MessageActionRow().addComponents(
					createSaveButton(),
					createCancelButton(),
				),
			];

			let buttonEmoji;
			// Update emoji and user cache to get the first emoji from our user
			const message = await interaction.message.fetch();
			for (const [emoji, emojiData] of message.reactions.cache.entries()) {
				const users = await emojiData.users.fetch();
				for (const [username, user] of users.entries()) {
					if (user.id === interaction.user.id) {
						buttonEmoji = emoji;
						break;
					}
				}
				if (buttonEmoji) break;
			}

			if (buttonEmoji) {
				components.push(new MessageActionRow().addComponents(createEmojiButton(buttonEmoji)));
				await interaction.update({ content:'Successfully added Reaction Role Button! Click Save/Cancel or continue to add more', components:components });
			} else {
				await interaction.update({ content: 'Please react to the message to add' });
			}
			message.reactions.removeAll();
		},
	},

	// Selection menus for the command
	selectMenus:{
		async rrWizardRoleSelect(interaction) {
			const components = [
				new MessageActionRow().addComponents(
					createAddButton(),
					createCancelButton(),
				),
			];
			let roles = interaction.member.guild.roles.cache.filter(role => interaction.values.indexOf(role.id) > -1);
			roles = Array.from(roles, (r) => r[1]);
			await interaction.update({ content: `Please react with the emoji you want to use for the role${(roles.length > 1) ? 's' : ''} ${roles} and click add!`, components:components });
		},
	},
};
