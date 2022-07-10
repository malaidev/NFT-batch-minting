import React, { Component } from 'react';
import {message} from 'antd';
import detectEthereumProvider from '@metamask/detect-provider';
import MyRoutes from "./routes";
import {Utils, NETWORK_ID} from './utils/utils';
import {addNetwork} from './utils/chainsConfig';


import './App.scss';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			lang:"en",
			address: null,
		}
	}

	async componentDidMount() {
		this.readWeb3Instance();

		if (typeof window.ethereum !== 'undefined') {
			window.ethereum.on('accountsChanged', (accounts)=>{
				this.readWeb3Instance();
			})
			window.ethereum.on('chainChanged', (accounts)=>{
				console.log("chainChanged");
				window.location.reload();
			})
		}
		else if (typeof window.web3 !== 'undefined') {
			console.log(window.web3);
		}

    message.config({
      maxCount: 2,
    })
	}

  readWeb3Instance = async () =>{
    const provider = await detectEthereumProvider();

    if (provider) {
      // window.ethereum.enable();
      Utils.setWeb3(provider);
      provider
      .request({ method: 'eth_requestAccounts' })
      .then((accounts)=>{
        this.checkChainId(provider);
        this.handleAccountsChanged(accounts)
      })
      .catch((err) => {
        console.error(err);
      });
      provider.on('accountsChanged', (accounts)=>{this.handleAccountsChanged(accounts)})
      provider.on('chainChanged', (accounts)=>{
        window.location.reload();
      })
    }
    else {
      console.error('wait for MetaMask');
      Utils.setWeb3(false);
    }
  }

  handleAccountsChanged = (accounts) =>{
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log('Please connect to MetaMask.');

    } else if (accounts[0] !== this.state.address) {
      this.setState({
        address:accounts[0]
      })
    }
  }

  checkChainId = (web3) =>{
    if(parseInt(web3.chainId, 16) !== NETWORK_ID){
      addNetwork(NETWORK_ID);
    }
  }

  disconnect = () => {
    const tempAddress = this.state.address;
    this.setState({
      address: '0x000000000000000000000000000000000000dead',
      tempAddress: tempAddress,
    });
  };

  reconnect = () => {
    this.setState({
      address: this.state.tempAddress,
    });
  };


	render() {
		return (
  			<div className="App">
  				<MyRoutes
  					address={this.state.address} disconnect={this.disconnect} reconnect={this.reconnect} readWeb3Instance={this.readWeb3Instance}/>
  			</div>
		);
	}
}

export default App;
