import { FC, useEffect, useState } from "react";
import axios from "axios";
import parser from "../helper/parser";
import api from "../api/api";

const AxiosConfig: FC<React.PropsWithChildren> = (props) => {
  const [axiosReady, setAxiosReady] = useState(false);

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use((config) => {
      const token = sessionStorage.getItem("token");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.log(error.response?.status);
        // if (error.response?.status === 401) {
        //   // console.error("ashdksjdhbjksdb");
        //   // notification.error({
        //   //   message: "Sesión expirada",
        //   //   description: "Ingrese sesión nuevamente.",
        //   //   placement: "topRight",
        //   // });

        //   //sessionStorage.clear();
        //   //window.location.replace("auth/login");
        //   return Promise.reject(error);
        
        // }


        let message = "";
        if (!(error?.response?.data instanceof ArrayBuffer)) {
          message = parser.parseError(error);
          console.error("Axios error:", message);
        }

        return Promise.reject(error);
      }
    );

    setAxiosReady(true);

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return axiosReady ? <>{props.children}</> : <></>;
};

export default AxiosConfig;
