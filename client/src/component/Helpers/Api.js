import Axios from './Axios'


export const latestUserInfo= async(token)=>{
   try {
      const success = await Axios.get('/api/users/user-info', {
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