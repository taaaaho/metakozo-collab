import { Spinner, Text, VStack } from '@chakra-ui/react'

export const Loading: React.FC = () => {
  return (
    <VStack justifyContent="center">
      <Spinner size="lg" color="white" />
      <Text color="white" fontSize="2xl">
        Loading contract...
      </Text>
    </VStack>
  )
}
