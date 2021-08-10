import { Telegraf } from 'telegraf'
import axios from 'axios'
import { getCurrentProcess, getSFMailProcess } from './request'

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
rm_trail_alert - rm_trail_alert [index]
list_alert - list all alerter
get_sf_Mail - get_sf_mail [mail number] get your SFMail current process
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

bot.command('get_sf_mail', ctx => {
  const mailNum = ctx.message.text.split(' ')[1]
  if (!mailNum) {
    ctx.reply('What fucking mail number you are looking for???')
  } else {
    getSFMailProcess(mailNum, (res) => {
      let response = ''
      if (res.data.success) {
        const currentMail = res.data.result.routes[0]
        const mailNum = currentMail.id
        const despatchCity = currentMail.origin
        const destinationCity = currentMail.destination
        const currentProcess = currentMail.routes.reverse()[0].remark
        const updateTime = currentMail.routes[0].scanDateTime
        response = `
顺丰快件进度查询
邮件号：${mailNum}
${despatchCity}  -->  ${destinationCity}
当前进度：${currentProcess}
最新更新时间：${updateTime}
`
      } else {
        if (res.data.message === '用户未登录') {
          response = 'ERROR 请及时更新Cookie'
        }
      }
      ctx.reply(response)
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
          return
        }
      }, err => {
        ctx.reply(err.response.statusText)
        return
      })

      const interval: number = <any>setInterval(() => {
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

      const newAlert: AlertInterval = {
        mailNum,
        interval
      }
      alertIntervals.push(newAlert)
    }
  }
})

bot.command('rm_trail_alert', ctx => {
  const index = +ctx.message.text.split(' ')[1]
  if (!index) {
    ctx.reply('What fucking alerter you want to remove???')
  } else {
    const mail: AlertInterval = alertIntervals[index - 1]
    if (!mail) {
      ctx.reply(`No this alerter`)
    } else {
      ctx.reply(`Alert removed: mail ${mail.mailNum}`)
      clearInterval(mail.interval)
      alertIntervals.splice(index - 1, 1)
    }
  }
})

bot.command('list_alert', ctx => {
  if (alertIntervals.length > 0) {
    const alerts = alertIntervals.map(e => e.mailNum).reduce((prev, curr, i) => {
      return prev + `${i + 1}. ${curr}\n`
    }, '\n')
    ctx.reply(alerts)
  } else {
    ctx.reply('No alert now')
  }
})

bot.command('add_sf_alert', ctx => {
  const mailNum = ctx.message.text.split(' ')[1]
  const duration = +ctx.message.text.split(' ')[2] || 3600000  // 1 hour default
  if (!mailNum) {
    ctx.reply('What fucking mail number you are looking for???')
  } else {
    const mail = alertIntervals.find(e => e.mailNum === mailNum)
    if (mail) {
      ctx.reply(`I already have an alerter for ${mailNum}`)
    } else {
      getSFMailProcess(mailNum, (res) => {
        let response = ''
        if (res.data.success) {
          const currentMail = res.data.result.routes[0]
          const mailNum = currentMail.id
          const despatchCity = currentMail.origin
          const destinationCity = currentMail.destination
          const currentProcess = currentMail.routes.reverse()[0].remark
          const updateTime = currentMail.routes[0].scanDateTime
          response = `
顺丰快件进度查询
邮件号：${mailNum}
${despatchCity}  -->  ${destinationCity}
当前进度：${currentProcess}
最新更新时间：${updateTime}
`
        } else {
          if (res.data.message === '用户未登录') {
            response = 'ERROR 请及时更新Cookie'
          }
        }
        ctx.reply(response)
      })
      const interval: number = <any>setInterval(() => {
        getSFMailProcess(mailNum, (res) => {
          let response = ''
          if (res.data.success) {
            const currentMail = res.data.result.routes[0]
            const mailNum = currentMail.id
            const despatchCity = currentMail.origin
            const destinationCity = currentMail.destination
            const currentProcess = currentMail.routes.reverse()[0].remark
            const updateTime = currentMail.routes[0].scanDateTime
            response = `
顺丰快件进度查询
邮件号：${mailNum}
${despatchCity}  -->  ${destinationCity}
当前进度：${currentProcess}
最新更新时间：${updateTime}
`
          } else {
            if (res.data.message === '用户未登录') {
              response = 'ERROR 请及时更新Cookie'
            }
          }
          ctx.reply(response)
        })
      }, duration)

      const newAlert: AlertInterval = {
        mailNum,
        interval
      }
      alertIntervals.push(newAlert)
    }
  }
})

bot.telegram.setWebhook(`${process.env.BOT_HOST}/bot${token}`)
bot.launch({
  webhook: {
    hookPath: `/bot${token}`,
    port: +process.env.PORT! || 5000
  }
})

setInterval(() => {
  axios({
    url: 'https://fxxk-ems-bot.herokuapp.com/'
  }).finally(() => {
    console.log('keep-alive in Heroku ', Date())
  })
}, 300000)

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))