"use strict";
exports.__esModule = true;
var telegraf_1 = require("telegraf");
var token = process.env.BOT_TOKEN;
var bot = new telegraf_1.Telegraf(token);
bot.start(function (ctx) { return ctx.reply('Hello'); });
bot.help(function (ctx) { return ctx.reply('Help message'); });
bot.command('hello', function (ctx) { return ctx.reply('Hello'); });
// bot.launch()
bot.telegram.setWebhook("https://fxxk-ems-bot.herokuapp.com/bot" + token);
bot.startWebhook("/bot" + token, null, 8000);
// Enable graceful stop
process.once('SIGINT', function () { return bot.stop('SIGINT'); });
process.once('SIGTERM', function () { return bot.stop('SIGTERM'); });
