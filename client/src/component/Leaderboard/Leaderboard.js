import React, { Component } from 'react'
import Divider from '@material-ui/core/Divider'
import Sparkle from 'react-sparkle'
import './LeaderBoard.css'

export default class Leaderoard extends Component {

   state = {
      topTen : []
   }


   getLeaderBoard=()=>{
      let people = []

      for(let i = 1; i<11; ++i){
         let name = 'Person ' + i;
         let money = 20000 - i * 1000
         people.push({name, money})
      }
      this.setState({topTen: people})
   }

   componentDidMount(){
      this.getLeaderBoard()
   }


   render() {
      const { topTen } = this.state
      return (
         <div className='leaderBoardOuterContainer'>
            <div className='leaderBoardInnerContainer'>
            <h2 className='leaderBoardTitle'>
               Top-10:
            </h2>
            {
               topTen.map(({name,money},i)=>{
                  return(
                     <React.Fragment key={name}>
                        <div className={i===0?'topEntry':i===1? 'secondEntry': i===2? 'thirdEntry' :'entryContainer'}>
                           <div className='entryName'>{name}</div>
                           <div className='entryMoney'>{money}</div>
                           {i<2 && 
                              <Sparkle overflowPx={0} minSize={i===0?20:10} count={i===0? 50:30} flickerSpeed={'slowest'} fadeOutSpeed={1}/>
                           }
                        </div>
                        {
                           i>2 &&
                           <Divider />
                        }
                     </React.Fragment>
                  )
               })
            }
            </div>
         </div>
      )
   }
}
