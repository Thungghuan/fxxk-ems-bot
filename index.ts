import { Telegraf } from 'telegraf'
import { getCurrentProcess } from './request'

const token = process.env.BOT_TOKEN!

const bot = new Telegraf(token)

bot.start((ctx) => ctx.reply("Hello, I'm fxxk-ems-bot"))

bot.help((ctx) => ctx.reply('Help message'))

bot.command('get_trail', ctx => {
  getCurrentProcess('EZ679019121CN', currentTrail => {
    const mailNum = currentTrail.mailNo
    const despatchCity = currentTrail.despatchCity
    const destinationCity = currentTrail.destinationCity
    const currentProcess = currentTrail.processingInstructions
    const currentProcessType = currentTrail.opreateType
    const updateTime = currentTrail.optime

    const response = `
苹果ems邮件进度查询
邮件号：${mailNum}
${despatchCity}  -->  ${destinationCity}
当前进度：${currentProcess}
处理类型：${currentProcessType}
最新更新时间：${updateTime}
  `
    ctx.reply(response)
  })
})

bot.telegram.setWebhook(`https://fxxk-ems-bot.herokuapp.com/bot${token}`)
bot.launch({
  webhook: {
    hookPath: `/bot${token}`,
    port: +process.env.PORT! || 5000
  }
})

// bot.startWebhook(`/bot${token}`, null, 8000)

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))