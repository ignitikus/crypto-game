import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import TextField from '@material-ui/core/TextField';
import Cookies from 'js-cookie'

import { latestUserInfo } from '../Helpers/Api'
import { buy, sell } from '../Helpers/TradeHelpers'
import { Context } from '../Context/Context'


export default class Trading extends Component {
   static contextType = Context

   state={
      usd: 0,
      crypto: 0,
      balance: 0
   }


   handleClose=()=>{
      this.props.closeDialog()
      this.setState({usd:0, crypto:0, balance: 0})
   }

   handleChange=(e)=>{
      const { current_price } = this.props.currentCrypto
      if (this.props.mode==='buy'){
         switch (e.target.id) {
            case 'usd':
               if(e.target.value < 0) return

               const usd = e.target.value
               const crypto = usd / current_price
               const balance = this.context.isAuth.user.walletUSD - usd
               this.setState({usd, crypto, balance})
            break
            case 'crypto':
               if(e.target.value < 0) return

               const cryptoCase = e.target.value
               const usdCase = cryptoCase * current_price
               const balanceCase = this.context.isAuth.user.walletUSD - usdCase
               this.setState({usd: usdCase, crypto: cryptoCase, balance: balanceCase})
            break
            default:
               break;
         }
      }else{
         const foundCrypto = this.context.isAuth.user.cryptos.filter(entry=> entry.name === this.props.currentCrypto.name)
         const amount = foundCrypto.length ? foundCrypto[0].amount : 0
         console.log(amount)
         switch (e.target.id) {
            case 'usd':
               if(e.target.value < 0) return

               let usd = e.target.value
               let crypto = usd / current_price
               if(crypto > amount){
                  usd = amount * current_price
                  crypto = amount
               } 
               const balance = Number(this.context.isAuth.user.walletUSD) + Number(usd)
               this.setState({usd, crypto, balance})
            break
            case 'crypto':
               if(e.target.value < 0) return

               let cryptoCase = e.target.value
               const usdCase = cryptoCase * current_price
               if(cryptoCase > amount) cryptoCase = amount
               const balanceCase = Number(this.context.isAuth.user.walletUSD) + Number(usdCase)
               this.setState({usd: usdCase, crypto: cryptoCase, balance: balanceCase})
            break
            default:
               break;
         }
      }
   }

   handleOnBlur=(e)=>{
      switch (e.target.id) {
         case 'usd':
            if(!!e.target.value === false) return this.setState({usd: 0})
         break
         case 'crypto':
            if(!!e.target.value === false) return this.setState({crypto: 0})
         break
         default:
            break
      }
   }

   handleOnFocus=(e)=>{
      switch (e.target.id) {
         case 'usd':
            if(e.target.value === '0') return this.setState({usd: ''})
         break
         case 'crypto':
            if(e.target.value === '0') return this.setState({crypto: ''})
         break
         default:
            break
      }
   }

   handleSubmit=async()=>{
      if(this.props.mode==='buy'){
         const foundCrypto = this.context.isAuth.user.cryptos.filter(entry=> entry.name === this.props.currentCrypto.name)
         const payload={
            name: this.props.currentCrypto.name,
            amount: this.state.crypto,
            balance: this.state.balance,
         }
         
         if(foundCrypto.length){
            payload.amount = Number(this.state.crypto) + Number(foundCrypto[0].amount)
         }

         const response = await buy(payload)
         if(response === 'success'){
            const token = Cookies.get('jwt-access-token')
            const user = await latestUserInfo(token)
            this.context.dispatch({
               type: "UPDATE_USER",
               payload: user
            })
            this.setState({usd: 0, crypto: 0, balance: 0})
            this.props.closeDialog()
         }
      }else {
         const foundCrypto = this.context.isAuth.user.cryptos.filter(entry=> entry.name === this.props.currentCrypto.name)
         
         if(foundCrypto.length){
            const payload={
               name: this.props.currentCrypto.name,
               amount: foundCrypto[0].amount - this.state.crypto,
               balance: this.state.balance,
            }

            const response = await sell(payload)
            if(response === 'success'){
               const token = Cookies.get('jwt-access-token')
               const user = await latestUserInfo(token)
               this.context.dispatch({
                  type: "UPDATE_USER",
                  payload: user
               })
               this.setState({usd: 0, crypto: 0, balance: 0})
               this.props.closeDialog()
            }
         }
      }
   }

   render() {
      const { user} = this.context.isAuth
      const {usd, crypto, balance} = this.state
      const {isOpen, currentCrypto, mode} = this.props
      return (
         <Dialog 
               open={isOpen} 
               onClose={this.handleClose} 
               fullWidth={true} 
               maxWidth={'sm'} 
               aria-labelledby="form-dialog-title"
         >
            <DialogTitle id="form-dialog-title">
               {currentCrypto ? currentCrypto.name: null}
            </DialogTitle>
            <h2 style={{textAlign:'center'}}>
               Available money: {user?user.walletUSD.toFixed(2):0}$
            </h2>
            <DialogContent>
                  <form noValidate autoComplete="off">
                     <div style={{
                        display:'flex', 
                        justifyContent:'center', 
                        alignContent:'center', 
                        alignItems:'center' 
                     }}>
                        <TextField 
                           id="usd" 
                           type="number" 
                           label='USD'
                           value={usd}
                           onFocus={this.handleOnFocus}
                           onBlur={this.handleOnBlur}
                           onChange={this.handleChange}/>
                        <h2 style={{marginTop:'1.7em'}}>&nbsp;*&nbsp;</h2>
                        <TextField 
                           id="crypto" 
                           type="number" 
                           label={currentCrypto ? currentCrypto.name: null} 
                           value={crypto}
                           onFocus={this.handleOnFocus}
                           onBlur={this.handleOnBlur}
                           onChange={this.handleChange}/>
                        <h2 style={{marginTop:'1.7em'}}>&nbsp;=&nbsp;</h2>
                        <TextField 
                           id="balance" 
                           type="text" 
                           label='Balance'
                           value={`${Number(balance).toFixed(2)} $`} 
                           InputProps={{
                              readOnly: true,
                           }}
                        />
                     </div>
                  </form>
            </DialogContent>
            <DialogActions>
               <Button color="primary" onClick={this.handleClose}>Cancel</Button>
               <Button color="primary" onClick={this.handleSubmit}>{mode}</Button>
            </DialogActions>
         </Dialog>
      )
   }
}
