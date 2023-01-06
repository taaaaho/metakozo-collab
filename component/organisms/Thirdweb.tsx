import { Box, Button, Text, VStack } from '@chakra-ui/react'
import {
  ConnectWallet,
  useAddress,
  useContract,
  useMetamask,
  Web3Button,
} from '@thirdweb-dev/react'

export default function Thirdweb() {
  const connectWithMetamask = useMetamask()
  const address = useAddress()
  const { contract } = useContract(
    '0x977Fc9074F49b6508591Af243cd5696260206C6D',
    'nft-drop'
  )
  return (
    <VStack>
      <Text>{address}</Text>
      {/* <iframe
        src="https://gateway.ipfscdn.io/ipfs/Qmcine1gpZUbQ73nk7ZGCcjKBVFYXrEtqrhujXk3HDQ6Nn/erc721.html?contract=0x977Fc9074F49b6508591Af243cd5696260206C6D&chainId=5&theme=dark"
        width="600px"
        height="600px"
        // style="max-width:100%;"
        // frameBorder="0"
      ></iframe> */}
      <div>
        <ConnectWallet />
      </div>
      {/* <div>
        <Web3Button
          contractAddress="0x..."
          action={(contract) => contract.erc721.transfer('0x...', 1)}
        />
      </div> */}
      <Box>
        <Button onClick={connectWithMetamask} bgColor="black" color="white">
          Connect Metamask
        </Button>
      </Box>
    </VStack>
  )
  // Now you can use the nft drop contract in the rest of the component
}
