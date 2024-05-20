import React, { useEffect, useState } from "react";
import { Web3 } from "web3";
import { truncate, truncateReverse } from "../../truncate";
import ChainList from "../json/chain.json";
import USDTAbi from "../abis/USDT.json";
export default function Login() {
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [accountBalance, setAccountBalance] = useState(null);
  const [chainID, setChainID] = useState(null);
  const [usdtInfo, setUsdtInfo] = useState(null);
  useEffect(() => {
    if (window.ethereum) {
      getAccountsInfo();
    }
  }, [connectedAccount]);
  useEffect(() => {
    if (chainID != 1) {
      window.ethereum
        .request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x1" }],
        })
        .then(() => {
          getAccountsInfo();
        })
        .catch((error) => {});
    }
  }, [chainID]);
  const getAccountsInfo = async () => {
    const web3 = new Web3(window.ethereum);

    const balance = await web3.eth.getBalance(connectedAccount);
    const chainID = await web3.eth.getChainId();

    setChainID(chainID.toString());
    setAccountBalance(web3.utils.fromWei(balance, "ether"));
    let UsdtContract = new web3.eth.Contract(
      USDTAbi,
      "0xdAC17F958D2ee523a2206206994597C13D831ec7"
    );
    const USDTbalance = await UsdtContract.methods
      .balanceOf(connectedAccount)
      .call();

    const USDTSymbol = await UsdtContract.methods.symbol().call();
    if (web3.utils.fromWei(USDTbalance, "ether")) {
      setUsdtInfo({
        balance: web3.utils.fromWei(USDTbalance, "ether"),
        symbol: USDTSymbol,
      });
    }
  };
  const connectMetamask = async () => {
    //check metamask is installed
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3.eth.getAccounts();
      setConnectedAccount(accounts[0]);
    } else {
      let metamaskAppDeepLink =
        "https://metamask.app.link/dapp/" + window.location.href;
      window.open(metamaskAppDeepLink);
    }
  };
  const findNetworkByChainId = (chainId) => {
    const network = ChainList.find((network) => network.chainId == chainId);
    if (network) {
      return network.nativeCurrency.symbol;
    }
  };
  return (
    <div className="login-container">
      {connectedAccount ? (
        <>
          <button
            onClick={() => {
              setConnectedAccount(null);
            }}
          >
            {truncate(connectedAccount, 4) +
              truncateReverse(connectedAccount, 6)}
          </button>
          <div className="text">
            {accountBalance + " ".repeat(10) + findNetworkByChainId(chainID)}
          </div>
          <div className="text">
            {usdtInfo?.balance + " ".repeat(10) + usdtInfo?.symbol}
          </div>
        </>
      ) : (
        <button onClick={connectMetamask}>Connect Wallet</button>
      )}
    </div>
  );
}
