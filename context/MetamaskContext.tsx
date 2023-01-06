import React, {
  createContext,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
} from 'react'
import { Metamask } from '../hooks/useMetamask'

type Context = {
  account: string
  setAccount: Dispatch<SetStateAction<string>>
  network: boolean
  setNetwork: Dispatch<SetStateAction<boolean>>
  metamask: Metamask
  setMetamask: Dispatch<SetStateAction<Metamask>>
  balanceOf: number
  setBalanceOf: Dispatch<SetStateAction<number>>
  wlCount: number
  setWlCount: Dispatch<SetStateAction<number>>
}

export const MetamaskContext = createContext({} as Context)

type Props = {
  children: ReactNode
}

declare var window: any

const MetamaskProvider: React.FC<Props> = (props) => {
  const [account, setAccount] = useState('')
  const [network, setNetwork] = useState(false)
  const [metamask, setMetamask] = useState<Metamask>({} as Metamask)
  const [balanceOf, setBalanceOf] = useState(0)
  const [wlCount, setWlCount] = useState(0)
  const { children } = props
  return (
    <MetamaskContext.Provider
      value={{
        account,
        setAccount,
        network,
        setNetwork,
        metamask,
        setMetamask,
        balanceOf,
        setBalanceOf,
        wlCount,
        setWlCount,
      }}
    >
      {children}
    </MetamaskContext.Provider>
  )
}

export default MetamaskProvider
