import { useState } from 'react'
import { ethers } from "ethers";
import logo from './logo.svg'
import './App.css'


function App() {
  const [count, setCount] = useState(0)
  const [isConnected, setIsConnected] = useState({selectedAddress: undefined});

  let connectToMetamask = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setIsConnected({ selectedAddress: accounts[0] });
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>Hello React + Ethereum!</p>
        <p>
          {/* <button type="button" onClick={() => setCount((count) => count + 1)}> */}
          <button type="button" onClick={connectToMetamask}>
            Connect to Metamask: {isConnected.selectedAddress === undefined ? "disconneted" : isConnected.selectedAddress}
          </button>
        </p>
      </header>
      <main>
        <p>
          Content goes here.
        </p>
      </main>
    </div>
  )
}

export default App
