import Axios from './Axios'
import Cookies from 'js-cookie'

export const login = async(user) => {
   try {
      const success = await Axios.post('/api/users/login', user, {
         withCredentials: true
      })
      return success.data
   } catch (err) {
      console.log(err)
      throw Error(err.response.data.message)
   }
}

export const register = async(user) => {
   try {
      const success = await Axios.post('/api/users/register', user, {
         withCredentials: true
      })
      return success.data
   } catch (err) {
      console.log(err)
      throw Error(err.response.data.message)
   }
}

export const logout = async () => {
      try {
         Cookies.remove('jwt-access-token')
         Cookies.remove('jwt-refresh-token')
         
         const result = await Axios.get('/api/users/logout')
         return result.data
      } catch (error) {
         console.log(error)
         throw Error(error)
      }
   }