import { Box, Center, Flex, VStack } from '@chakra-ui/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Header } from '../component/layout/Header'

import Thirdweb from '../component/organisms/Thirdweb'

const Home: NextPage = () => {
  return (
    <Box>
      <Head>
        <title>{process.env.NEXT_PUBLIC_CONTRACT_NAME}</title>
        <meta name="description" content="MetaKozo Mint site" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box>
        <Header />
        <Center
          // backgroundImage={'https://source.unsplash.com/random'}
          backgroundPosition="center"
          backgroundSize="cover"
          backgroundImage={{
            base: '/img/mintsaiteSP.png',
            md: '/img/mintsaitePC.png',
          }}
        >
          <Flex h="91vh" w="100vw" justifyContent="center" alignItems="center">
            <Flex
              w={{ base: '100%', md: '80%' }}
              alignItems={{ base: 'center', md: 'flex-end' }}
              justifyContent="flex-end"
            >
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
                <>
                  <VStack alignItems="center">
                    <Thirdweb />
                  </VStack>
                </>
              </Flex>
            </Flex>
          </Flex>
        </Center>
      </Box>
    </Box>
  )
}

export default Home
