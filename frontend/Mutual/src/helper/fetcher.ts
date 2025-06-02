import axios, { } from 'axios'


export default class Fetcher {
  static get(path: string, config?: any ) {
    return axios.get(path, config);
  }

  static post(path: string, data?: any, config?: any ) {

    return axios.post(path, data, config);
  }

  static put(path: string, data?: any, config?: any) {
    return axios.put(path, data, config);
  }

  static delete(path: string, config?: any) {
    return axios.delete(path, config);
  }

  static patch(path: string, data?: any, config?: any) {
    return axios.patch(path, data, config);
  }
}