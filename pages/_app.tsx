import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import theme from '../theme'
import { ThirdwebProvider, ChainId } from '@thirdweb-dev/react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Config } from '@/utils/firestore'

function MyApp({ Component, pageProps }: AppProps) {
  const [chainId, setChainId] = useState<number>()
  useEffect(() => {
    const fetchConfig = async () => {
      const res = await axios.get<Config>('/api/firestore')
      setChainId(Number(res.data.chainId))
    }
    fetchConfig()
  }, [])

  return (
    <ThirdwebProvider desiredChainId={chainId}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </ThirdwebProvider>
  )
}

export default MyApp
