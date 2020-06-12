import React, { Component } from "react";
import { latestUserInfo } from '../Helpers/Api'
import Cookies from 'js-cookie'
import Axios from '../Helpers/Axios'

export const Context = React.createContext();

const reducer = (state, action) => {
   switch (action.type) {
      case "SUCCESS_SIGNED_IN":
         return {
            ...state,
            isAuth: {
               user: action.payload,
               auth: true,
            },
         };
      case "LOGGED_OUT":
         return {
            ...state,
            isAuth: {
               user: null,
               auth: false,
            }
         }
      case "UPDATE_USER":
         return {
            ...state,
            isAuth: {
               user: action.payload,
               auth: true,
            }
         }
      default:
         return state;
   }
};

export class Provider extends Component {
   state = {
      isAuth: {
         user: null,
         auth: false,
      },
      cryptos: [],

      dispatch: (action) => {
         this.setState((state) => reducer(state, action));
      },

   };

   getUser = async ()=>{
      const token = Cookies.get('jwt-access-token')
      const refresh = Cookies.get('jwt-refresh-token')
      if(!refresh)return
      const response = await latestUserInfo(token)

      reducer(this.state, {
         type: 'SUCCESS_SIGNED_IN',
         payload: response
      })
   }

   getCryptos = async() => {
      const success = await Axios.get('/api/crypto/cryptos')
      if(success){
         this.setState({cryptos: success.data})
      }
   }

   componentDidMount(){
      this.getUser()
      this.getCryptos()
   }

   render() {
      return (
         <Context.Provider value={this.state}>
            {this.props.children}
         </Context.Provider>
      );
   }
}

export const Consumer = Context.Consumer;
