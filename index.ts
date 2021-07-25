import { Telegraf } from 'telegraf'
import { getCurrentProcess } from './request'

type AlertInterval = {
  mailNum: string,
  interval: number
}

const token = process.env.BOT_TOKEN!

const alertIntervals: AlertInterval[] = []

const bot = new Telegraf(token)

bot.start((ctx) => ctx.reply("Hello, I'm fxxk-ems-bot"))

bot.help((ctx) => {
  const helpMSG = `
help - get help message
get_trail - get_trial [mail number] get your trail current process
add_trail_alert - add_trail_alert [mail number] [duration = 3600000]
rm_trail_alert - rm_trail_alert [mail number]
list_alert - list all alerter
  `
  ctx.reply(helpMSG)
})

bot.command('hello', ctx => {
  let name = ctx.message.from.first_name
  if (ctx.message.from.last_name) {
    name += ' ' + ctx.message.from.last_name
  }
  ctx.reply(`Hello, fucking ${name}`)
})

bot.command('get_trail', ctx => {
  const mailNum = ctx.message.text.split(' ')[1]
  if (!mailNum) {
    ctx.reply('What fucking mail number you are looking for???')
  } else {
    getCurrentProcess(mailNum, currentTrail => {
      if (typeof currentTrail !== 'number') {
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
      } else {
        ctx.reply('Your fucking mail number is invalid')
      }
    }, err => {
      ctx.reply(err.response.statusText)
    })
  }
})

bot.command('add_trail_alert', ctx => {
  const mailNum = ctx.message.text.split(' ')[1]
  const duration = +ctx.message.text.split(' ')[2] || 3600000  // 1 hour default
  if (!mailNum) {
    ctx.reply('What fucking mail number you are looking for???')
  } else {
    const mail = alertIntervals.find(e => e.mailNum === mailNum)
    if (mail) {
      ctx.reply(`I already have an alerter for ${mailNum}`)
    } else {
      const newAlert: AlertInterval = {
        mailNum,
        interval: <any>setInterval(() => {
          getCurrentProcess(mailNum, currentTrail => {
            if (typeof currentTrail !== 'number') {
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
            } else {
              const mail = alertIntervals.find(e => e.mailNum === mailNum)
              ctx.reply('Your fucking mail number is invalid')
              clearInterval(mail!.interval)
              ctx.reply(`Removed your alerter ${mailNum}`)
            }
          }, err => {
            ctx.reply(err.response.statusText)
          })
        }, duration)
      }
      alertIntervals.push(newAlert)
    }
  }
})

bot.command('rm_trail_alert', ctx => {
  const mailNum = ctx.message.text.split(' ')[1]
  if (!mailNum) {
    ctx.reply('What fucking mail number you are looking for???')
  } else {
    const mail = alertIntervals.find(e => e.mailNum === mailNum)
    if (!mail) {
      ctx.reply(`No this alerter: mail ${mailNum}`)
    } else {
      clearInterval(mail.interval)
    }
  }
})

bot.command('list_alert', ctx => {
  const alerts = alertIntervals.map(e => e.mailNum).reduce((prev, curr, i) => {
    return prev + `${i + 1}. ${curr}\n`
  })
  ctx.reply(alerts)
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