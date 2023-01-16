import axios, { type AxiosRequestConfig } from "axios";

const networkConfig = {
  serverUrl: "http://127.0.0.1:9001",
  requestTimeout: 20000,
};

// 创建axios实例
export default function requestService(config: AxiosRequestConfig) {
  const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: networkConfig.serverUrl,
    // 超时
    timeout: networkConfig.requestTimeout,
  });
  // request拦截器
  service.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      console.log(error);
      Promise.reject(error);
    }
  );

  // 响应拦截器
  service.interceptors.response.use(
    (res) => {
      console.log(res);
      return res
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return service(config);
}
