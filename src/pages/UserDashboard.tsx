import { Link } from 'react-router-dom'
import { formatUnits } from 'viem'
import { useAccount, useReadContract, useSwitchChain } from 'wagmi'
import { base } from 'wagmi/chains'
import { FPC_ADDRESS, erc20Abi } from '../config/contracts'
import { useFpcPricing } from '../hooks/useFpcPricing'

const shortenAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`

const UserDashboard = () => {
  const { address, chain, isConnected } = useAccount()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const isOnBase = chain?.id === base.id
  const pricing = useFpcPricing(1)

  const { data: rawBalance, isLoading: isBalanceLoading, refetch: refetchBalance } = useReadContract({
    address: FPC_ADDRESS,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address!],
    query: { enabled: Boolean(address && isOnBase) },
  })

  const { data: tokenDecimals } = useReadContract({
    address: FPC_ADDRESS,
    abi: erc20Abi,
    functionName: 'decimals',
    query: { enabled: isOnBase },
  })

  const decimals = Number(tokenDecimals ?? 18)
  const fpcBalance = rawBalance ? Number(formatUnits(rawBalance, decimals)) : 0
  const estimatedUsdcRaw =
    rawBalance && pricing.usdcPerFpcRaw
      ? (rawBalance * pricing.usdcPerFpcRaw) / 10n ** BigInt(decimals)
      : 0n
  const estimatedValue = Number(formatUnits(estimatedUsdcRaw, pricing.usdcDecimals))

  const mockTransactions = [
    { date: '2026-03-26', quantity: 1, status: 'Delivered', emoji: '✅' },
    { date: '2026-03-20', quantity: 1, status: 'Delivered', emoji: '✅' },
    { date: '2026-03-15', quantity: 1, status: 'Processing', emoji: '🔄' },
  ]

  return (
    <div className="min-h-screen bg-base-dark py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          My Dashboard
        </h1>

        <div className="bg-gray-900/50 backdrop-blur-lg p-8 rounded-2xl border border-gray-700 mb-8">
          <div className="flex items-center justify-between mb-6">
            <span className="text-gray-400 text-lg">Connected Wallet</span>
            <span className="text-white font-mono text-lg">{address ? shortenAddress(address) : 'Not connected'}</span>
          </div>
          {!isConnected && <p className="text-yellow-400">Connect wallet to view balance</p>}
          {isConnected && !isOnBase && (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-yellow-500/40 bg-yellow-900/20 p-4">
              <p className="text-yellow-300">Please switch to Base network</p>
              <button
                onClick={() => switchChain({ chainId: base.id })}
                disabled={isSwitching}
                className="rounded-lg bg-yellow-600 px-3 py-2 text-sm font-semibold text-white hover:bg-yellow-700 disabled:opacity-70"
              >
                {isSwitching ? 'Switching...' : 'Switch to Base'}
              </button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-700/20 backdrop-blur-lg p-8 rounded-2xl border border-blue-500/30">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm uppercase tracking-wider">FPC Balance</h3>
              {isConnected && isOnBase && (
                <button
                  onClick={() => refetchBalance()}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  ↻ Refresh
                </button>
              )}
            </div>
            <p className="text-5xl font-bold text-white mb-2">
              {isConnected && isOnBase ? (isBalanceLoading ? '...' : fpcBalance) : '—'}
            </p>
            <p className="text-blue-400">tokens</p>
            {isConnected && isOnBase && fpcBalance > 0 && (
              <p className="text-gray-500 text-sm mt-1">= {Math.floor(fpcBalance)} dozen roses</p>
            )}
          </div>

          <div className="bg-gradient-to-br from-purple-900/30 to-purple-700/20 backdrop-blur-lg p-8 rounded-2xl border border-purple-500/30">
            <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Estimated Value</h3>
            <p className="text-5xl font-bold text-white mb-2">
              ${isConnected && isOnBase && pricing.usdcPerFpcRaw ? estimatedValue.toFixed(6) : 'N/A'}
            </p>
            <p className="text-purple-400">USDC</p>
            <p className="text-gray-500 text-xs mt-2">
              {pricing.loading
                ? 'Reading on-chain price...'
                : pricing.usdcPerFpc !== null
                  ? `1 FPC ≈ ${pricing.usdcPerFpc.toFixed(6)} USDC`
                  : 'No on-chain USDC quote'}
            </p>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-lg p-8 rounded-2xl border border-gray-700 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-white">Redemption History</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Date</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Quantity</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockTransactions.map((tx, index) => (
                  <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                    <td className="py-4 px-4 text-white">{tx.date}</td>
                    <td className="py-4 px-4 text-white">{tx.quantity} token</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center space-x-2">
                        <span>{tx.emoji}</span>
                        <span className="text-white">{tx.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center">
          <Link to="/redeem">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-lg font-bold text-xl transition-all transform hover:scale-105 shadow-lg">
              Redeem Token
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
