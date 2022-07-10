export const CHAINs = {
  'undefined':{
    id:56,
    name:'BSC',
    nativeToken:"BNB",
    swap:[
      {
        name: 'PancakeSwap',
        swapLink:'https://pancakeswap.finance/swap',
        addLiquidityLink:'https://pancakeswap.finance/add',
      },
    ]

  },
  '56':{
    id:56,
    name:'BSC',
    nativeToken:"BNB",
    swap:[
      {
        name: 'PancakeSwap',
        swapLink:'https://pancakeswap.finance/swap',
        addLiquidityLink:'https://pancakeswap.finance/add',
      },
    ]
  },

  '97':{
    id:97,
    name:'BSC',
    nativeToken:"BNB",
    swap:[
      {
        name: 'PancakeSwap',
        swapLink:'https://pancakeswap.finance/swap',
        addLiquidityLink:'https://pancakeswap.finance/add',
      },
    ]
  }
}

export const getChainName = (id) =>{
  return CHAINs[id] === undefined ? 'Network Error' : CHAINs[id].name;
}


export async function addNetwork(id) {

  let networkData;

  switch (id) {

    //bsctestnet

    case 66:

      networkData = [

        {

          chainId: '0x42',

          chainName: "OKExChain Mainnet",

          rpcUrls: ["https://exchainrpc.okex.org"],

          nativeCurrency: {

            name: "OKT",

            symbol: "OKT",

            decimals: 18,

          },

          blockExplorerUrls: ["https://www.oklink.com/okexchain"],

        },

      ];

      break;

    //bscmainet

    case 56:

      networkData = [

        {

          chainId: "0x38",

          chainName: "BSCMAINET",

          rpcUrls: ["https://bsc-dataseed1.binance.org"],

          nativeCurrency: {

            name: "BINANCE COIN",

            symbol: "BNB",

            decimals: 18,

          },

          blockExplorerUrls: ["https://bscscan.com/"],

        },

      ];

      break;

      case 97:

      networkData = [

        {

          chainId: "0x61",

          chainName: "BSCTest",

          rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],

          nativeCurrency: {

            name: "BINANCE COIN",

            symbol: "BNB",

            decimals: 18,

          },

          blockExplorerUrls: ["https://testnet.bscscan.com/"],

        },

      ];

      break;

    default:

      break;

  }

  // agregar red o cambiar red

  return window.ethereum.request({

    method: "wallet_addEthereumChain",

    params: networkData,

  });

}


export async function connect() {
  if(!window.ethereum){
    console.log("metamask not installed");
    return;
  }
  window.ethereum.enable()

}
