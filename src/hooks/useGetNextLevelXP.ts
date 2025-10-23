import { useReadContract } from 'wagmi'
import { CONTRACTS } from '../constants/contracts'
import { OnchainLevelingABI } from '../constants/OnchainLevelingABI'

export type NextLevelXp = {
  remaining: bigint
  nextLevelCumulative: bigint
}

export function useGetNextLevelXp(userAddress?: `0x${string}`) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: CONTRACTS.ONCHAIN_LEVELING,
    abi: OnchainLevelingABI,
    functionName: 'nextLevelXp',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    }
  })

  const nextLevelXp: NextLevelXp | undefined = data && Array.isArray(data) ? {
    remaining: data[0] as bigint,
    nextLevelCumulative: data[1] as bigint
  } : undefined

  return {
    nextLevelXp,
    isLoading,
    error,
    refetch
  }
}