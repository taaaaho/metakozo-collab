import { Box, Center, Flex, Image, VStack } from '@chakra-ui/react'
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
            base: '/img/mintSP.jpg',
            md: '/img/mintPC.jpg',
          }}
        >
          <Flex h="91vh" w="100vw" justifyContent="center" alignItems="center">
            <Flex
              gap={2}
              w={{ base: '100%', md: '80%' }}
              direction={{ base: 'column', md: 'row' }}
              alignItems={{ base: 'center', md: 'center' }}
              justifyContent={{ base: 'flex-end', md: 'center' }}
            >
              <Flex height={`100%`} justifyContent="center" alignItems="center">
                <Image
                  src="https://cdn.discordapp.com/attachments/1012665083421270078/1075612552748343366/IMG_3513.JPG"
                  width={{ base: 240, md: 380 }}
                  height={{ base: 240, md: 380 }}
                  alt="metakozo x naito"
                />
              </Flex>
              <Flex
                m={{ base: '2', md: '8' }}
                bg="rgb(121, 136, 160, 0.8)"
                color="white"
                width={{ base: '380px', md: '480px' }}
                borderRadius="90px"
                height={{ base: '320px', md: '480px' }}
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
