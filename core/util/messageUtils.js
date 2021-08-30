const { MessageEmbed, MessageActionRow, Message, MessageButton, MessageSelectMenu } = require('discord.js');
module.exports = {
	persistComponents(interaction, componentIds) {
		for (const each in interaction.message.components) {
			const component = interaction.message.components[each];
			console.log(component);
		}
	},

	createRoleSelection(interaction) {
		const roles = [];
		const r = interaction.member.guild.roles;
		for (const [roleId, role] of r.cache.entries()) {
			if (role.editable && roleId != r.everyone) {
				roles.push({
					label: role.name,
					value: roleId,
				},
				);
			}
		}

		return new MessageSelectMenu()
			.setCustomId('rrWizardRoleSelect')
			.setPlaceholder('Select a Role')
			.setMinValues(1)
			.setMaxValues(roles.length)
			.addOptions(roles);
	},

	createCancelButton() {
		return new MessageButton()
			.setCustomId('cancelButton')
			.setLabel('Cancel')
			.setStyle('DANGER');
	},
	createEmojiButton(emoji) {
		return new MessageButton()
			.setCustomId('rrEmojiButton')
			.setLabel('')
			.setStyle('SUCCESS')
			.setEmoji(emoji);
	},
};