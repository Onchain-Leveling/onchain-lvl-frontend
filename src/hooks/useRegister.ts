import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACTS } from '../constants/contracts'
import { OnchainLevelingABI } from '../constants/OnchainLevelingABI'

export type CharacterType = 1 | 2

export const CHARACTER_TYPES = {
  DEGEN: 1 as CharacterType,
  RUNNER: 2 as CharacterType
} as const

export function useRegister() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const register = (name: string, characterType: CharacterType) => {
    writeContract({
      address: CONTRACTS.ONCHAIN_LEVELING,
      abi: OnchainLevelingABI,
      functionName: 'register',
      args: [name, characterType]
    })
  }

  return {
    register,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error
  }
}