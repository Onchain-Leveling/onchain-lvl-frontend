export const CONTRACTS = {
  ONCHAIN_LEVELING: '0x4d392A384fbb9d3ebf27EB0373588A6f7e164607' as `0x${string}`,
} as const

export const CONTRACT_ADDRESSES = {
  [84532]: { // Base Sepolia
    ONCHAIN_LEVELING: CONTRACTS.ONCHAIN_LEVELING,
  },
} as const