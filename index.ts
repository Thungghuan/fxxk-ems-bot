import { Telegraf } from 'telegraf'

const token = process.env.BOT_TOKEN!

const bot = new Telegraf(token)

bot.start((ctx) => ctx.reply('Hello'))
bot.help((ctx) => ctx.reply('Help message'))
bot.command('hello', (ctx) => ctx.reply('Hello'))
bot.launch()

// bot.telegram.setWebhook(`https://fxxk-ems-bot.herokuapp.com/bot${token}`)
// bot.startWebhook(`/bot${token}`, null, 8000)

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))