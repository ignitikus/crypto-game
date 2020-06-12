import axios from "axios";
import Cookies from 'js-cookie'

const Axios = axios.create({
   baseURL:'http://localhost:4000',
   timeout: 50000,
   headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
   }
})

Axios.interceptors.request.use((response) => {
   return response
}, (error) => {
   return Promise.reject(error)
})

Axios.interceptors.response.use((response) => {
   return response
}, async(error) => {
   if(error.response){
      switch (error.response.status) {
         case 401:
            const refresh = Cookies.get('jwt-refresh-token')
            await Axios.get('/api/users/refresh-token',{
               headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + refresh
               },
               withCredentials: true,
            })
            const cookie = Cookies.get('jwt-access-token')
            error.config.headers.Authorization = "Bearer "+ cookie
            return Axios.request(error.config)
         default:
            return Promise.reject(error)
      }
   }
})

export default Axios;