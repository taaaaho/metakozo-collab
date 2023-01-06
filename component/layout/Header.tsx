import { Box, Flex, HStack, Text } from '@chakra-ui/react'
import Image from 'next/image'
import { useContext } from 'react'
import { MetamaskContext } from '../../context/MetamaskContext'
import useMetamask from '../../hooks/useMetamask'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { SpMenu } from '../organisms/SpMenu'
import { SnsLinks } from '../organisms/SnsLinks'

export const Header: React.FC = () => {
  const { network, account } = useContext(MetamaskContext)
  const { connectMetamask } = useMetamask()
  const handleConnectClick = async () => {
    await connectMetamask()
  }
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
          <Text fontSize="2xl" fontWeight="bold">
            Sample Project
          </Text>
          {/* <Image
            src="/img/MKD_logo.webp"
            alt="MetaKozo Logo"
            width={`${381 / 2}px`}
            height={`${121 / 2}px`}
            layout="intrinsic"
          /> */}
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
            onClick={handleConnectClick}
          >
            {network ? (
              <HStack>
                <Text
                  mr="4"
                  fontWeight="semibold"
                  fontSize={{ base: 'xs', md: 'sm' }}
                  color="white"
                >
                  {account &&
                    `${account.slice(0, 4)}...${account.slice(
                      account.length - 3,
                      account.length
                    )}`}
                </Text>
                <Jazzicon diameter={20} seed={jsNumberForAddress(account)} />
              </HStack>
            ) : (
              <Text
                fontWeight="semibold"
                fontSize={{ base: 'xs', md: 'sm' }}
                color="white"
              >
                Connect Wallet
              </Text>
            )}
          </Box>
        </HStack>
      </Box>
    </Flex>
  )
}
