const {
  Client,
  GatewayIntentBits,
  PermissionsBitField,
  EmbedBuilder
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages
  ]
});

client.once('clientReady', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});


// 🔥 AUTO WELCOME
client.on('guildMemberAdd', member => {
  const channel = member.guild.systemChannel;
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setColor('Green')
    .setTitle('🎉 Welcome!')
    .setDescription(`Welcome ${member} to **${member.guild.name}**`)
    .setThumbnail(member.user.displayAvatarURL())
    .setTimestamp();

  channel.send({ embeds: [embed] });
});


// 🔥 SLASH COMMAND HANDLER
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  try {
    await interaction.deferReply({ ephemeral: false });

    const target = interaction.options.getUser('user');
    const member = interaction.options.getMember('user');
    const time = interaction.options.getInteger('time');
    const amount = interaction.options.getInteger('amount');

    // 🏓 PING
    if (interaction.commandName === 'ping') {
      return interaction.editReply('🏓 Pong!');
    }

    // 🧹 CLEAR
    if (interaction.commandName === 'clear') {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
        return interaction.editReply('❌ No permission.');

      if (amount < 1 || amount > 100)
        return interaction.editReply('⚠️ Use 1-100.');

      await interaction.channel.bulkDelete(amount, true);
      return interaction.editReply(`✅ Deleted ${amount} messages.`);
    }

    // 🔨 BAN
    if (interaction.commandName === 'ban') {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers))
        return interaction.editReply('❌ No permission.');

      if (!member || !member.bannable)
        return interaction.editReply('❌ Cannot ban this user.');

      await member.ban();
      return interaction.editReply(`🔨 ${member.user.tag} banned.`);
    }

    // ♻️ UNBAN
    if (interaction.commandName === 'unban') {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers))
        return interaction.editReply('❌ No permission.');

      await interaction.guild.members.unban(target.id);
      return interaction.editReply(`♻️ ${target.tag} unbanned.`);
    }

    // 👢 KICK
    if (interaction.commandName === 'kick') {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers))
        return interaction.editReply('❌ No permission.');

      if (!member || !member.kickable)
        return interaction.editReply('❌ Cannot kick.');

      await member.kick();
      return interaction.editReply(`👢 ${member.user.tag} kicked.`);
    }

    // ⏳ TIMEOUT
    if (interaction.commandName === 'timeout') {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
        return interaction.editReply('❌ No permission.');

      if (!member)
        return interaction.editReply('❌ User not found.');

      await member.timeout(time * 60 * 1000);
      return interaction.editReply(`⏳ ${member.user.tag} timed out for ${time} min.`);
    }

    // 🔓 UNTIMEOUT
    if (interaction.commandName === 'untimeout') {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
        return interaction.editReply('❌ No permission.');

      if (!member)
        return interaction.editReply('❌ User not found.');

      await member.timeout(null);
      return interaction.editReply(`🔓 ${member.user.tag} unmuted.`);
    }

  } catch (err) {
    console.log(err);
    if (interaction.deferred)
      interaction.editReply('❌ Error occurred.');
    else
      interaction.reply('❌ Error occurred.');
  }
});

client.login('MTQ3NzUyNTI0OTk3MTk4MjQyNg.GAxc47.EmtkBSPzcjEoqFNCpRbs3k-n6cui5gbOrFH9lM');