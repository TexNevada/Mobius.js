const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('moveto')
		.setDescription('Replies with Pong!')
		.addIntegerOption(option =>
			option.setName('messages')
				.setDescription('How many messages shall I move? (max = 30)')
				.setRequired(true))
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('Where should I move the messages?')
				.addChannelType(0)
				.setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('Why do you wish to move the messages?')
				.setRequired(false))
		.addBooleanOption(option =>
			option.setName('silent')
				.setDescription('Do I ping whe I move?')
				.setRequired(false)),
	async execute(interaction) {
		// log and fetch info from the interaction
		console.log(`User ${interaction.member.user.tag} used moveto in ${interaction.guild.id}`);
		const originChannel = interaction.channel;
		const destinationChannel = interaction.options.get('channel').value;
		const numOfMessagesToMove = interaction.options.get('messages').value;
		const reason = interaction.options.get('reason') ? interaction.options.get('reason').value : '';
		const silent = interaction.options.get('silent') ? interaction.options.get('silent').value : false;

		// channel.messages.fetch({limit: })
		console.log(numOfMessagesToMove);
		console.log(originChannel.id);
		console.log(destinationChannel);
		console.log(`reason: ${reason}`);
		console.log(silent);

		// error handling
		if (numOfMessagesToMove > 30 || numOfMessagesToMove < 1) {
			await interaction.reply('Please enter a number between 1 and 30!');
			return;
		}

	},
};