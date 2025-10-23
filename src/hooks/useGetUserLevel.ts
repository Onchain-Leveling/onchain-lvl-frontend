import { useReadContract } from 'wagmi'
import { CONTRACTS } from '../constants/contracts'
import { OnchainLevelingABI } from '../constants/OnchainLevelingABI'

export function useGetUserLevel(userAddress?: `0x${string}`) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: CONTRACTS.ONCHAIN_LEVELING,
    abi: OnchainLevelingABI,
    functionName: 'levelOf',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    }
  })

  const level = data ? Number(data) : undefined

  return {
    level,
    isLoading,
    error,
    refetch
  }
}