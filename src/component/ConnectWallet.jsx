import React, { useEffect, useState } from "react";
import ErrorToaster from "./ErrorToaster";

function ConnectWallet() {
  const { ethereum } = window;
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);

  const copyContent = async text => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.log(err);
    }
  }

  function AddressShortner({ address }) {
    address = String(address);
    const shortAddress = `${address.slice(0, 5)}...${address.slice(-4)}`;

    return (
      <span className="space-x-1">
        <span>{shortAddress}</span>
        <i className="fa-regular fa-copy cursor-pointer" title={address} onClick={() => copyContent(address)}></i>
      </span>
    );
  }

  const fetchWalletBalance = async walletAddress => {
    try {
      const res = await ethereum.request({
        method: "eth_getBalance",
        params: [walletAddress, "latest"]
      });
      console.log("res:", res);
      const walletBalance = parseFloat(parseInt(res) / 1e18).toFixed(15);
      setWalletBalance(walletBalance);
    } catch (err) {
      console.log("err:", err);
      sessionStorage.clear();
      window.location.reload();
    }
  }

  const connectMetaMask = async () => {
    if (ethereum) {
      setIsLoading(true);

      try {
        const res = await ethereum.request({ method: "eth_requestAccounts" });
        console.log("res:", res);
        const walletAddress = res[0];
        setWalletAddress(walletAddress);
        fetchWalletBalance(walletAddress);
        sessionStorage.setItem("wallet", walletAddress);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.log("err:", err);
      }
    } else {
      setErrorMessage("Install MetaMask first");
    }
  }

  useEffect(() => {
    if (ethereum) {
      console.log("MetaMask is installed:", ethereum);
    } else {
      alert("To use this website install MetaMask first");
    }
  }, []);

  useEffect(() => {
    const walletAddress = sessionStorage.getItem("wallet");

    if (walletAddress) {
      setWalletAddress(walletAddress);
      fetchWalletBalance(walletAddress);
    }
  }, []);

  useEffect(() => {
    if (ethereum) {
      ethereum.on("accountsChanged", changedAddress => {
        sessionStorage.setItem("wallet", changedAddress);
        window.location.reload();
      });
    }
  }, []);

  return (
    <div>
      {
        (errorMessage !== '') &&
        <ErrorToaster
          message={errorMessage}
          setMessage={setErrorMessage}
        />
      }

      <div className="center">
        <div className="p-6 flex flex-col gap-4 rounded-sm shadow shadow-slate-400">
          <div className="text-2xl font-semibold">Connection to MetaMask using window.ethereum</div>
          {
            (!walletAddress && isLoading) &&
            <button className="cursor-not-allowed px-6 py-2 self-center duration-150 rounded-sm text-white bg-blue-700">Connecting...</button>
          }
          {
            (!walletAddress && !isLoading) &&
            <button className="px-6 py-2 self-center duration-150 rounded-sm text-white bg-blue-600 hover:bg-blue-700" onClick={connectMetaMask}>Connect MetaMask</button>
          }
          {
            walletAddress &&
            <div className="font-semibold space-x-1 text-center">
              <span className="text-lg">Wallet Address:</span>
              <span className="text-slate-600"><AddressShortner address={walletAddress} /></span>
            </div>
          }
          {
            walletAddress &&
            <div className="font-semibold space-x-1 text-center">
              <span className="text-lg">Wallet Balance:</span>
              <span className="text-slate-600">{walletBalance} ETH</span>
            </div>
          }
          {
            walletAddress &&
            <button className="px-6 py-2 self-center duration-150 rounded-sm text-white bg-red-600 hover:bg-red-700" onClick={() => {
              sessionStorage.clear();
              sessionStorage.clear();
              window.location.reload();
            }}>Disconnect</button>
          }
        </div>
      </div>
    </div>
  );
}

export default ConnectWallet;
