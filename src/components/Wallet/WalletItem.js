import React from 'react';
import {message} from "antd";

const connect = () => {
  if (!window.web3) {
    console.log('metamask not installed');
    message.info('Please use browser with BSC wallet installed.')
    return;
  }
  try {
    window.web3.eth.requestAccounts();
  } catch (e) {
    console.log(e);
  }
}

const WalletItem = (props) => {
  return (
    <div
      onClick={() => {
         if (!window.web3) {
          console.log('metamask not installed');
          message.info('Please use browser with BSC wallet installed to open the site.')
          return;
        }
        if (props.wallet.provider !== sessionStorage.wallet) {
          sessionStorage.wallet = props.wallet.provider;
          props.readWeb3Instance(props.wallet);
        } else {
          if (props.address === '0x000000000000000000000000000000000000dead') {
            props.reconnect();
          } else {
            connect();
          }
        }
        props.toggleDisplayWalletModal();
      }}
      className="walletItem"
    >
      {/*<img*/}
      {/*  src={`${process.env.PUBLIC_URL}/static/images/wallet/hoveredWalletItemBg.png`}*/}
      {/*  alt="png"*/}
      {/*  className="hoveredWalletItemBg"*/}
      {/*/>*/}
      <img
        src={`${process.env.PUBLIC_URL}/images/wallet/${props.wallet.id}.png`}
        alt="png"
        className="walletImage"
      />
      <h2>{props.wallet.name}</h2>
    </div>
  );
};

export default WalletItem;
