import { ethers } from 'ethers'
import React, {
  createContext,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
} from 'react'

type Context = {
  totalSupply: number
  setTotalSupply: Dispatch<SetStateAction<number>>
  maxPerTransaction: number
  setMaxPerTransaction: Dispatch<SetStateAction<number>>
  preCost: string
  setPreCost: Dispatch<SetStateAction<string>>
  publicCost: string
  setPublicCost: Dispatch<SetStateAction<string>>
  phase: number
  setPhase: Dispatch<SetStateAction<number>>
  collectionSize: number
  setCollectionSize: Dispatch<SetStateAction<number>>
  saleStartTime1st: number
  setSaleStartTime1st: Dispatch<SetStateAction<number>>
  saleStartTime2nd: number
  setSaleStartTime2nd: Dispatch<SetStateAction<number>>
  saleStartTimePublic: number
  setSaleStartTimePublic: Dispatch<SetStateAction<number>>
  isLoading: boolean
  setIsLoading: Dispatch<SetStateAction<boolean>>
  provider: ethers.providers.Web3Provider | undefined
  setProvider: Dispatch<
    SetStateAction<ethers.providers.Web3Provider | undefined>
  >
}

export const ContractContext = createContext({} as Context)

type Props = {
  children: ReactNode
}

declare var window: any

const ContractProvider: React.FC<Props> = (props) => {
  const [totalSupply, setTotalSupply] = useState(0)
  const [maxPerTransaction, setMaxPerTransaction] = useState(0)
  const [preCost, setPreCost] = useState('')
  const [publicCost, setPublicCost] = useState('')
  const [phase, setPhase] = useState(0)
  const [collectionSize, setCollectionSize] = useState(0)
  const [saleStartTime1st, setSaleStartTime1st] = useState(0)
  const [saleStartTime2nd, setSaleStartTime2nd] = useState(0)
  const [saleStartTimePublic, setSaleStartTimePublic] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>()
  const { children } = props
  return (
    <ContractContext.Provider
      value={{
        totalSupply,
        setTotalSupply,
        maxPerTransaction,
        setMaxPerTransaction,
        preCost,
        setPreCost,
        publicCost,
        setPublicCost,
        phase,
        setPhase,
        collectionSize,
        setCollectionSize,
        saleStartTime1st,
        setSaleStartTime1st,
        saleStartTime2nd,
        setSaleStartTime2nd,
        saleStartTimePublic,
        setSaleStartTimePublic,
        isLoading,
        setIsLoading,
        provider,
        setProvider,
      }}
    >
      {children}
    </ContractContext.Provider>
  )
}

export default ContractProvider
