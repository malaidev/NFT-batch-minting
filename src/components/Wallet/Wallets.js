import React from 'react';
import { Row, Col } from 'antd';
import {CloseOutlined} from '@ant-design/icons'
import WalletItem from './WalletItem';
import { WALLETS } from './config';
import './Wallets.scss';

const Wallets = (props) => {
  return (
    <div className="wallet">
      <CloseOutlined className="close" onClick={() => {
          props.toggleDisplayWalletModal();
        }}/>
      <h1>CONNECT WALLET</h1>
      <Row justify="space-around" align="middle" gutter={{ xs: 5, sm: 5, md: 16 }}>
        {Object.values(WALLETS).map((item) => {
          return (
            <Col xs={24} sm={24} md={24} key={item.id}>
              <WalletItem
                wallet={item}
                reconnect={props.reconnect}
                address={props.address}
                readWeb3Instance={props.readWeb3Instance}
                toggleDisplayWalletModal={props.toggleDisplayWalletModal}
              />
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default Wallets;
