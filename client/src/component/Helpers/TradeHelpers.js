import Axios from './Axios'
import Cookies from 'js-cookie'

export const buy = async(payload) => {
   try {
      const token = Cookies.get('jwt-access-token')
      const success = await Axios.post('/api/crypto/buy', payload, {
         withCredentials: true,
         headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
         }
      })
      return success.data
   } catch (err) {
      console.log(err)
      throw Error(err.response.data.message)
   }
}

export const sell = async(payload) => {
   try {
      console.log(payload)
      const token = Cookies.get('jwt-access-token')
      const success = await Axios.post('/api/crypto/sell', payload, {
         withCredentials: true,
         headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
         }
      })
      return success.data
   } catch (err) {
      console.log(err)
      throw Error(err.response.data.message)
   }
}

