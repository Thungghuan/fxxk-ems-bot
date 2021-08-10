import axios from 'axios'

const instance = axios.create()
instance.defaults.baseURL = 'https://www.ems.com.cn/apple'

type BasicTrail = {
  mailNo: string,
  optime: string,
  despatchCity: string,
  destinationCity: string,
  oemName: string,
  opreateType: string,
  processingInstructions: string,
  recipient: string
}

type ResultData = {
  data: {
    trails: [BasicTrail[]]
  }
}

type ResultError = {
  response: {
    statusText: string
  }
}

const getCurrentProcess = (
  mailNum: string,
  cb: (currentTrail: BasicTrail | number) => void,
  errHandler?: (err: ResultError) => void
) => {
  instance({
    url: `/getMailNoLastRoutes?mailNum=${mailNum}`,
    method: 'post'
  }).then((res: ResultData) => {
    if (res.data.trails.length > 0) {
      return res.data.trails[0][0]
    } else {
      return 0
    }
  }).then((currentTrail) => cb(currentTrail))
    // .catch(err => errHandler(err))
}

const session = process.env.SF_SESSION!

const getSFMailProcess = (
  mailNum: string,
  cb: (res: any) => void
) => {
  instance({
    baseURL: 'https://www.sf-express.com/sf-service-core-web/service',
    url: `/waybillRoute/${mailNum}/routes?lang=sc&region=cn`,
    headers: {
      Cookie: "SESSION=" + session
    }
  }).then(res => {
    cb(res)
  })
}

export {
  getCurrentProcess,
  getSFMailProcess
}