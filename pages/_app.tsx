import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import MetamaskProvider from '../context/MetamaskContext'
import ContractProvider from '../context/ContractContext'
import theme from '../theme'
import { ThirdwebProvider, ChainId } from '@thirdweb-dev/react'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider desiredChainId={ChainId.Goerli}>
      <ChakraProvider theme={theme}>
        <ContractProvider>
          <MetamaskProvider>
            <Component {...pageProps} />
          </MetamaskProvider>
        </ContractProvider>
      </ChakraProvider>
    </ThirdwebProvider>
  )
}

export default MyApp
