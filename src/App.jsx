import { useEffect, useState } from 'react'
import { ethers } from "ethers";
import usdcAbi from "./abis/usdc"
import './App.css'


function BalanceFetcher({provider}) {
  const [queryState, setQueryState] = useState({
    tokenAddr: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    userAddr: "0x9bf2d9db244785131b13e85625fcf5ab1dd5d9c3",
  });

  const [resultState, setResultState] = useState({
    tokenName: "",
    userBalance: "",
    userBalanceHuman: "",
  });

  let fetchBalance = async () => {
    const usdcContract = new ethers.Contract(queryState.tokenAddr, usdcAbi, provider);

    let name = await usdcContract.name();
    let balance = await usdcContract.balanceOf(queryState.userAddr)
    let decimals = await usdcContract.decimals()
    let balanceHuman = balance / (10**decimals)

    setResultState({
      tokenName: name,
      userBalance: balance,
      userBalanceHuman: balanceHuman,
    })
  }

  // useEffect(() => {
  //   fetchBalance();
  // }, []);

  let handleSubmit = async (event) => {
    console.log(queryState)
    fetchBalance();
  }

  let setTokenAddr = (event) => {
    console.log(event)
    setQueryState({...queryState, tokenAddr: event.target.value})
  }

  let setUserAddr = (event) => {
    setQueryState({...queryState, userAddr: event.target.value})
  }

  return <div>
    <br/>
    <label>
      Token ERC20 Address:
      <input type="text" value={queryState.tokenAddr} onChange={setTokenAddr} />
    </label>
    <br/>
    <br/>
    <label>
      User Address:
      <input type="text" value={queryState.userAddr} onChange={setUserAddr} />
    </label>
    <br/>
    <br/>
    <button onClick={handleSubmit}>Fetch Balance</button>
    <p>
      Balanço: {resultState.userBalanceHuman.toString()}
    </p>
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
        <p>Learning Web3</p>
        <div>
          Metamask is {providerState.isConnected ? "connected" : "disconnected"}
        </div>
        <button type="button" onClick={connectToMetamask} disabled={providerState.isConnected}>connect</button>
        <p>
          {providerState.isConnected ? `Connected Address: ${providerState.selectedAddress}` : ""}
        </p>
      </header>
      <main>
          {providerState.isConnected ? <BalanceFetcher provider={providerState.provider}/> : ""}
      </main>
    </div>
  )
}

export default App
