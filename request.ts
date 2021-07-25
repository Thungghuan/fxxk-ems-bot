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

const getCurrentProcess = (mailNum: string, cb: (currentTrail: BasicTrail) => void) => {
  instance({
    url: `/getMailNoLastRoutes?mailNum=${mailNum}`,
    method: 'post'
  }).then((res: ResultData) => {
    return res.data.trails[0][0]
  }).then((currentTrail) => cb(currentTrail))
}


export {
  getCurrentProcess
}