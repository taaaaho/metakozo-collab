import { useToast } from '@chakra-ui/react'
import { useCallback } from 'react'
import { METAMASK_POSSIBLE_ERRORS } from '../utils/metamaskErrors'

export const useToaster = () => {
  const toast = useToast()
  const handleToast = useCallback(
    (errorCode: string) => {
      toast({
        title: 'Error',
        description: METAMASK_POSSIBLE_ERRORS[errorCode]
          ? METAMASK_POSSIBLE_ERRORS[errorCode].message
          : 'something went wrong',
        status: 'error',
        duration: 7000,
        isClosable: true,
      })
    },
    [toast]
  )

  const generalError = useCallback(
    (message: string) => {
      toast({
        title: message,
        status: 'error',
        duration: 7000,
        isClosable: true,
      })
    },
    [toast]
  )
  const mintSucceed = useCallback(
    (message: string) => {
      toast({
        title: message,
        status: 'success',
        duration: 7000,
        isClosable: true,
      })
    },
    [toast]
  )
  return { handleToast, mintSucceed, generalError }
}
