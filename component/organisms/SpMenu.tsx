import {
  Box,
  Button,
  Input,
  Spacer,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import Image from 'next/image'
import React from 'react'
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'
import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons'
import { SnsLinks } from './SnsLinks'
import Link from 'next/link'

export const SpMenu = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <HamburgerIcon
        w={6}
        h={6}
        onClick={onOpen}
        display={{ base: 'block', md: 'none' }}
      />
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent opacity="0.9">
          <DrawerCloseButton h={10} w={10} />
          <DrawerHeader>
            <Text fontSize={24}>Menu</Text>
          </DrawerHeader>

          <DrawerBody>
            <VStack justifyContent="flex-start" h="100vh" pt={24} spacing={12}>
              <Link href="https://metakozo-dao.xyz">
                <Text
                  fontSize="2xl"
                  decoration="underline"
                  textUnderlineOffset={4}
                >
                  Metakozo DAO
                </Text>
              </Link>
              {/* <Link href="https://metakozo-dao.xyz">
                <Text
                  fontSize="2xl"
                  decoration="underline"
                  textUnderlineOffset={4}
                >
                  Metakozo School
                </Text>
              </Link> */}
              <SnsLinks />
              <CloseIcon onClick={onClose} />
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
