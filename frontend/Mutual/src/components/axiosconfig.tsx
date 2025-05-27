import { FC, useEffect, useState } from "react";
import axios from "axios";
import parser from "../helper/parser";

const AxiosConfig: FC<React.PropsWithChildren> = (props) => {
  const [axiosReady, setAxiosReady] = useState(false);

  useEffect(() => {
    axios.interceptors.request.use((config) => {
      const token = sessionStorage.getItem("token");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.withCredentials = true;
      config.timeout = 10000;
      return config;
    });

    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        let message = "";
        if (!(error?.response?.data instanceof ArrayBuffer)) {
          message = parser.parseError(error);
          console.error("Axios error:", message);
        }

        return Promise.reject(error);
      }
    );

    setAxiosReady(true);
  }, []);

  return axiosReady ? <>{props.children}</> : <></>;
};

export default AxiosConfig;
