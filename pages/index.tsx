import { Box, Center, Flex, HStack, VStack } from '@chakra-ui/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useContext, useEffect } from 'react'
import { Header } from '../component/layout/Header'

import { Metamask } from '../component/organisms/ContractInfo'
import { Loading } from '../component/organisms/Loading'
import { MintButton } from '../component/organisms/MintButton'
import Thirdweb from '../component/organisms/Thirdweb'
import { ContractContext } from '../context/ContractContext'
import useContract from '../hooks/useContract'

const Home: NextPage = () => {
  const { isLoading } = useContext(ContractContext)
  const { loadContract } = useContract()
  useEffect(() => {
    loadContract()
  }, [loadContract])
  return (
    <Box>
      <Head>
        <title>MetaKozo</title>
        <meta name="description" content="MetaKozo Mint site" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box>
        <Header />
        <Center
          backgroundImage={'https://source.unsplash.com/random'}
          backgroundPosition="center"
          backgroundSize="cover"
          // backgroundImage={{
          //   base: '/img/mintsaiteSP.png',
          //   md: '/img/mintsaitePC.png',
          // }}
        >
          <Flex h="91vh" w="100vw" justifyContent="center" alignItems="center">
            <Flex
              w={{ base: '100%', md: '80%' }}
              alignItems={{ base: 'center', md: 'flex-end' }}
              justifyContent="center"
            >
              <Thirdweb />
              <Flex
                m={{ base: '2', md: '8' }}
                bg="rgb(121, 136, 160, 0.8)"
                color="white"
                width={{ base: '480px', md: '500px' }}
                borderRadius="90px"
                height={{ base: '560px', md: '560px' }}
                justifyContent="center"
                alignItems="center"
              >
                {isLoading ? (
                  <>
                    <Loading />
                  </>
                ) : (
                  <>
                    <VStack alignItems="center">
                      <Metamask />
                      <MintButton />
                    </VStack>
                  </>
                )}
              </Flex>
            </Flex>
          </Flex>
        </Center>
      </Box>
    </Box>
  )
}

export default Home
