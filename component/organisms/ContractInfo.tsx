import { Box, Button, Text, VStack } from '@chakra-ui/react'
import { useContext, useEffect, useState } from 'react'
import { Progress } from '@chakra-ui/react'

import { ContractContext } from '../../context/ContractContext'
import { useToaster } from '../../hooks/useToaster'
import {
  ALLOW_LIST_1ST,
  ALLOW_LIST_2ND,
  NOT_YET,
  PUBLIC,
} from '../../utils/constant'

declare var window: any

export const Metamask: React.FC = () => {
  const { handleToast } = useToaster()
  const { totalSupply, publicCost, preCost, phase, provider, collectionSize } =
    useContext(ContractContext)

  const currentSaleTime = (): string => {
    switch (phase) {
      case ALLOW_LIST_1ST: {
        return '11/27 20:00 - 22:00'
      }
      case ALLOW_LIST_2ND: {
        return '11/27 22:00 - 11/28 20:00'
      }
      case PUBLIC: {
        return '11/28 20:00 - '
      }
      default: {
        return '11/27 20:00 - 22:00'
      }
    }
  }
  const changeNetwork = async () => {
    if (provider) {
      try {
        await provider.send('wallet_switchEthereumChain', [
          { chainId: process.env.NEXT_PUBLIC_NETWORK_CHAINID },
        ])
      } catch (e: any) {
        handleToast(e.code as string)
      }
    }
  }

  useEffect(() => {
    if (provider) {
      provider.on('network', (newNetwork, oldNetwork) => {
        if (oldNetwork) {
          window.location.reload()
        }
      })
    }
  }, [provider])

  return (
    <Box>
      {publicCost ? (
        <Box textAlign="center">
          {phase == ALLOW_LIST_1ST ? (
            <>
              <Text
                color="#white"
                fontSize={{ base: '4xl', md: '5xl' }}
                letterSpacing="normal"
              >
                ALLOW LIST 1ST SALE
              </Text>
              <Text color="white" fontSize="xl" letterSpacing="widest">
                {currentSaleTime()} (JST)
              </Text>
              <Text color="white" fontSize="xl" letterSpacing="widest">
                PRICE: {preCost} ETH
              </Text>
            </>
          ) : phase == ALLOW_LIST_2ND ? (
            <>
              <Text
                color="#white"
                fontSize={{ base: '4xl', md: '5xl' }}
                letterSpacing="normal"
              >
                ALLOW LIST 2ND SALE
              </Text>
              <Text color="white" fontSize="xl" letterSpacing="widest">
                {currentSaleTime()} (JST)
              </Text>
              <Text color="white" fontSize="xl" letterSpacing="widest">
                PRICE: {preCost} ETH
              </Text>
            </>
          ) : phase == PUBLIC ? (
            <>
              <Text
                color="#FDEE21"
                fontSize={{ base: '4xl', md: '5xl' }}
                letterSpacing="normal"
              >
                PUBLIC SALE
              </Text>
              <Text color="white" fontSize="xl" letterSpacing="widest">
                {currentSaleTime()} (JST)
              </Text>
              <Text color="white" fontSize="xl" letterSpacing="widest">
                PRICE: {publicCost} ETH
              </Text>
            </>
          ) : (
            <>
              <Text
                color="#FDEE21"
                fontSize={{ base: '4xl', md: '5xl' }}
                letterSpacing="normal"
              >
                SALE NOT STARTED
              </Text>
              <Text color="white" fontSize="xl" letterSpacing="widest">
                AL 1ST SALE START AT <br />
                {currentSaleTime()} (JST)
              </Text>
            </>
          )}
          {phase != NOT_YET && (
            <>
              <Text color="white" fontSize="3xl" letterSpacing="widest">
                {/* {`${Number(collectionSize) - totalSupply} / ${collectionSize}`} */}
                Left: {`${Number(collectionSize) - totalSupply}`}
              </Text>
              {phase == ALLOW_LIST_1ST && (
                <Text color="white">*** 1ST SALE CAN 2 MINT PER AL ***</Text>
              )}
            </>
          )}
        </Box>
      ) : (
        <VStack>
          <Text color="white" fontWeight="semibold">
            Please change network to {process.env.NEXT_PUBLIC_NETWORK}
          </Text>
          <Button
            borderRadius="full"
            bgColor="black"
            color="white"
            size="sm"
            onClick={changeNetwork}
          >
            Switch network
          </Button>
        </VStack>
      )}
    </Box>
  )
}
