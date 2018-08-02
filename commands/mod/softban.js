module.exports = async message => {
	if(!message.guild) return message.reply("this command is only available in servers");
	if(!message.member.hasPermission("BAN_MEMBERS")) return message.reply("you do not have enough permissions to ban members. (`BAN_MEMBERS`)");
		
	let target;
		
	if(message.mentions.members.size === 0){
		target = message.guild.member(message.client.users.find(val => val.id === message.args[1] || val.tag === message.args[1]));
	} else target = message.mentions.members.first();
	if(!target) return message.reply("No member to softban. You either did not provide any GuildMember (User ID, User Tag (User#1234) or mention");
	
	let prepareMessage = await message.reply(`softbanning __${target.user.tag}__...`);
	target.ban({ days: 7 }).then(() => {
		prepareMessage.edit(`Successfully banned  __${target.user.tag}__. Waiting for unban...`);
	}).catch(e => {
		prepareMessage.edit("An error occured while softbanning.");
	});
	message.guild.unban(target.user.id).then(() => {
		prepareMessage.edit(`__${target.user.tag}__ has been unbanned.`);
	}).catch(() => {
		prepareMessage.edit("An error occured while unbanning.");
	});
	
	
};