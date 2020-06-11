import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions'
import TextField from '@material-ui/core/TextField';
import { Context } from '../Context/Context'



export default class Trading extends Component {
   static contextType = Context

   state={
      usd: 0,
      crypto: 0,
      wallet: 0,
      total: 0
   }

   updateWallet=()=>{
      this.setState({wallet: this.context.isAuth.user && this.context.isAuth.user.walletUSD })
   }

   handleChange=(e)=>{
      const { current_price } = this.props.currentCrypto
      console.log(current_price)
      switch (e.target.id) {
         case 'usd':
            if(e.target.value < 0) return
            this.setState({usd: e.target.value})
         break
         case 'crypto':
            if(e.target.value < 0) return
            this.setState({crypto: e.target.value})
         break
         default:
            break;
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


   componentDidMount(){
      this.updateWallet()
   }

   render() {
      const {usd, crypto, wallet, total} = this.state
      const {isOpen,currentCrypto, closeDialog, mode} = this.props
      const {isAuth:{user}} = this.context
      return (
         <Dialog 
               // open={isOpen} 
               open={true} 
               onClose={closeDialog} 
               fullWidth={true} 
               maxWidth={'sm'} 
               aria-labelledby="form-dialog-title">
               <DialogTitle id="form-dialog-title">{currentCrypto.name}</DialogTitle>
                  <h2 style={{textAlign:'center'}}>Available money: {wallet}$</h2>
                  <DialogContent>
                        <form noValidate autoComplete="off">
                           <div style={{display:'flex', justifyContent:'center', alignContent:'center', alignItems:'center' }}>
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
                                 label={currentCrypto.name} 
                                 value={crypto}
                                 onFocus={this.handleOnFocus}
                                 onBlur={this.handleOnBlur}
                                 onChange={this.handleChange}/>
                              <h2 style={{marginTop:'1.7em'}}>&nbsp;=&nbsp;</h2>
                              <TextField 
                                 id="standard-number" 
                                 type="text" 
                                 label='Total' 
                                 value={`${total} $`} 
                                 disabled/>
                           </div>
                        </form>
                  </DialogContent>
               <DialogActions>
                  <Button color="primary" onClick={closeDialog}>Cancel</Button>
                  <Button color="primary" onClick={null}>{mode}</Button>
               </DialogActions>
         </Dialog>
      )
   }
}
