const roles = require('../../config/roles'),
    moment = require('moment');

moment.locale('de');


exports.run = (bot, message, args) => {
    bot.getInactiveMembers(0, members => {
        let text = '**Nutzer ohne Rollen:**';

        text += bot.memberCollectionToTable(members);

        bot.splitMessageToMultiple(text).forEach(msg => message.channel.send(msg));
    });
};

exports.config = {
    aliases: ['nr'],
    server: true,
    role: roles.moderator
};

exports.help = {
    name: 'noroles',
    description: 'Zeigt alle Mitglieder des Servers ohne Rolle an.',
    usage: ['!noroles']
};