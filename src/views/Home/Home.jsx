import React from "react";
import {default as numeral} from 'numeral';
import { Input, message, Modal } from 'antd';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import CountUp from 'react-countup';
import Wallets from "../../components/Wallet/Wallets";
import { Utils, checkTime, reduceAddress, RELEASE_TIME} from "../../utils/utils";
import logo from "../../assets/logo.png";
import twitter from "../../assets/twitter.png";
import bscscan from "../../assets/bscscan.png";
import telegram from "../../assets/telegram.png";
import grill from "../../assets/grill.png";
import WP from "../../assets/wp.pdf";

import "./Home.scss";
import Countdown from "../../components/Countdown/Countdown";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "xxx",
      input: 0,
      blinkMyMiners: false,
      blinkMyEarns: false,
      myEarnsStart: 0,
      myEarns:this.props.myEarns
    };

    this.render = this.render.bind(this);
  }

  componentDidUpdate = (prevProps)=>{
    if(this.props.myMiners !== prevProps.myMiners){
      this.setState({blinkMyMiners: true},()=>{
        setTimeout(()=>{
          this.setState({
            blinkMyMiners: false
          })
        }, 2000)
      })
    }

    if(this.props.myEarns !== prevProps.myEarns){
      this.setState({
        myEarns: this.props.myEarns,
        blinkMyEarns: true
      },()=>{
        setTimeout(()=>{
          this.setState({
            myEarnsStart: this.props.myEarns,
            blinkMyEarns: false
          })
        }, 3000)
      })
    }
  }

  changeInput = (val) =>{
    if(isNaN(val)){
      return;
    }
    this.setState({
      input: val
    })
  }

  toggleDisplayWalletModal = () => {
    this.setState({
      displayWalletModal: !this.state.displayWalletModal,
    });
  };

  render() {
    const { address, hireEstimates, bnbPerHour, myEarns, barrelFullTime, myMiners, contractBalance,nativeBalance } = this.props;
    const refLink = `https://roastedbeef.io/#/?ref=${address}`;

    return (
      <div className={"home"}>
        <div className={"container"}>
          <div className={"header"}>
            <div className="walletWrapper" align="middle" onClick={() => {
                      if(!this.props.address || this.props.address === '0x000000000000000000000000000000000000dead'){
                        this.toggleDisplayWalletModal();
                      }
                      else{
                        this.props.disconnect()
                      }

                    }}>
                {!this.props.address || this.props.address === '0x000000000000000000000000000000000000dead' ? (
                  <span
                    className="address"

                  >
                    Connect Wallet
                  </span>
                ) : (
                  <span className="address">{reduceAddress(address)}</span>
                )}
            </div>
            {/*<div className={"walletWrapper"}>*/}
            {/*  {*/}
            {/*    address? reduceAddress(address) : "Connect Wallet"*/}
            {/*  }*/}
            {/*</div>*/}
            <img src={logo} alt={'logo'} className={"logo"}/>
            <div className={"socialMedias"}>
              <a href={"https://www.bscscan.com/address/0xd81F5DB384d604D85D158FCb8E00341Aff200E22"} target="_blank" rel="noopener noreferrer">
                <img src={bscscan} alt={'bscscan'}/>
              </a>
              <a href={"https://twitter.com/roastbeefminer"} target="_blank" rel="noopener noreferrer">
                <img src={twitter} alt={'twitter'}/>
              </a>
              <a href={"https://t.me/roastbeefgroup"} target="_blank" rel="noopener noreferrer">
                <img src={telegram} alt={'telegram'}/>
              </a>
            </div>
          </div>

          <Modal
            visible={this.state.displayWalletModal}
            onCancel={this.toggleDisplayWalletModal}
            footer={null}
            centered={true}
            wrapClassName={'customModal'}
          >
            <Wallets
              toggleDisplayWalletModal={this.toggleDisplayWalletModal}
              address={address}
              reconnect={this.props.reconnect}
              readWeb3Instance={this.props.readWeb3Instance}
            />
          </Modal>
          <p className={"slogan"}>
            The BNB Reward Pool with the 10% daily return and 13% referral rewards and lowest dev fee
          </p>

          {
            checkTime() ? null :
              <div className={"countdownWrapper"}>
                <div>
                  <Countdown date={RELEASE_TIME}/>
                </div>
                <div>{RELEASE_TIME}</div>
              </div>
          }
          <div className={"buttonGroup"}>
            <a href={WP} target="_blank" rel="noopener noreferrer">
              <div className={"whitepaper"}>
                Whitepaper
              </div>
            </a>
          </div>


          <div className={"mainContent"}>
            <div className={"box leftBox"}>
              <div className={"dataRow"}>
                <div className={"name"}>
                  Contract
                </div>
                <div className={"value"}>
                  {numeral(contractBalance).format('0,0.[0000]')} BNB
                </div>
              </div>
              <div className={"dataRow"}>
                <div className={"name"}>
                  Wallet
                </div>
                <div className={"value"}>
                  {numeral(nativeBalance).format('0,0.[0000]')} BNB
                </div>
              </div>
              <div className={"dataRow"}>
                <div className={"name"}>
                  Your Beef
                </div>
                <div className={this.state.blinkMyMiners ? "value blink_me" : "value"}>
                  {numeral(myMiners).format('0,0.[0000]')} Beef
                </div>
              </div>

              <Input
                value={`${this.state.input}`}
                onChange={(e)=>{this.changeInput(e.target.value)}}
                className={"antInput"}
                suffix={<span className={"suffix"}>BNB</span>}
              />
              <div className={"buyButton"} onClick={()=>{this.buy()}}>
                ROAST BEEF
              </div>
              <div className={"actionWrapper"}>
                <div className={"dataRow"}>
                  <div className={"name"}>
                    Your Rewards
                  </div>
                  <div className={this.state.blinkMyEarns ? "value blink_me" : "value"}>
                    <CountUp
                      start={this.state.myEarnsStart}
                      end={this.state.myEarns}
                      duration={2}
                      separator=","
                      decimals={6}
                      decimal="."
                      suffix="BNB"
                    />
                    {/*{numeral(myEarns).format('0,0.[000000]')} BNB*/}
                  </div>
                </div>
                <div className={"actionButtons"}>
                  {/*<Tooltip title={"Compound your earning beef"}>*/}
                    <div onClick={()=>{this.compound()}}>
                      RE-ROAST
                    </div>
                  {/*</Tooltip>*/}
                   <div onClick={()=>{this.withdraw()}}>
                      EAT BEEF
                    </div>
                </div>
              </div>
            </div>

            <div className={"box rightBox"}>
            <div className={"contractInfo"}>
              <img src={grill} alt={"grill"}/>
              <div className={"data"}>
                <h1>Nutrition Facts</h1>
                <div className={"dataRow"}>
                <div className={"name"}>
                  Daily Return
                </div>
                <div className={"value"}>
                  10%
                </div>
              </div>
                <div className={"dataRow"}>
                <div className={"name"}>
                  APR
                </div>
                <div className={"value"}>
                  3650%
                </div>
              </div>
                <div className={"dataRow"}>
                <div className={"name"}>
                  Dev Fee
                </div>
                <div className={"value"}>
                  3%
                </div>
              </div>
              </div>
            </div>
            <div className={"referral"}>
              <h1>Referral Link</h1>
              <p>Earn 13% of the BNB used to roast beef from anyone who uses your referral link</p>
              <div className={"refWrapper"}>
                <div className={"referralLink"}>
                {
                  address? refLink : "Connect Wallet"
                }
              </div>
              <CopyToClipboard text={refLink}
                onCopy={() => {message.info("Copied to clipboard")}}>
                <div className={"copyButton"}>
                  COPY
                </div>
              </CopyToClipboard>
              </div>

            </div>
          </div>
          </div>

        </div>

      </div>
    );
  }

  buy = () =>{
    if(!checkTime()){
      message.info('Coming Soon');
      return;
    }
    if(!this.props.address || this.props.address === '0x000000000000000000000000000000000000dead'){
      this.toggleDisplayWalletModal();
      return;
    }
    if(Number(this.props.nativeBalance) < Number(this.state.input)){
      message.warning('Insufficient BNB');
      return;
    }
    if(this.state.input * 1 < 0.01){
      message.warning('Minimum deposit amount 0.01 BNB');
      return;
    }
    try{
      const callValue = Utils.web3.utils.toWei(this.state.input);
      const urlParams = new URLSearchParams(window.location.hash.split('?')[1])
      let affrAddr = urlParams.get('ref');

      let inviter = Utils.owner;
      if(Utils.web3.utils.isAddress(affrAddr)){
        inviter = affrAddr;
      }
      console.log(inviter);
      Utils.roastedBeef.methods.buyEggs(inviter).send({
        from: this.props.address,
        value:callValue,
      })
      .on('transactionHash', (hash)=>{
        console.log(hash);
        message.info("Transaction sent",3);
      })
      .once('receipt', res => {

        message.info("Transaction confirmed",3);
      })
      .then(res => {

      })
      .catch(err => console.log(err))
    }catch(e){
      console.log(e);
    }
  }

  compound = async () =>{
    if(!checkTime()){
      message.info('Coming Soon!');
      return;
    }
    if(!this.props.address || this.props.address === '0x000000000000000000000000000000000000dead'){
      this.toggleDisplayWalletModal();
      return;
    }
    if(this.props.nativeBalance * 1 < 0.001){
      message.warning('Insufficient Gas');
      return;
    }
    if(this.props.myEarns * 1 < 0.01){
      message.warning('Minimum Re-Roast amount must be greater than 0.01 BNB');
      return;
    }
    try{
      const urlParams = new URLSearchParams(window.location.hash.split('?')[1])
      let affrAddr = urlParams.get('ref');

      let inviter = Utils.owner;
      if(Utils.web3.utils.isAddress(affrAddr)){
        inviter = affrAddr;
      }
      console.log(inviter);
      Utils.roastedBeef.methods.hatchEggs(inviter).send({
        from: this.props.address,
      })
      .on('transactionHash', (hash)=>{
        console.log(hash);
        message.info("Transaction sent",3);
      })
      .once('receipt', res => {

        message.info("Transaction confirmed",3);
      })
      .then(res => {

      })
      .catch(err => console.log(err))
    }catch(e){
      console.log(e);
    }
  }

  withdraw = () =>{
    if(!checkTime()){
      message.info('Coming Soon!');
      return;
    }
    if(!this.props.address || this.props.address === '0x000000000000000000000000000000000000dead'){
      this.toggleDisplayWalletModal();
      return;
    }
    if(this.props.nativeBalance * 1 < 0.001){
      message.warning('Insufficient Gas');
      return;
    }
    try{

      Utils.roastedBeef.methods.sellEggs().send({
        from: this.props.address,
      })
      .on('transactionHash', (hash)=>{
        console.log(hash);
        message.info("Transaction sent",3);
      })
      .once('receipt', res => {

        message.info("Transaction confirmed",3);
      })
      .then(res => {

      })
      .catch(err => console.log(err))
    }catch(e){
      console.log(e);
    }
  }
}

export default Home;
