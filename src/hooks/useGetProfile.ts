import { useReadContract } from 'wagmi'
import { CONTRACTS } from '../constants/contracts'
import { OnchainLevelingABI } from '../constants/OnchainLevelingABI'

export type UserProfile = {
  name: string
  characterType: number
  level: number
  xp: bigint
  isRegistered: boolean
}

export function useGetProfile(userAddress?: `0x${string}`) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: CONTRACTS.ONCHAIN_LEVELING,
    abi: OnchainLevelingABI,
    functionName: 'getProfile',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    }
  })

  const profile: UserProfile | undefined = data && Array.isArray(data) ? {
    name: data[0] as string,
    characterType: data[1] as number,
    level: data[2] as number,
    xp: data[3] as bigint,
    isRegistered: data[4] as boolean
  } : undefined

  return {
    profile,
    isLoading,
    error,
    refetch
  }
}