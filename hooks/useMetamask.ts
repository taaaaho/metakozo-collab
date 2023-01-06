import { ethers } from 'ethers'
import { useContext, useState } from 'react'

import { MetamaskContext } from '../context/MetamaskContext'
import artifact from '../artifacts/MetaKozo.json'
import detectEthereumProvider from '@metamask/detect-provider'
import { useToaster } from './useToaster'
import useContract from './useContract'
import { ContractContext } from '../context/ContractContext'

declare var window: any

export type Metamask = {
  provider: ethers.providers.Web3Provider
  signer: ethers.providers.JsonRpcSigner
  contract: ethers.Contract
}

const useMetamask = (): {
  connectMetamask: () => void
} => {
  const { phase } = useContext(ContractContext)
  const { account, setAccount, network, setNetwork, metamask, setMetamask } =
    useContext(MetamaskContext)
  const { fetchWlInfo } = useContract()
  const { handleToast } = useToaster()
  const connectMetamask = async () => {
    const detectProvider = await detectEthereumProvider({
      mustBeMetaMask: true,
    })
    if (detectProvider && window.ethereum?.isMetaMask) {
      const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
      const signer = provider.getSigner()
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string,
        artifact.abi,
        signer
      )

      // MetaMask requires requesting permission to connect users accounts
      try {
        const accounts = await provider.send('eth_requestAccounts', [])
        setAccount(accounts[0])
        fetchWlInfo(contract, accounts[0], phase)
      } catch (e) {
        console.error('Connection error: ', e)
        return
      }

      const network = await provider.getNetwork()
      if (network.name === process.env.NEXT_PUBLIC_NETWORK) {
        setNetwork(true)
      } else {
        try {
          await provider.send('wallet_switchEthereumChain', [
            { chainId: process.env.NEXT_PUBLIC_NETWORK_CHAINID },
          ])
        } catch (e: any) {
          handleToast(e.code as string)
          return
        }
      }

      setMetamask({ provider, signer, contract })
    } else {
      alert('Please Install Metamask')
    }
  }
  return { connectMetamask }
}

export default useMetamask
