import { memo, useContext, useEffect, useState } from 'react'
import { Button, Input, useToast, HStack, VStack, Text } from '@chakra-ui/react'
import { MetamaskContext } from '../../context/MetamaskContext'
import useMetamask from '../../hooks/useMetamask'
import { ethers } from 'ethers'

import { useNumberInput } from '@chakra-ui/react'
import { ContractContext } from '../../context/ContractContext'

import axios from 'axios'
import { useToaster } from '../../hooks/useToaster'
import {
  ALLOW_LIST_1ST,
  ALLOW_LIST_2ND,
  NOT_YET,
  PUBLIC,
} from '../../utils/constant'

import { Table, Tbody, Tr, Td, TableContainer } from '@chakra-ui/react'

declare var window: any

// eslint-disable-next-line react/display-name
export const MintButton: React.FC = memo(() => {
  const { setTotalSupply, publicCost, preCost, phase } =
    useContext(ContractContext)
  const [isLoading, setIsLoading] = useState(false)
  const { handleToast, mintSucceed, generalError } = useToaster()

  const { network, metamask, account, balanceOf, wlCount, setBalanceOf } =
    useContext(MetamaskContext)
  const { connectMetamask } = useMetamask()

  const [quantity, setQuantity] = useState(1)
  const [canClaim, setCanClaim] = useState(false)

  const handleMintClick = async () => {
    switch (phase) {
      case ALLOW_LIST_1ST: {
        await ALMint(ALLOW_LIST_1ST)
        break
      }
      case ALLOW_LIST_2ND: {
        await ALMint(ALLOW_LIST_2ND)
        break
      }
      case PUBLIC: {
        await publicMint()
        break
      }
    }
  }
  const handleConnectClick = async () => {
    await connectMetamask()
  }

  const checkMint = async () => {
    try {
      const res = await axios.post(`${window.origin}/api/merkletree`, {
        address: account,
      })
      if (res.status === 200) {
        const tx = await metamask.contract?.checkMint(
          wlCount,
          res.data.hexProof
        )
        setCanClaim(true)
        mintSucceed(`Allow Listが${wlCount}件登録されています`)
      }
    } catch (e) {
      console.log(e)
      generalError('Allow Listが登録されていません')
    }
  }

  const publicMint = async () => {
    setIsLoading(true)
    const options = { value: ethers.utils.parseEther(publicCost).mul(quantity) }
    try {
      const tx = await metamask.contract?.publicMint(quantity, options)
      await tx.wait()
    } catch (e: any) {
      console.error(e)
      handleToast(e.code as string)
    } finally {
      const total = await metamask?.contract?.totalSupply()
      const balanceOf = await metamask?.contract?.whiteListClaimed(account)
      setTotalSupply(total)
      setBalanceOf(balanceOf)
      setIsLoading(false)
    }
  }

  const ALMint = async (phase: number) => {
    setIsLoading(true)
    try {
      // Merkletree validation
      const res = await axios.post(`${window.origin}/api/merkletree`, {
        address: account,
      })
      if (res.status === 200) {
        const options = {
          value: ethers.utils.parseEther(preCost).mul(quantity),
        }

        if (phase == ALLOW_LIST_1ST) {
          const tx = await metamask.contract?.firstMint(
            quantity,
            wlCount,
            res.data.hexProof,
            options
          )
          await tx.wait()
        } else if (phase == ALLOW_LIST_2ND) {
          const tx = await metamask.contract?.secondMint(
            quantity,
            wlCount,
            res.data.hexProof,
            options
          )
          await tx.wait()
        }
      }
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
      const total = await metamask?.contract?.totalSupply()
      const balanceOf = await metamask?.contract?.whiteListClaimed(account)
      setTotalSupply(total)
      setBalanceOf(balanceOf)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (
      !metamask ||
      Object.keys(metamask).length === 0 ||
      Object.keys(metamask.provider).length === 0
    ) {
      return
    }

    // for network change event
    metamask.provider.on('network', (newNetwork, oldNetwork) => {
      if (oldNetwork) {
        window.location.reload()
      }
    })
  }, [metamask, metamask.contract, metamask.provider])

  const maxClaimCount = (): number => {
    switch (phase) {
      case ALLOW_LIST_1ST: {
        return wlCount > 0 ? wlCount * 2 - balanceOf : 0
      }
      case ALLOW_LIST_2ND: {
        return wlCount * 3 - balanceOf
      }
      case PUBLIC: {
        return 3
      }
      default: {
        return 0
      }
    }
  }
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      defaultValue: 0,
      min: 0,
      max: maxClaimCount(),
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
    const filters = metamask.contract?.filters['Minted']
    if (filters !== undefined) {
      metamask.provider.once('block', () => {
        metamask.contract?.on(filters(), (author: string) => {
          if (author.toLowerCase() == account.toLowerCase()) {
            mintSucceed('ENJOY YOUR SPACE JOURNEY')
            setIsLoading(false)
          }
        })
      })
    }
  }, [metamask.contract])

  const canClaimCount = () => {
    return phase == PUBLIC
      ? 3
      : phase == ALLOW_LIST_1ST
      ? wlCount * 2 - balanceOf
      : wlCount * 3 - balanceOf
  }
  return (
    <>
      {publicCost ? (
        <>
          <VStack alignItems="center">
            {account ? (
              <>
                {phase != PUBLIC && (
                  <>
                    <Text
                      color="#FDEE21"
                      fontSize={{ base: '3xl', md: '4xl' }}
                      letterSpacing="normal"
                    >
                      YOUR MINT INFORMATION
                    </Text>
                    <TableContainer width="100%">
                      <Table variant="unstyled" size="sm">
                        <Tbody>
                          <Tr>
                            <Td fontSize="xl">　YOUR AL COUNT</Td>
                            <Td>
                              <Text color="white" fontSize="xl">
                                {wlCount.toString()}
                              </Text>
                            </Td>
                          </Tr>
                          <Tr>
                            <Td fontSize="xl">　ALREADY MINTED</Td>
                            <Td>
                              <Text color="white" fontSize="xl">
                                {balanceOf.toString()}
                              </Text>
                            </Td>
                          </Tr>
                          <Tr>
                            <Td fontSize="xl">　YOU CAN MINT</Td>
                            <Td>
                              <Text color="white" fontSize="xl">
                                {canClaimCount().toString()}
                              </Text>
                            </Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </>
                )}
                <HStack justifyContent="center" width="100%">
                  <HStack maxW="280px" backgroundColor="black" rounded="full">
                    <Button
                      {...dec}
                      borderRadius="full"
                      backgroundColor="black"
                      color="white"
                      fontSize="3xl"
                    >
                      -
                    </Button>
                    <Input
                      {...input}
                      width="48px"
                      border="none"
                      fontSize="2xl"
                      color="white"
                      readOnly
                      _focus={{ boxShadow: { isInputFocused: 'none' } }}
                    />
                    <Button
                      {...inc}
                      borderRadius="full"
                      backgroundColor="black"
                      color="white"
                      fontSize="3xl"
                    >
                      +
                    </Button>
                  </HStack>
                  <Button
                    bgColor="black"
                    color="white"
                    _focus={{ outline: 'none' }}
                    onClick={network ? handleMintClick : handleConnectClick}
                    isLoading={isLoading}
                    disabled={isLoading || (network && canClaimCount() == 0)}
                    fontSize="xl"
                  >
                    {account ? 'MINT' : 'CONNECT METAMASK'}
                  </Button>
                </HStack>
              </>
            ) : (
              <Button
                bgColor="black"
                color="white"
                _focus={{ outline: 'none' }}
                onClick={handleConnectClick}
                isLoading={isLoading}
                disabled={isLoading}
              >
                CONNECT METAMASK
              </Button>
            )}
          </VStack>
        </>
      ) : account ? (
        <VStack>
          <Text color="white" fontSize="3xl">
            CHECK YOUR ALLOW LIST
          </Text>
          {canClaim && (
            <Text color="white" fontSize="xl">
              YOU HAVE {wlCount} AL
            </Text>
          )}
          <Button
            bgColor="black"
            color="white"
            onClick={checkMint}
            fontSize="xl"
          >
            CHECK AL
          </Button>
        </VStack>
      ) : (
        <Button
          bgColor="black"
          color="white"
          _focus={{ outline: 'none' }}
          onClick={handleConnectClick}
          isLoading={isLoading}
          disabled={isLoading}
        >
          CONNECT METAMASK
        </Button>
      )}
    </>
  )
})
