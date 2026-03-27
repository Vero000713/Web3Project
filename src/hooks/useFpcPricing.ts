import { useEffect, useMemo, useState } from 'react'
import { formatUnits } from 'viem'
import { usePublicClient } from 'wagmi'
import { base } from 'wagmi/chains'
import { FPC_ADDRESS, USDC_ADDRESS, erc20Abi } from '../config/contracts'

const uint256Input = [{ name: 'quantity', type: 'uint256' }] as const
const uint256Output = [{ name: '', type: 'uint256' }] as const

const quoteBuyAbi = [{ type: 'function', name: 'quoteBuy', stateMutability: 'view', inputs: uint256Input, outputs: uint256Output }] as const
const getBuyPriceAbi = [{ type: 'function', name: 'getBuyPrice', stateMutability: 'view', inputs: uint256Input, outputs: uint256Output }] as const
const getUsdcAmountAbi = [{ type: 'function', name: 'getUsdcAmount', stateMutability: 'view', inputs: uint256Input, outputs: uint256Output }] as const
const usdcPriceAbi = [{ type: 'function', name: 'usdcPrice', stateMutability: 'view', inputs: [], outputs: uint256Output }] as const
const priceUsdcAbi = [{ type: 'function', name: 'priceUsdc', stateMutability: 'view', inputs: [], outputs: uint256Output }] as const
const pricePerFpcUsdcAbi = [{ type: 'function', name: 'pricePerFpcUsdc', stateMutability: 'view', inputs: [], outputs: uint256Output }] as const
const priceInUsdcAbi = [{ type: 'function', name: 'priceInUsdc', stateMutability: 'view', inputs: [], outputs: uint256Output }] as const

const ethPriceAbi = [{ type: 'function', name: 'ethPrice', stateMutability: 'view', inputs: [], outputs: uint256Output }] as const
const priceEthAbi = [{ type: 'function', name: 'priceEth', stateMutability: 'view', inputs: [], outputs: uint256Output }] as const
const pricePerFpcEthAbi = [{ type: 'function', name: 'pricePerFpcEth', stateMutability: 'view', inputs: [], outputs: uint256Output }] as const
const priceInEthAbi = [{ type: 'function', name: 'priceInEth', stateMutability: 'view', inputs: [], outputs: uint256Output }] as const

type PricingState = {
  loading: boolean
  error: string | null
  usdcDecimals: number
  fpcDecimals: number
  usdcPerFpcRaw: bigint | null
  ethPerFpcRaw: bigint | null
  requiredUsdcRaw: bigint | null
  source: 'contract' | 'fallback'
}

const initialState: PricingState = {
  loading: true,
  error: null,
  usdcDecimals: 6,
  fpcDecimals: 18,
  usdcPerFpcRaw: null,
  ethPerFpcRaw: null,
  requiredUsdcRaw: null,
  source: 'fallback',
}

const DEFAULT_ETH_PER_FPC_RAW = 1_000_000_000_000n // 0.000001 ETH

export const useFpcPricing = (quantity: number) => {
  const client = usePublicClient({ chainId: base.id })
  const [state, setState] = useState<PricingState>(initialState)
  const qty = BigInt(Math.max(1, Math.floor(quantity)))

  useEffect(() => {
    let cancelled = false

    const readFirst = async (calls: Array<() => Promise<bigint>>): Promise<bigint | null> => {
      for (const call of calls) {
        try {
          const value = await call()
          return value
        } catch {
          // try next signature
        }
      }
      return null
    }

    const fetchPricing = async () => {
      if (!client) return

      setState((prev) => ({ ...prev, loading: true, error: null }))

      try {
        const [usdcDecimalsRaw, fpcDecimalsRaw] = await Promise.all([
          client.readContract({ address: USDC_ADDRESS, abi: erc20Abi, functionName: 'decimals' }),
          client.readContract({ address: FPC_ADDRESS, abi: erc20Abi, functionName: 'decimals' }),
        ])

        const usdcDecimals = Number(usdcDecimalsRaw ?? 6)
        const fpcDecimals = Number(fpcDecimalsRaw ?? 18)

        const usdcPerFpcRaw = await readFirst([
          () => client.readContract({ address: FPC_ADDRESS, abi: quoteBuyAbi, functionName: 'quoteBuy', args: [1n] }),
          () => client.readContract({ address: FPC_ADDRESS, abi: getBuyPriceAbi, functionName: 'getBuyPrice', args: [1n] }),
          () => client.readContract({ address: FPC_ADDRESS, abi: getUsdcAmountAbi, functionName: 'getUsdcAmount', args: [1n] }),
          () => client.readContract({ address: FPC_ADDRESS, abi: usdcPriceAbi, functionName: 'usdcPrice' }),
          () => client.readContract({ address: FPC_ADDRESS, abi: priceUsdcAbi, functionName: 'priceUsdc' }),
          () => client.readContract({ address: FPC_ADDRESS, abi: pricePerFpcUsdcAbi, functionName: 'pricePerFpcUsdc' }),
          () => client.readContract({ address: FPC_ADDRESS, abi: priceInUsdcAbi, functionName: 'priceInUsdc' }),
        ])

        const totalUsdcRaw = await readFirst([
          () => client.readContract({ address: FPC_ADDRESS, abi: quoteBuyAbi, functionName: 'quoteBuy', args: [qty] }),
          () => client.readContract({ address: FPC_ADDRESS, abi: getBuyPriceAbi, functionName: 'getBuyPrice', args: [qty] }),
          () => client.readContract({ address: FPC_ADDRESS, abi: getUsdcAmountAbi, functionName: 'getUsdcAmount', args: [qty] }),
        ])

        const requiredUsdcRaw = totalUsdcRaw ?? (usdcPerFpcRaw ? usdcPerFpcRaw * qty : null)

        const contractEthPerFpcRaw = await readFirst([
          () => client.readContract({ address: FPC_ADDRESS, abi: ethPriceAbi, functionName: 'ethPrice' }),
          () => client.readContract({ address: FPC_ADDRESS, abi: priceEthAbi, functionName: 'priceEth' }),
          () => client.readContract({ address: FPC_ADDRESS, abi: pricePerFpcEthAbi, functionName: 'pricePerFpcEth' }),
          () => client.readContract({ address: FPC_ADDRESS, abi: priceInEthAbi, functionName: 'priceInEth' }),
        ])
        const ethPerFpcRaw = contractEthPerFpcRaw ?? DEFAULT_ETH_PER_FPC_RAW

        if (!cancelled) {
          setState({
            loading: false,
            error: null,
            usdcDecimals,
            fpcDecimals,
            usdcPerFpcRaw,
            ethPerFpcRaw,
            requiredUsdcRaw,
            source: usdcPerFpcRaw || contractEthPerFpcRaw ? 'contract' : 'fallback',
          })
        }
      } catch (error) {
        if (!cancelled) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to read on-chain price',
          }))
        }
      }
    }

    fetchPricing()
    return () => {
      cancelled = true
    }
  }, [client, qty])

  return useMemo(
    () => ({
      ...state,
      usdcPerFpc: state.usdcPerFpcRaw ? Number(formatUnits(state.usdcPerFpcRaw, state.usdcDecimals)) : null,
      ethPerFpc: state.ethPerFpcRaw ? Number(formatUnits(state.ethPerFpcRaw, 18)) : null,
      requiredUsdc: state.requiredUsdcRaw ? Number(formatUnits(state.requiredUsdcRaw, state.usdcDecimals)) : null,
    }),
    [state],
  )
}
