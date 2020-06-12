import React, { Component } from 'react'
import { Consumer, Context } from '../Context/Context'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import { logout } from '../Helpers/authFunctions'
import Info from '../Info/Info'
import picture from '../../assets/logo.png'
import './Profile.css'


export default class Profile extends Component {
   static contextType = Context

   state={
      isOpen: false
   }

   handleOpen = ()=>this.setState({isOpen: true})
   handleClose = ()=>this.setState({isOpen: false})

   getTotalInUSD=(name)=>{
      const crypto = this.context.cryptos.filter(entry=> entry.name === name)
      if(crypto.length > 0){
         return crypto[0].current_price
      }
      return 0
   }

   logout = async ()=>{
      await logout()
      
      this.context.dispatch({
      type: "LOGGED_OUT"
      })
   }

   render() {
      return (
         <Consumer>
            {({isAuth:{user}, cryptos }) => {
               const sortedCryptos = user.cryptos.sort((a,b) => {
                     if( a.name > b.name ) return 1
                     if( a.name < b.name ) return -1
                     return 0
                  })
               return(
                  <div className='profileContainer'>
                     <InfoOutlinedIcon 
                        className='info-icon' 
                        onClick={this.handleOpen} 
                        style={{alignSelf:'flex-end', marginRight: '30px'}}/>
                     <Info open={this.state.isOpen} handleClose={this.handleClose}/>
                     <Avatar 
                        alt="avatar picture" 
                        src={picture} 
                        style={{width:'7em', height:'7em', padding:'10px'}}/>
                     <div className='user-info'>
                        <div className='user-welcome'>Welcome, {user.username}!</div>
                        <div className='user-total'>Available: {user.walletUSD.toFixed(2)}$</div>
                        <table className='cryptoContainer'>
                           <tbody>
                           <tr className='cryptoEntryContainer'>
                              <th>Currency</th>
                              <th>Amount</th>
                              <th>Total in USD</th>
                           </tr>
                           {sortedCryptos.map(({name, amount})=> {
                              if(amount>0){
                                 return(
                                    <tr className='cryptoEntryContainer' key={name}>
                                       <td>{name}</td>
                                       <td>{amount}</td>
                                       <td>{(this.getTotalInUSD(name) * amount).toFixed(2)}</td>
                                    </tr>
                                 )
                              }
                              return null
                           })}
                           </tbody>
                        </table>
                     </div>
                     <Button 
                        onClick={this.logout} 
                        variant="contained" 
                        color="primary"
                     >
                        Logout
                     </Button>
                  </div>
               )
            }}
         </Consumer>
      )
   }
}
