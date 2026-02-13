const { REST, Routes } = require('discord.js');
const config = require('./config');

// Check if required environment variables are set
if (!config.botToken) {
    console.error('❌ BOT_TOKEN environment variable is not set!');
    process.exit(1);
}

if (!config.clientId) {
    console.error('❌ CLIENT_ID environment variable is not set!');
    process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(config.botToken);

(async () => {
    try {
        console.log('🧹 CLEARING ALL COMMANDS...');
        console.log('=====================================');
        
        // 1. Clear Global Commands
        console.log('🌍 Clearing GLOBAL commands...');
        await rest.put(
            Routes.applicationCommands(config.clientId),
            { body: [] }
        );
        console.log('✅ Global commands cleared.');

        // 2. Clear Guild Commands from ALL guilds
        console.log('------------');
        console.log('ZOOMING into Guilds to clear commands...');
        const guilds = await rest.get(Routes.userGuilds());
        console.log(`📊 Bot is in ${guilds.length} servers`);
        
        for (const guild of guilds) {
            try {
                console.log(`🗑️  Clearing guild commands from: ${guild.name} (${guild.id})`);
                
                await rest.put(
                    Routes.applicationGuildCommands(config.clientId, guild.id),
                    { body: [] }
                );
                
                console.log(`✅ Cleared commands from: ${guild.name}`);
            } catch (error) {
                console.error(`❌ Failed to clear commands from ${guild.name}:`, error.message);
            }
        }
        
        console.log('=====================================');
        console.log('🎉 ALL COMMANDS CLEARED!');
        console.log('You can now run "force-update-commands.bat" to deploy fresh commands.');
        
    } catch (error) {
        console.error('❌ Error clearing commands:', error);
    }
})();
