import { useAccount } from 'wagmi'
import { useGetProfile } from './useGetProfile'

export type RegistrationStatus = {
  isRegistered: boolean
  isLoading: boolean
  error: Error | null
  profile?: {
    name: string
    characterType: number
    level: number
    xp: bigint
  }
}

/**
 * Hook to check if the connected user is registered
 * @returns RegistrationStatus object with registration status and profile data
 */
export function useRegistrationStatus(): RegistrationStatus {
  const { address, isConnected } = useAccount()
  const { profile, isLoading, error } = useGetProfile(address)

  // If wallet is not connected, user is not registered
  if (!isConnected || !address) {
    return {
      isRegistered: false,
      isLoading: false,
      error: null,
    }
  }

  // If profile is loading
  if (isLoading) {
    return {
      isRegistered: false,
      isLoading: true,
      error: null,
    }
  }

  // If there's an error fetching profile
  if (error) {
    return {
      isRegistered: false,
      isLoading: false,
      error: error as Error,
    }
  }

  // If profile exists and isRegistered flag is true
  if (profile?.isRegistered) {
    return {
      isRegistered: true,
      isLoading: false,
      error: null,
      profile: {
        name: profile.name,
        characterType: profile.characterType,
        level: profile.level,
        xp: profile.xp,
      },
    }
  }

  // Default: not registered
  return {
    isRegistered: false,
    isLoading: false,
    error: null,
  }
}