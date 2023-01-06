import { Center, Button, HStack, Text, VStack } from '@chakra-ui/react'
import axios from 'axios'
import React, { useContext, useState } from 'react'
import { MetamaskContext } from '../context/MetamaskContext'
import useMetamask from '../hooks/useMetamask'

const Admin: React.FC = () => {
  const { metamask, account } = useContext(MetamaskContext)
  const { connectMetamask } = useMetamask()
  const [root, setRoot] = useState('')
  const handleConnectClick = async () => {
    await connectMetamask()
  }
  const handleSetMerkleRoot = async () => {
    const res = await axios.get(`${window.origin}/api/merkletree`)
    const tx = await metamask.contract?.setMerkleRoot(res.data.merkleRoot.data)
    await tx.wait()
  }
  const handleGetMerkleRoot = async () => {
    const root = await metamask.contract?.merkleRoot()
    setRoot(root)
  }
  return (
    <Center mt="100">
      <VStack gap={4}>
        <Button onClick={handleConnectClick}>Wallet Connect</Button>
        {account && <Text>{account}</Text>}
        <VStack>
          <Text fontWeight="bold" fontSize={'2xl'}>
            AL Sale
          </Text>
          <HStack>
            <Button onClick={handleGetMerkleRoot}>Get MerkleRoot</Button>
            <Button onClick={handleSetMerkleRoot}>Set MerkleRoot</Button>
          </HStack>
          {root && <Text>{root}</Text>}
        </VStack>
      </VStack>
    </Center>
  )
}

export default Admin
