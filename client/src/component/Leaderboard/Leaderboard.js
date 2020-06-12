import React, { Component } from 'react'
import Divider from '@material-ui/core/Divider'
import Sparkle from 'react-sparkle'

import { getLeaderBoard } from '../Helpers/Api'
import './LeaderBoard.css'

export default class Leaderoard extends Component {
   state = {
      topTen : []
   }

   getBoard=async()=>{
      const topTen = await getLeaderBoard()
      const sorted = topTen.sort((a,b)=>{
         if(Number(a.amount)>Number(b.amount)) return -1
         if(Number(a.amount)<Number(b.amount)) return 1
         return 0
      })
      this.setState({topTen: sorted})
   }

   componentDidMount(){
      this.getBoard()
   }

   render() {
      const { topTen } = this.state
      return (
         <div className='leaderBoardOuterContainer'>
            <div className='leaderBoardInnerContainer'>
            <h2 className='leaderBoardTitle'>
               Top
            </h2>
            {
               topTen.map(({username,amount},i)=>{
                  if(i<10){
                     return(
                        <React.Fragment key={username}>
                           <div className={i===0?'topEntry':i===1? 'secondEntry': i===2? 'thirdEntry' :'entryContainer'}>
                              <div className='entryName'>{username}</div>
                              <div className='entryMoney'>{amount}</div>
                              {i<2 && 
                                 <Sparkle 
                                    overflowPx={0} 
                                    minSize={i===0?20:10} 
                                    count={i===0? 50:30} 
                                    flickerSpeed={'slowest'} 
                                    fadeOutSpeed={1}
                                 />
                              }
                           </div>
                           {
                              i>2 &&
                              <Divider />
                           }
                        </React.Fragment>
                     )
                  }
                  return null
               })
            }
            </div>
         </div>
      )
   }
}
