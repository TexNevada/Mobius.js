const { SlashCommandBuilder } = require('@discordjs/builders');
const { prefix } = require('../../config.json');

module.exports = {
	// Defines the Basic Command Data
	data: new SlashCommandBuilder()
		.setName(prefix + 'roll')
		.setDescription('Replies with User Info!')
		.addStringOption(option =>
			option.setName('num')
				.setDescription('Number of dice')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('type')
				.setDescription('Type of dice')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('multiplier')
				.setDescription('Multiply the dice roll')
				.setRequired(false)),

	// Is executed when the command is called.
	async execute(interaction) {

		if (interaction.guild) {
			console.log(`A user requested the roll command in ${interaction.guild.name}`);
		} else {
			console.log('A user requested the roll command in a private message');
		}

		// Prepping Error messages in advance
		const diceError = 'Did you type it wrong? Example: `>roll 1d10` or `>roll 1d10 +10`';


		try {

			// grab user options
			const num = parseInt(interaction.options.get('num').value);
			const type = parseInt(interaction.options.get('type').value) + 1;
			const multiplier = (interaction.options.get('multiplier')) ? parseInt(interaction.options.get('multiplier').value) : 0;


			// error handling
			if (num > 100) return await interaction.reply({ content: 'You can only do below 100 dice!' });
			if (num < 1) return await interaction.reply({ content: 'You can\'t roll dice that\'s below 1' });
			if (type > 10000) return await interaction.reply({ content: 'You can only do below 10000 for the number of sides for the dice!' });
			if (type < 2) return await interaction.reply({ content: 'You can\'t roll dice with sides that\'s below 2' });

			// the actual calculation
			const result = [];
			// generate 'num' number of random numbers
			for (let i = 0; i < num; i++) {
				// some formula I definitely didn't find in stack overflow
				const rand = Math.floor(Math.random() * type) + 1;
				result.push(rand);
			}

			// build the answer string
			const randomResult = result.join(', ');
			const totalNumber = result.reduce((a, b) => a + b, 0) + multiplier;
			const finalAnswer = (multiplier !== 0) ?
				`Rolled: ${randomResult}, +${multiplier}\nTotal: ${totalNumber}` :
				`Rolled: ${randomResult}\nTotal: ${totalNumber}`;

			await interaction.reply({ content: finalAnswer });
		} catch {
			await interaction.reply({ content: diceError });
		}
	},
};
