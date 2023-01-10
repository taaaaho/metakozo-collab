import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Text,
  useNumberInput,
  VStack,
} from '@chakra-ui/react'
import {
  useAddress,
  useContract,
  useMetamask,
  useNetworkMismatch,
  useNetwork,
  ChainId,
} from '@thirdweb-dev/react'
import { useEffect, useState } from 'react'
import { ClaimCondition } from '@thirdweb-dev/sdk'
import { format_date } from '../../utils/formatdate'
import { ethers } from 'ethers'
import { useToaster } from '../../hooks/useToaster'
import { Loading } from './Loading'

export default function Thirdweb() {
  const isMismatched = useNetworkMismatch()
  const [chain, switchNetwork] = useNetwork()
  const [isMinting, setIsMinting] = useState(false)
  const [isLoadContractData, setIsLoadContractData] = useState(false)
  const { handleToast, mintSucceed, generalError } = useToaster()
  const connectWithMetamask = useMetamask()
  const address = useAddress()
  const { contract, isLoading } = useContract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    'nft-drop'
  )
  const [claimConditions, setClaimConditions] = useState<ClaimCondition>()
  const [unclaimed, setUnclaimed] = useState<ethers.BigNumber>()
  const fetch = async () => {
    setIsLoadContractData(true)
    try {
      const phase = await contract?.claimConditions.getActive()
      setClaimConditions(phase)
      const unclaimedSupply = await contract?.totalUnclaimedSupply()
      setUnclaimed(unclaimedSupply)
    } finally {
      setIsLoadContractData(false)
    }
  }

  const mint = async () => {
    if (address && contract) {
      setIsMinting(true)
      try {
        const tx = await contract.claimTo(address, quantity)
        const receipt = tx[0].receipt // the transaction receipt
        const claimedTokenId = tx[0].id // the id of the NFT claimed
        const claimedNFT = await tx[0].data() //
        mintSucceed('ENJOY YOUR SPACE JOURNEY')
      } catch (e: any) {
        const message = e.reason
          .replace(
            'Error: VM Exception while processing transaction: reverted with reason string ',
            ''
          )
          .replaceAll("'", '')
        if (message) {
          generalError(message)
        } else {
          handleToast(e.code as string)
        }
      } finally {
        setIsMinting(false)
        fetch()
      }
    }
  }

  const [quantity, setQuantity] = useState(1)
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      defaultValue: 0,
      min: 0,
      max: 1,
    })

  const inc = getIncrementButtonProps()
  const dec = getDecrementButtonProps()
  const input = getInputProps()
  useEffect(() => {
    if (input['aria-valuetext']) {
      setQuantity(Number(input['aria-valuetext']))
    }
  }, [input])
  useEffect(() => {
    fetch()
  }, [contract])

  if (isLoading || isLoadContractData) {
    return <Loading />
  }
  return (
    <Flex flexDir={'column'} gap={2} alignItems="center">
      <Text fontWeight={'bold'} fontSize={'4xl'} color="#FDEE21">
        {claimConditions?.metadata?.name}
      </Text>
      {claimConditions && (
        <Text fontWeight={'semibold'} fontSize={'xl'} letterSpacing={'wider'}>
          {`SALE START: ${format_date(
            claimConditions?.startTime.toString()
          )} (JST)`}
        </Text>
      )}
      {claimConditions && (
        <Text fontWeight={'semibold'} fontSize={'xl'} letterSpacing={'wider'}>
          {`PRICE: ${claimConditions?.currencyMetadata.displayValue}`}
        </Text>
      )}
      {unclaimed && (
        <Text fontWeight={'semibold'} fontSize={'2xl'} letterSpacing={'wider'}>
          {`LEFT: ${claimConditions?.availableSupply} / ${claimConditions?.maxClaimableSupply}`}
        </Text>
      )}
      <Box>
        {address && !isMismatched ? ( // connect & network check
          <>
            {claimConditions &&
            Number(claimConditions?.availableSupply) == 0 ? (
              <Button bgColor="#9BD9FF" color="black">
                Sold Out
              </Button>
            ) : (
              <HStack>
                <HStack
                  maxW="240px"
                  backgroundColor="black"
                  rounded="full"
                  bgColor="#9BD9FF"
                  color="black"
                >
                  <Button
                    {...dec}
                    borderRadius="full"
                    // backgroundColor="black"
                    // color="white"
                    bgColor="#9BD9FF"
                    color="black"
                    fontSize="3xl"
                  >
                    -
                  </Button>
                  <Input
                    {...input}
                    width="48px"
                    border="none"
                    fontSize="2xl"
                    // color="white"
                    bgColor="#9BD9FF"
                    color="black"
                    readOnly
                    _focus={{ boxShadow: { isInputFocused: 'none' } }}
                  />
                  <Button
                    {...inc}
                    borderRadius="full"
                    bgColor="#9BD9FF"
                    color="black"
                    // backgroundColor="black"
                    // color="white"
                    fontSize="3xl"
                  >
                    +
                  </Button>
                </HStack>

                <Button
                  onClick={mint}
                  bgColor="#9BD9FF"
                  color="black"
                  // bgColor="black"
                  // color="white"
                  fontWeight={'semibold'}
                  isLoading={isMinting}
                  letterSpacing={'wider'}
                >
                  Mint
                </Button>
              </HStack>
            )}
          </>
        ) : address && isMismatched ? (
          <>
            <Button
              bgColor="#9BD9FF"
              color="black"
              size="md"
              fontWeight={'bold'}
              onClick={() => {
                if (switchNetwork) {
                  switchNetwork(ChainId.Goerli)
                }
              }}
            >
              Switch Network
            </Button>
          </>
        ) : (
          <Button
            onClick={connectWithMetamask}
            bgColor="black"
            color="white"
            letterSpacing={'wider'}
          >
            Connect Metamask
          </Button>
        )}
      </Box>
    </Flex>
  )
}
