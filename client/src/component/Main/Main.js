import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

import Trading from '../Trading/Trading'
import { Context } from '../Context/Context'
import Axios from '../Helpers/Axios'


export default class Main extends Component {
    static contextType = Context

    state={
        cryptos: [],
        currentCrypto: {},
        isOpen: false,
        mode: null
    }


    openDialog=()=>{
        this.setState({isOpen:true})
    }

    closeDialog=()=>{
        this.setState({isOpen:false})
    }

    getCryptos=async()=>{
        const success = await Axios.get('/api/crypto/cryptos')
        this.setState({
            cryptos: success.data, 
            currentCrypto: success.data[0], 
            })
    }
    
    makeCurrent=(name)=>{
        const cryptos = [...this.state.cryptos]
        const currentCrypto = cryptos.filter(entry => entry.name === name)
        this.setState({currentCrypto: currentCrypto[0]})
    }

    handleBuy=async(name)=>{
        await this.makeCurrent(name)
        this.openDialog()
        this.setState({mode: 'buy'})
        console.log('Buying')
        console.log(this.state.currentCrypto)
    }

    handleSell=async(name)=>{
        await this.makeCurrent(name)
        this.openDialog()
        this.setState({mode: 'sell'})
        console.log('Selling')
        console.log(this.state.currentCrypto)
    }

    componentDidMount(){
        this.getCryptos()
    }

    render() {
        const { cryptos, isOpen, currentCrypto, mode } = this.state
        const {isAuth:{auth, user}} = this.context
        return (
            <div style={{display:'flex', alignItems:'center'}}>
                <Trading 
                    isOpen={isOpen} 
                    currentCrypto={currentCrypto} 
                    closeDialog={this.closeDialog}
                    mode={mode}
                />
                {cryptos && cryptos.length && 
                    <TableContainer>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Name</TableCell>
                                    <TableCell align="center">Symbol</TableCell>
                                    <TableCell align="center">Market Cap</TableCell>
                                    <TableCell align="center">Price</TableCell>
                                    <TableCell align="center">% 24hr</TableCell>
                                    <TableCell align="center">Buy</TableCell>
                                    <TableCell align="center">Sell</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                        {cryptos.map(({name, symbol, market_cap, id, image, current_price, price_change_percentage_24h}) => {
                            return (
                                <TableRow key={name}>
                                    <TableCell component="th" scope="row">
                                        <div style={{display:'flex', alignItems:'center'}}>
                                            <img alt={name} src={image} style={{width:'30px'}}/>
                                            &nbsp;
                                            {name}
                                        </div>
                                    </TableCell>
                                    <TableCell align="center">{symbol}</TableCell>
                                    <TableCell align="center">{market_cap}</TableCell>
                                    <TableCell align="center">{current_price}</TableCell>
                                    <TableCell align="center">{price_change_percentage_24h > 0
                                    ? <div style={{color:'green', display:'flex', alignItems:'center', justifyContent:'center'}}><ArrowDropUpIcon />{price_change_percentage_24h}</div>
                                    : <div style={{color:'red', display:'flex', alignItems:'center', justifyContent:'center'}}><ArrowDropDownIcon />{price_change_percentage_24h}</div>
                                    }</TableCell>
                                    <TableCell align="center"><Button onClick={()=>this.handleBuy(name)} disabled={!user || !auth? true: false}>Buy</Button></TableCell>
                                    <TableCell align="center"><Button onClick={()=>this.handleSell(name)} disabled={!user || !auth? true: false}>Sell</Button></TableCell>
                                </TableRow>
                            )
                        })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                }
            </div>
        )
    }
}