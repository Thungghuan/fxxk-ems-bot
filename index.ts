import { Telegraf } from 'telegraf'

const token = process.env.BOT_TOKEN!

const bot = new Telegraf(token)

bot.start((ctx) => ctx.reply('Hello'))
bot.help((ctx) => ctx.reply('Help message'))
bot.command('hello', (ctx) => ctx.reply('Hello'))
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))