import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACTS } from '../constants/contracts'
import { OnchainLevelingABI } from '../constants/OnchainLevelingABI'

export function useCompleteTask() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const completeTask = (taskId: bigint) => {
    writeContract({
      address: CONTRACTS.ONCHAIN_LEVELING,
      abi: OnchainLevelingABI,
      functionName: 'completeTask',
      args: [taskId]
    })
  }

  return {
    completeTask,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error
  }
}