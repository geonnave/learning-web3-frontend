import { useEffect, useState } from 'react'
import { ethers } from "ethers";
import usdcAbi from "./abis/usdc"
import apeAbi from "./abis/ape_nft"
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


function NFTFetcher({provider}) {
  const [queryState, setQueryState] = useState({
    tokenAddr: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
    tokenId: "8911",
  });

  const [resultState, setResultState] = useState({
    tokenName: "",
    image: undefined,
    imageUrl: "",
    metadata: {},
  });

  let fetchNFT = async () => {
    const nftContract = new ethers.Contract(queryState.tokenAddr, apeAbi, provider);

    console.log(nftContract);
    let tokenURI = await nftContract.tokenURI(queryState.tokenId);
    console.log("tokenURI", tokenURI)
    let res = await fetch(`https://ipfs.io/ipfs/${tokenURI.replace("ipfs://", "")}`)
    if (!res.ok) {
      setResultState({
        ...resultState,
        tokenName: "Error fetching token data",
      })
      return;
    }

    let data = await res.json();
    let imgUrl = `https://ipfs.io/ipfs/${data["image"].replace("ipfs://", "")}`;
    console.log("imgUrl", imgUrl)

    setResultState({
      tokenName: await nftContract.name(),
      image: "",
      imageUrl: imgUrl,
      metadata: {
        symbol: await nftContract.symbol(),
        tokenURI: tokenURI,
      }
    })
  }

  useEffect(() => {
    fetchNFT();
  }, []);

  let handleSubmit = async (event) => {
    console.log(queryState)
    fetchNFT();
  }

  let setTokenAddr = (event) => {
    setQueryState({...queryState, tokenAddr: event.target.value})
  }

  let setTokenId = (event) => {
    setQueryState({...queryState, tokenId: event.target.value})
  }

  let setUserAddr = (event) => {
    setQueryState({...queryState, userAddr: event.target.value})
  }

  return <div>
    <br/>
    <label>
      NFT Contract Address:
      <input type="text" value={queryState.tokenAddr} onChange={setTokenAddr} />
    </label>
    <br/>
    <br/>
    <label>
      NFT Token ID:
      <input type="text" value={queryState.tokenId} onChange={setTokenId} />
    </label>
    <br/>
    <br/>
    <button onClick={handleSubmit}>Fetch NFT</button>
    <p>
      Result: {JSON.stringify(resultState)}
    </p>
    <img src={resultState.imageUrl} />
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
          {providerState.isConnected ? <NFTFetcher provider={providerState.provider}/> : ""}
      </main>
    </div>
  )
}

export default App
