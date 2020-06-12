import React, { Component } from 'react'
import Cookies from 'js-cookie'
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider'
import AuthDialog from '../AuthDialog/AuthDialog'
import Profile from '../Profile/Profile'
import Leaderboard from '../Leaderboard/Leaderboard'
import { Consumer, Context } from '../Context/Context'
import { latestUserInfo } from '../Helpers/Api'

import './AuthContainer.css'

export default class AuthContainer extends Component {
   static contextType = Context
   state = {
      open: false,
      mode: 'Login'
   }

   
   handleClose = () =>{
      this.setState({open: false})
   }

   handleClick = () =>{
      this.setState({open: true})
   }

   changeMode = () =>{
      const mode = this.state.mode === 'Login' ? 'Register' : 'Login'
      this.setState({mode})
   }

   getUserFromCookie = async()=>{

      try {
         const token = Cookies.get('jwt-access-token')
         if(token){
            let user = await latestUserInfo(token)
            this.context.dispatch({
            type: "SUCCESS_SIGNED_IN",
            payload: user
            })
         }
         
      } catch (error) {
         console.log(error)
      }
   }

   componentDidMount(){
      this.getUserFromCookie()
   }

   render() {
      const { open, mode } = this.state
      return (
         <Consumer>
            {({isAuth:{user, auth} }) => {
               return(
                  <>
                     {user && auth 
                        ?<div style={{height: '100%'}}>
                              <Profile />
                              <Divider />
                              <Leaderboard />
                           </div>
                        :<>
                           <AuthDialog 
                              mode={mode} 
                              open={open} 
                              handleClose={this.handleClose} 
                              changeMode={this.changeMode}
                           />
                           <Button 
                              variant="contained" 
                              color="primary" 
                              onClick={this.handleClick}
                           >
                              Login/Register
                           </Button>
                        </>
                     }
                  </>
               )
            }}
         </Consumer>
      )
   }
}
