const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, Message, MessageButton, MessageSelectMenu } = require('discord.js');

function persistComponenets(interaction) {
	console.log(interaction.message.components);
	for (const each in interaction.message.components) {
		const component = interaction.message.components[each];
		console.log(component);
	}
}

function createRoleSelectionRow(interaction) {
	const roles = [];
	const r = interaction.member.guild.roles;
	// console.log(r);
	for (const [roleId, role] of r.cache.entries()) {
		if (role.editable && roleId != r.everyone) {
			roles.push({
				label: role.name,
				value: roleId,
			},
			);
		}
	}

	return new MessageActionRow().addComponents(
		new MessageSelectMenu()
			.setCustomId('rrWizardRoleSelect')
			.setPlaceholder('Select a Role')
			.setMinValues(1)
			.setMaxValues(roles.length)
			.addOptions(roles),
	);
}

function createSaveCancelRow() {
	return new MessageActionRow().addComponents(
		new MessageButton()
			.setCustomId('rrWizardAdd')
			.setLabel('Add')
			.setStyle('SUCCESS'),
		new MessageButton()
			.setCustomId('rrWizardSave')
			.setLabel('Save')
			.setStyle('SUCCESS'),
		new MessageButton()
			.setCustomId('rrWizardCancel')
			.setLabel('Cancel')
			.setStyle('DANGER'),
	);
}

function createEmojiButton(emoji) {
	return new MessageButton()
		.setCustomId('rrEmojiButton')
		.setLabel('')
		.setStyle('SUCCESS')
		.setEmoji(emoji);
}

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
		const roleSelectionRow = createRoleSelectionRow(interaction);
		const saveCancelRow = createSaveCancelRow(interaction);


		await interaction.reply({ content: 'Welcome to the Reaction Roles Wizard, Please select a role(s) to begin!', components:[roleSelectionRow, saveCancelRow] });
	},
	// TODO keep track of added buttons and keep them between messages.

	buttons:{
		async rrWizardCancel(interaction) {
			await interaction.update({ content: 'Reaction Roles Wizard Cancelled', components:[] });
		},
		async rrWizardSave(interaction) {
			await interaction.update({ content: 'Reaction Roles Wizard Saved', components:[] });
		},
		async rrWizardAdd(interaction) {
			// Message was cached and was not getting the emoji
			persistComponenets(interaction,['rrWizardCancel', 'rrWizardSave', 'rrWizardAdd']);
			let buttonEmoji;
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
				await interaction.update({ content:'Successfully added Reaction Role Button! Click Save/Cancel or continue to add more', components:[new MessageActionRow().addComponents(createEmojiButton(buttonEmoji)), createRoleSelectionRow(interaction), createSaveCancelRow()] });
			} else {
				await interaction.update({ content: 'Please react to the message to add' });
			}
			message.reactions.removeAll();
		},
	},

	selectMenus:{
		async rrWizardRoleSelect(interaction) {
			await interaction.update({ content: 'Please add your emoji and click add!', components:[createSaveCancelRow(interaction)] });
		},
	},

	async add(interaction) {
		await interaction.reply('Added a Reaction role to message');
	},
};
