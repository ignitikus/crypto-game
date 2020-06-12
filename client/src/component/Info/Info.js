import React from 'react'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Avatar from '@material-ui/core/Avatar';
import DialogTitle from '@material-ui/core/DialogTitle';
import GitHubIcon from '@material-ui/icons/GitHub';

export default function Info(props){

   const { open, handleClose } = props
   return (
      <Dialog
         open={open}
         onClose={handleClose}
         aria-labelledby="alert-dialog-title"
         aria-describedby="alert-dialog-description"
         fullWidth
         >
         <DialogTitle id="alert-dialog-title">{"Welcome!"}</DialogTitle>
         <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
            <a href="https://github.com/ignitikus" target='_blank' rel="noopener noreferrer"><Avatar style={{width:'3em', height:'3em'}} alt="Niko" src="https://avatars0.githubusercontent.com/u/54951587?s=460&u=4"/></a>
         </div>
         <DialogContent>
            <DialogContentText id="alert-dialog-description" >
               <p style={{display:'flex', alignContent:'center', alignItems:'center'}}>Link to github repo: &nbsp;<a href="https://github.com/ignitikus/crypto-game" target='_blank' rel="noopener noreferrer"><GitHubIcon fontSize='large'/></a></p>
            </DialogContentText>
         </DialogContent>
         <DialogActions>
            <Button onClick={handleClose} color="primary">
               Close
            </Button>
         </DialogActions>
      </Dialog>
   )
}
