const roles = require('../../config/roles');

exports.run = (bot, message, args) => {
    const target = bot.getGuildMemberFromArgs(message, args, 0);

    if (target == null) {
        bot.respond(message, `der Nutzer \`${args[0]}\` konnte nicht gefunden werden.`, true, 10);
        return message.delete();
    }

    function setStatus(statusId) {
        bot.redis.hset(key, field, statusId, err => {
            if (err) {
                bot.log(`Redis Connection Error! ${err}`);
                bot.respond(message, 'Fehler beim Verbinden zum Redis Server!', true, 10);
                return message.delete();
            }

            bot.respond(message, `✅ Der Trust Status von ${target} wurde von ${message.author} auf \`${args[1]}\` gesetzt.`);
            bot.log(`!trust: ${message.author.tag} sets trust status of ${target.user.tag} to \`${args[1]}\`.`);
            return message.delete();
        });
    }

    function resetStatus() {
        bot.redis.hdel(key, field, err => {
            if (err) {
                bot.log(`Redis Connection Error! ${err}`);
                bot.respond(message, 'Fehler beim Verbinden zum Redis Server!', true, 10);
                return message.delete();
            }

            bot.respond(message, `✅ Der Trust Status von ${target} wurde von ${message.author} zurückgesetzt.`);
            bot.log(`!trust: ${message.author.tag} resets trust status of ${target.user.tag}.`);
            return message.delete();
        });
    }


    const key = `${bot.server.id}.TrustStatus`;
    const field = `${target.id}`;

    switch (args[1]) {
        case 'force':
            setStatus(1);
            target.addRole(roles.trusted);
            break;
        case 'refuse':
            setStatus(2);
            target.removeRole(roles.trusted);
            break;
        case 'reset':
            resetStatus();
            break;
        default:
            bot.respond(message, `die Option \`${args[1]}\` wurde nicht gefunden.`, true, 10);
            message.delete();
            break;
    }
};

exports.config = {
    server: true,
    role: roles.moderator,
    trusted: false,
    params: 2
};

exports.help = {
    name: 'trust',
    description: 'Trust Status eines Nutzers ändern.',
    usage: ['!trust @Discord force', '!trust @Discord refuse', '!trust @Discord reset']
};