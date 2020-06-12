import React from 'react'
import {
   Button, 
   Dialog, 
   DialogTitle
} from '@material-ui/core';

import Login from './Login'
import Register from './Register'

import './AuthDialog.css'

export default function AuthDialog(props) {
   const { open, mode, handleClose, changeMode } = props
   return (
      <Dialog 
         open={open} 
         onClose={handleClose} 
         fullWidth={true} 
         maxWidth={'sm'} 
         aria-labelledby="form-dialog-title"
      >
         <DialogTitle id="form-dialog-title">
               <Button color="primary" onClick={changeMode} disabled={mode==='Login'? true: false}>
                  Login
               </Button> /
               <Button color="primary" onClick={changeMode} disabled={mode==='Register'? true: false}>
                  Register
               </Button>
         </DialogTitle>
         {mode==='Login'
            ?<Login handleClose={handleClose}/>
            :<Register handleClose={handleClose}/>
         }
      </Dialog>
   )
}