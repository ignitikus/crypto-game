import React, { Component } from 'react'
import { Consumer, Context } from '../Context/Context'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
// import Divider from '@material-ui/core/Divider'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import { logout } from '../Helpers/authFunctions'
import Info from '../Info/Info'
import picture from '../../assets/logo.png'
import './Profile.css'


export default class Profile extends Component {
   static contextType = Context

   state={
      user:{
         walletUSD: 9000, 
         crypto: [
            {name:'Bitcoin', amount: .6, exchangeRate: 9735.14}, 
            {name:'Etherium', amount: 2, exchangeRate: 242.70}, 
            {name: 'Dogecoin', amount: 1000, exchangeRate: 0.002591},
         ], 
         _id: "5ed948d83400e87c90cd618a", 
         email: "1@1.com", 
         username: "1"
      },
      isOpen: false
      
   }

   handleOpen = ()=>{
      this.setState({isOpen: true})
   }

   handleClose = ()=>{
      this.setState({isOpen: false})
   }

   getTotal = ()=>{
      let user = {...this.state.user}
      const total = user.crypto.reduce((t,{amount,exchangeRate}) => {
         return t + amount * exchangeRate
      },0)
      user.walletUSD = Number(total.toFixed(2))
      this.setState({user})
   }

   getInfo = () =>{
      console.log('Hey Hey')
   }
   
   logout = async ()=>{
      await logout()
      
      this.context.dispatch({
      type: "LOGGED_OUT"
      })
   }

   componentDidMount(){
      this.getTotal()
   }

   render() {
      return (
         <Consumer>
            {({isAuth:{user} }) => {
               const stateUser = this.state.user
               return(
                  <div className='profileContainer'>
                     <InfoOutlinedIcon className='info-icon' onClick={this.handleOpen} style={{alignSelf:'flex-end', marginRight: '30px'}}/>
                     <Info open={this.state.isOpen} handleClose={this.handleClose}/>
                     <Avatar alt="avatar picture" src={picture} style={{width:'7em', height:'7em', padding:'10px'}}/>
                     <div className='user-info'>
                        <div className='user-welcome'>Welcome, {stateUser.username}!</div>
                        <div className='user-total'>Total: {stateUser.walletUSD}$</div>
                        <table className='cryptoContainer'>
                           <tbody>
                           <tr className='cryptoEntryContainer'>
                              <th>Currency</th>
                              <th>Amount</th>
                              <th>Total in USD</th>
                           </tr>
                           {stateUser.crypto.map(({name, amount, exchangeRate})=> {
                              return(
                                 <tr className='cryptoEntryContainer' key={name}>
                                    <td>{name}</td>
                                    <td>{amount}</td>
                                    <td>{amount * exchangeRate}</td>
                                 </tr>
                              )
                           })}
                           </tbody>
                        </table>
                     </div>
                     <Button onClick={this.logout} className='my-button' variant="contained" color="primary">
                        Logout
                     </Button>
                  </div>
               )
            }}
         </Consumer>
      )
   }
}
