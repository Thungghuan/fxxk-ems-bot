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

const getCurrentProcess = (mailNum: string, cb: (currentTrail: BasicTrail | number) => void, errHandler: (err: ResultError) => void) => {
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
    .catch(err => errHandler(err))
}


export {
  getCurrentProcess
}