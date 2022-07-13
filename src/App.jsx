import { useEffect, useState } from 'react'
import { ethers } from "ethers";
import usdcAbi from "./abis/usdc"
// import { BigNumberish } from 'ethers';
import logo from './logo.svg'
import './App.css'

function ContractReader({provider}) {
  const [contractState, setContractState] = useState({
    name: "",
    ethBalance: "",
    balanceHuman: "",
    balance: "",
    decimals: -1
  });

  // You can also use an ENS name for the contract address
  const usdcAddress = "0x7079f3762805CFf9C979a5bDC6f5648bCFEE76C8";
  // The Contract object
  const usdcContract = new ethers.Contract(usdcAddress, usdcAbi, provider);

  const userAddr = "0x0fCCe9C7c1a7C31653fd4C61dAF818d9705Dbb09";

  const signer = provider.getSigner()

  useEffect(() => {
    async function getContractInfo() {
      let name = await usdcContract.name();
      let balance = await usdcContract.balanceOf(userAddr)
      let decimals = await usdcContract.decimals()
      let balanceHuman = balance / (10**decimals)

      let ethBalance = await provider.getBalance(userAddr)
      ethBalance = ethers.utils.formatEther(ethBalance)

      setContractState({
        name: name,
        balance: balance,
        balanceHuman: balanceHuman,
        ethBalance: ethBalance,
        decimals: decimals
      })
    }
    getContractInfo();
  }, []);

  let sendEth = async () => {
    console.log("Called sendEth")
    const tx = signer.sendTransaction({
        to: "0x0fCCe9C7c1a7C31653fd4C61dAF818d9705Dbb09",
        value: ethers.utils.parseEther("0.001")
    });
    console.log("Will send tx")
    console.log(tx)
    // await tx()
  }

  return <div>
    <p>
      Contrato: {contractState.name}
    </p>
    <p>
      Carteira: {userAddr}
    </p>
    <p>
      Balanço: {contractState.balanceHuman.toString()}
    </p>
    <p>
      Balanço raw: {contractState.balance.toString()}
    </p>
    <p>
      Balanço eth: {contractState.ethBalance}
    </p>
    <button type="button" onClick={sendEth}>
      Send eth
    </button>
  </div>
}


function App() {
  const [providerState, setProviderState] = useState({isConnected: false, selectedAddress: undefined});

  let connectToMetamask = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setProviderState({ isConnected: true, selectedAddress: accounts[0], provider: provider });
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>Hello React + Ethereum!</p>
        <button type="button" onClick={connectToMetamask}>
            Connect to Metamask {providerState.isConnected ? "(connected)" : "(disconnected)"}
          </button>
        <p>
          Address: {providerState.selectedAddress}
        </p>
      </header>
      <main>
          {providerState.isConnected ? <ContractReader provider={providerState.provider}/> : "ContractReader will appear here"}
      </main>
    </div>
  )
}

export default App
