import { Loading } from '@/component/organisms/Loading'
import { Config } from '@/utils/firestore'
import {
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Stack,
  VStack,
} from '@chakra-ui/react'
import axios from 'axios'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useToaster } from '@/hooks/useToaster'

const Admin = () => {
  const [config, setConfig] = useState<Config>()
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
    control,
  } = useForm<Config>()

  const { mintSucceed } = useToaster()

  const onSubmit = handleSubmit(async (data) => {
    console.log(data)
    await axios.post('/api/firestore', data)
    mintSucceed('更新しました')
  })

  const validateAddress = (address: string) => {
    if (!ethers.utils.isAddress(address)) {
      return 'This address is invalid'
    }
  }

  useEffect(() => {
    const fetchConfig = async () => {
      const res = await axios.get<Config>('/api/firestore')
      setConfig(res.data)
      console.log(res.data)
    }
    fetchConfig()
  }, [])

  if (!config) {
    return <Loading />
  }
  return (
    <Center height={'100vh'}>
      <form onSubmit={onSubmit}>
        <VStack gap={8}>
          <FormControl as="fieldset">
            <FormLabel as="legend">ネットワーク</FormLabel>
            <Controller
              name="chainId"
              control={control}
              defaultValue={config.chainId}
              render={({ field: { onChange, value } }) => (
                <RadioGroup
                  onChange={onChange}
                  value={value}
                  defaultValue={config.chainId}
                >
                  <Stack direction="row">
                    <Radio value="1">Etherium</Radio>
                    <Radio value="137">Polygon</Radio>
                  </Stack>
                </RadioGroup>
              )}
            />
            <FormHelperText>
              コントラクトのネットワークを選択してください
            </FormHelperText>
          </FormControl>
          <FormControl isInvalid={typeof errors.contractAddress != 'undefined'}>
            <FormLabel fontSize={'xs'} fontWeight={'semibold'}>
              コントラクトアドレス
            </FormLabel>
            <Input
              defaultValue={config.contractAddress}
              type="text"
              {...register('contractAddress', {
                required: 'Required',
                validate: validateAddress,
              })}
            />
            {errors.contractAddress && (
              <FormErrorMessage fontSize={'xs'}>
                {errors.contractAddress.message}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl
            isInvalid={typeof errors.backgroundImagePC != 'undefined'}
          >
            <FormLabel fontSize={'xs'} fontWeight={'semibold'}>
              背景画像 PC
            </FormLabel>
            <Input
              defaultValue={config.backgroundImagePC}
              type="text"
              {...register('backgroundImagePC', {
                required: 'Required',
              })}
            />
            {errors.backgroundImagePC && (
              <FormErrorMessage fontSize={'xs'}>
                {errors.backgroundImagePC.message}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl
            isInvalid={typeof errors.backgroundImageSP != 'undefined'}
          >
            <FormLabel fontSize={'xs'} fontWeight={'semibold'}>
              背景画像 SP
            </FormLabel>
            <Input
              defaultValue={config.backgroundImageSP}
              type="text"
              {...register('backgroundImageSP', {
                required: 'Required',
              })}
            />
            {errors.backgroundImageSP && (
              <FormErrorMessage fontSize={'xs'}>
                {errors.backgroundImageSP.message}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={typeof errors.centerImage != 'undefined'}>
            <FormLabel fontSize={'xs'} fontWeight={'semibold'}>
              センター画像
            </FormLabel>
            <Input
              defaultValue={config.centerImage}
              type="text"
              {...register('centerImage', {
                required: 'Required',
              })}
            />
            {errors.centerImage && (
              <FormErrorMessage fontSize={'xs'}>
                {errors.centerImage.message}
              </FormErrorMessage>
            )}
          </FormControl>
          <Button type="submit" colorScheme="blue" my={4} width={'full'}>
            更新
          </Button>
        </VStack>
      </form>
    </Center>
  )
}

export default Admin
