import React, {Component} from 'react';
import {Routes, Route} from "react-router-dom";
import Home from "./views/Home/Home";
import {
  Utils,
  date2CountdownString,
} from './utils/utils';
class MyRoutes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nativeBalance: 0,
      contractBalance: 0,
      barrelFullTime: 'Aug 09 2000 14:00:00 UTC'
    }
  }
  async componentDidMount() {
    this.checkContract()
    this.timer = setInterval(()=>{this.checkContract()}, 1000);
  }

  componentDidUpdate = (prevProps) =>{
    if(prevProps.address !== this.props.address){
      this.checkContract()
    }
  }

  checkContract=()=>{
    if(Utils.web3 &&
      Utils.roastedBeef &&
      this.props.address){
      clearInterval(this.timer);
      this.getContractStats();
    }
  }

  getContractStats= async ()=>{
    clearTimeout(this.timeout)
    try{
      const nativeBalance = Utils.web3.utils.fromWei(await Utils.web3.eth.getBalance(this.props.address))
      const contractBalance = Utils.web3.utils.fromWei(await Utils.web3.eth.getBalance(Utils.roastedBeef._address))
      const eggsPerMiner = await Utils.roastedBeef.methods.EGGS_TO_HATCH_1MINERS().call();
      const myMiners = await Utils.roastedBeef.methods.hatcheryMiners(this.props.address).call();
      const myEggs = await Utils.roastedBeef.methods.getMyEggs().call({from:this.props.address});
      let myEarns = 0;
      let hireEstimates = 0;
      let bnbPerHour = 0;
      let barrelFullTime = 'Aug 09 2000 14:00:00 UTC';
      if(myEggs > 0){
        myEarns = Utils.web3.utils.fromWei(await Utils.roastedBeef.methods.calculateEggSell(myEggs).call());
        const estimateEggs = await Utils.roastedBeef.methods.calculateEggBuySimple(Utils.web3.utils.toWei('0.1')).call();
        hireEstimates = estimateEggs/eggsPerMiner;
        const lastHatchTime = await Utils.roastedBeef.methods.lastHatch(this.props.address).call();

        if(contractBalance*1 > 0){
          const curTime = new Date().getTime();
          bnbPerHour = myEarns/(curTime/ 1000 - lastHatchTime) * 3600;
        }
        if(Number(bnbPerHour) < 0.000001){
          bnbPerHour = 0;
        }
        if(Number(myEarns) < 0.000001){
          myEarns = 0;
        }

        barrelFullTime = date2CountdownString(new Date((parseInt(lastHatchTime) + 86400) * 1000));

      }



      this.setState({
        contractBalance:contractBalance,
        nativeBalance: nativeBalance,
        myMiners: myMiners,
        myEarns: myEarns,
        hireEstimates: hireEstimates,
        bnbPerHour: bnbPerHour,
        barrelFullTime:barrelFullTime
      })
    }catch(e){
      console.log(e);
    }

    this.timeout = setTimeout(()=>{
      this.getContractStats();
    }, 3000)
  }

  render(){
    return(
        <Routes>
          <Route index element={
              <Home
                address={this.props.address}
                nativeBalance={this.state.nativeBalance}
                myMiners={this.state.myMiners}
                myEarns={this.state.myEarns}
                hireEstimates={this.state.hireEstimates}
                lastHatchTime={this.state.lastHatchTime}
                bnbPerHour={this.state.bnbPerHour}
                contractBalance={this.state.contractBalance}
                barrelFullTime={this.state.barrelFullTime}
                disconnect={this.props.disconnect}
                reconnect={this.props.reconnect}
                readWeb3Instance={this.props.readWeb3Instance}
              />
          }/>
        </Routes>
    )
  }
}

export default MyRoutes;
