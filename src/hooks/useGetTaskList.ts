import { useReadContract } from 'wagmi'
import { CONTRACTS } from '../constants/contracts'
import { OnchainLevelingABI } from '../constants/OnchainLevelingABI'

export type TaskDef = {
  id: bigint
  name: string
  type: number
  goal: number
  xp: number
  enabled: boolean
}

export function useGetTaskList(offset: bigint = BigInt(0), limit: bigint = BigInt(10)) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: CONTRACTS.ONCHAIN_LEVELING,
    abi: OnchainLevelingABI,
    functionName: 'listTaskDefs',
    args: [offset, limit]
  })

  const tasks: TaskDef[] = data && Array.isArray(data) && data.length === 6 ? 
    data[0].map((id: bigint, index: number) => ({
      id,
      name: data[1][index] as string,
      type: data[2][index] as number,
      goal: data[3][index] as number,
      xp: data[4][index] as number,
      enabled: data[5][index] as boolean
    })) : []

  return {
    tasks,
    isLoading,
    error,
    refetch
  }
}