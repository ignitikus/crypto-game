import axios from "axios";

const Axios = axios.create({
   baseURL:'http://localhost:4000',
   timeout: 50000,
   headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
   }
})

export default Axios;