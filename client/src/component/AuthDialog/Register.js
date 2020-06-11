import React, { Component } from 'react'
import validator from 'validator'
import { 
   Fade,
   Button, 
   Popper,
   TextField, 
   DialogContent, 
   DialogActions 
} from '@material-ui/core';
import { Context } from '../Context/Context'
import { register, login } from '../Helpers/authFunctions'
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

export default class Register extends Component {
   static contextType = Context
   state = {
      registerForm:{
         name: {
            autoFocus: true,
            margin: 'dense',
            name: 'name',
            id: 'name',
            label: 'Enter your name',
            type: 'text',
            fullWidth: true,
            value: ''
         },
         email: {
            autoFocus: false,
            margin: 'dense',
            name: 'email',
            id: 'email',
            label: 'Enter Email',
            type: 'email',
            fullWidth: true,
            value: ''
         },
         password:{
            autoFocus: false,
            margin: 'dense',
            name: 'password',
            id: 'password',
            label: 'Enter Password',
            type: 'password',
            fullWidth: true,
            value: ''
         }
      },
      popper:{
         currentTarget: null,
         open: false,
         message: ''
      },
      disabled: true
   }

   handleChange = (e) => {
      const popper = {...this.state.popper}

      const registerForm = { ...this.state.registerForm }

      registerForm[e.target.name].value = e.target.value
      
      switch (e.target.name) {
         case 'name':
            const validatedName = validator.matches(
               e.target.value,
               // change minimum to 3 after development
               /^[a-zA-Z0-9]{1,16}$/
            )
            if(!validatedName){
               popper.currentTarget = e.currentTarget
               popper.open = true
               popper.message = 'Cannot contain special characters and minimum of 2 and maximum of 20 characters'
            }else{
               popper.currentTarget = null
               popper.open = false
               popper.message = ''
            }
            break
         case 'email':
            const validatedEmail = validator.isEmail(e.target.value)
            if(!validatedEmail){
               popper.currentTarget = e.currentTarget
               popper.open = true
               popper.message = 'Must be an email'
            }else{
               popper.currentTarget = null
               popper.open = false
               popper.message = ''
            }
            break
         case 'password':
            const validatedPassword = validator.matches(
               e.target.value,
               "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
            )
            //change to -> !validatedPassword <-
            if(validatedPassword){
               popper.currentTarget = e.currentTarget
               popper.open = true
               popper.message = 'Minimum eight characters, at least one uppercase and lowercase letter, one number and one special character'
            }else{
               popper.currentTarget = null
               popper.open = false
               popper.message = ''
            }
            break
         default:
            break;
      }
      const disabled = registerForm.name.value 
                        &&registerForm.email.value 
                        && registerForm.password.value 
                        && !popper.message 
                        ? false
                        : true 
      this.setState({...this.state, registerForm, popper, disabled})
   }

   handleSubmit = async(e) => {
      e.preventDefault()
      const { name, email, password } = this.state.registerForm
      try {
         let success = await register({username: name.value, email: email.value, password: password.value})
         if(success.message === 'User created'){
            const success = await login({email: email.value, password: password.value})

            let registerForm = {
            ...this.state.registerForm,
            };

            registerForm["email"].value = "";
            registerForm["name"].value = "";
            registerForm["password"].value = "";

            this.setState({
               ...this.state,
               registerForm
            });
            this.context.dispatch({
               type: "SUCCESS_SIGNED_IN",
               payload: success.user,
            });
         }
      } catch (err) {
         console.log(err)
         toast.error(err.message, {
         position: "top-center",
         autoClose: 5000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
         })
      }
   }

   render(){
      const { handleClose } = this.props
      const { registerForm, popper, disabled } = this.state

      const registerFormInput = []

      for (let key in registerForm){
         registerFormInput.push({
            registerForm: registerForm[key]
         })
      }

      return (
         <> 
            <ToastContainer
               position="top-center"
               autoClose={5000}
               hideProgressBar={false}
               newestOnTop={false}
               closeOnClick
               rtl={false}
               pauseOnFocusLoss
               draggable
               pauseOnHover
            />
            <Popper
                  id={null}
                  open={popper.open}
                  anchorEl={popper.currentTarget}
                  placement={'top-start'}
                  style={{zIndex: '1500'}}
                  transition
               >
               { ({ TransitionProps}) => (
                  <Fade {...TransitionProps} timeout={350}>
                     {popper.message 
                        ? <div className='popper'>{popper.message}</div>
                        : <div></div>
                     }
                  </Fade>
               )}
            </Popper>
            <DialogContent>
               {registerFormInput.map(({registerForm:{ autoFocus, margin, name, id, label, type, fullWidth, value}}) => {
                  return(
                     <TextField 
                        key={name}
                        autoFocus={autoFocus}
                        margin={margin}
                        name={name}
                        id={id}
                        label={label}
                        type={type}
                        fullWidth={fullWidth}
                        value={value}
                        onChange={this.handleChange}
                     />
                  )
               })}
            </DialogContent>
            <DialogActions>
               <Button onClick={handleClose} color="primary">
                  Cancel
               </Button>
               <Button onClick={this.handleSubmit} color="primary" disabled={disabled}>
                  Register
               </Button>
            </DialogActions>
         </>
      )
   }
}
