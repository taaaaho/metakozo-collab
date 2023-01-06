import { Box, Button, Flex, HStack, Text } from '@chakra-ui/react'
import { SpMenu } from '../organisms/SpMenu'
import { SnsLinks } from '../organisms/SnsLinks'
import { useDisconnect, useAddress, useMetamask } from '@thirdweb-dev/react'
import Jazzicon from 'react-jazzicon/dist/Jazzicon'
import { jsNumberForAddress } from 'react-jazzicon'
import Image from 'next/image'

export const Header: React.FC = () => {
  const connectWithMetamask = useMetamask()
  const disconnect = useDisconnect()
  const address = useAddress()
  return (
    <Flex
      flexDirection="row"
      alignItems="center"
      top="0"
      py="2"
      px={{ base: '2', md: '8' }}
      justifyContent="space-between"
      bgColor="white"
    >
      <Box>
        <HStack flexDirection="row" alignItems="center" cursor="pointer">
          <Image
            src="/img/MKD_logo.webp"
            alt="MetaKozo Logo"
            width={190}
            height={60}
          />
        </HStack>
      </Box>

      <SpMenu />
      <Box display={{ base: 'none', md: 'block' }}>
        <HStack>
          <SnsLinks />
          <Box
            bg="gray.800"
            borderRadius="xl"
            m="2"
            px="3"
            py="2"
            onClick={address ? disconnect : connectWithMetamask}
          >
            {address ? (
              <>
                <HStack>
                  <Text
                    mr="4"
                    fontWeight="semibold"
                    fontSize={{ base: 'xs', md: 'sm' }}
                    color="white"
                  >
                    {address &&
                      `${address.slice(0, 4)}...${address.slice(
                        address.length - 3,
                        address.length
                      )}`}
                  </Text>
                  <Jazzicon diameter={20} seed={jsNumberForAddress(address)} />
                </HStack>
              </>
            ) : (
              <Text
                fontWeight="semibold"
                fontSize={{ base: 'xs', md: 'sm' }}
                color="white"
                letterSpacing={'wider'}
              >
                Connect Metamask
              </Text>
            )}
          </Box>
        </HStack>
      </Box>
    </Flex>
  )
}
