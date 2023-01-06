import { BigNumber, ethers } from 'ethers'
import { useCallback, useContext, useState } from 'react'

import artifact from '../artifacts/MetaKozo.json'
import detectEthereumProvider from '@metamask/detect-provider'
import { ContractContext } from '../context/ContractContext'
import { useToaster } from './useToaster'
import axios from 'axios'
import { MetamaskContext } from '../context/MetamaskContext'
import {
  ALLOW_LIST_1ST,
  ALLOW_LIST_2ND,
  NOT_YET,
  PUBLIC,
} from '../utils/constant'

declare var window: any

const useContract = (): {
  loadContract: () => void
  fetchContractInfo: (contract: ethers.Contract) => void
  fetchWlInfo: (
    contract: ethers.Contract,
    address: string,
    phase: number
  ) => void
} => {
  const {
    setTotalSupply,
    setPreCost,
    setPublicCost,
    setPhase,
    setMaxPerTransaction,
    setIsLoading,
    setProvider,
    setCollectionSize,
    setSaleStartTime1st,
    setSaleStartTime2nd,
    setSaleStartTimePublic,
  } = useContext(ContractContext)
  const { setWlCount, setBalanceOf } = useContext(MetamaskContext)
  const { handleToast } = useToaster()
  const fetchContractInfo = useCallback(
    async (contract: ethers.Contract) => {
      console.log('hoge1', contract)
      const total = await contract?.totalSupply()
      const preCost = await contract?.preCost()
      const publicCost = await contract?.publicCost()
      console.log('hoge2')
      // const phase = await contract?.getPhase()
      const collectionSize = await contract?.collectionSize()
      const maxPerTransaction = await contract?.maxPerTX()
      console.log('hoge3')
      const saleStartTime1st: BigNumber = await contract?.saleStartTime1st()
      const saleStartTime2nd: BigNumber = await contract?.saleStartTime2nd()
      const saleStartTimePublic: BigNumber =
        await contract?.saleStartTimePublic()
      setTotalSupply(total)
      setMaxPerTransaction(maxPerTransaction)
      setPreCost(ethers.utils.formatEther(preCost))
      setPublicCost(ethers.utils.formatEther(publicCost))
      setCollectionSize(collectionSize)
      setSaleStartTime1st(saleStartTime1st.toNumber())
      setSaleStartTime2nd(saleStartTime2nd.toNumber())
      setSaleStartTimePublic(saleStartTimePublic.toNumber())
      console.log('hoge4')

      const now = new Date()
      const time = now.getTime()
      const unixtimestamp = Math.floor(time / 1000)
      if (saleStartTimePublic.toNumber() < unixtimestamp) {
        setPhase(PUBLIC)
      } else if (saleStartTime2nd.toNumber() < unixtimestamp) {
        setPhase(ALLOW_LIST_2ND)
      } else if (saleStartTime1st.toNumber() < unixtimestamp) {
        setPhase(ALLOW_LIST_1ST)
      } else {
        setPhase(NOT_YET)
      }
    },
    [
      setTotalSupply,
      setMaxPerTransaction,
      setPreCost,
      setPublicCost,
      setPhase,
      setCollectionSize,
      setSaleStartTime1st,
      setSaleStartTime2nd,
      setSaleStartTimePublic,
    ]
  )

  const fetchWlInfo = useCallback(
    async (contract: ethers.Contract, address: string, phase: number) => {
      const res = await axios.get(
        `${window.origin}/api/whitelist?address=${address}`
      )
      setWlCount(res.data.wlCount)

      const mintedCount = await contract?.whiteListClaimed(address)

      setBalanceOf(mintedCount)
    },
    [setBalanceOf, setWlCount]
  )

  const loadContract = useCallback(async () => {
    setIsLoading(true)
    try {
      const detectProvider = await detectEthereumProvider({
        mustBeMetaMask: true,
      })
      if (detectProvider && window.ethereum?.isMetaMask) {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum,
          'any'
        )

        setProvider(provider)
        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string,
          artifact.abi,
          provider
        )

        const network = await provider.getNetwork()
        if (network.name === process.env.NEXT_PUBLIC_NETWORK) {
          await fetchContractInfo(contract)
        } else {
          try {
            await provider.send('wallet_switchEthereumChain', [
              { chainId: process.env.NEXT_PUBLIC_NETWORK_CHAINID },
            ])
            await fetchContractInfo(contract)
          } catch (e: any) {
            handleToast(e.code as string)
          }
        }
      } else {
        alert('Please Install Metamask')
      }
    } finally {
      setIsLoading(false)
    }
  }, [fetchContractInfo, handleToast, setIsLoading, setProvider])

  return { loadContract, fetchContractInfo, fetchWlInfo }
}

export default useContract
