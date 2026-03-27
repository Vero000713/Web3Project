import { useState } from 'react'
import { formatUnits, parseUnits } from 'viem'
import { useAccount, useReadContract, useWriteContract, useSwitchChain } from 'wagmi'
import { base } from 'wagmi/chains'
import { useToast } from '../components/Toast'
import { FPC_ADDRESS, FLORIST_WALLET, erc20Abi, BASE_EXPLORER } from '../config/contracts'
import { useFpcPricing } from '../hooks/useFpcPricing'

type RedeemStep = 'idle' | 'transferring' | 'confirming' | 'done'

const RedeemPage = () => {
  const [quantity, setQuantity] = useState(1)
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' })
  const [step, setStep] = useState<RedeemStep>('idle')
  const [txHash, setTxHash] = useState('')

  const { address, isConnected, chain } = useAccount()
  const { switchChain } = useSwitchChain()
  const { addToast } = useToast()
  const isOnBase = chain?.id === base.id
  const pricing = useFpcPricing(1)

  const { data: rawBalance, refetch: refetchBalance } = useReadContract({
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
  const maxRedeem = Math.floor(fpcBalance)

  const { writeContract: transferFpc } = useWriteContract()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRedeem = () => {
    if (!isConnected || !address || quantity < 1 || quantity > maxRedeem) return

    const amount = parseUnits(quantity.toString(), decimals)

    setStep('transferring')
    addToast('pending', `Sending ${quantity} FPC to florist wallet...`)

    transferFpc(
      {
        address: FPC_ADDRESS,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [FLORIST_WALLET, amount],
      },
      {
        onSuccess: (hash) => {
          setStep('confirming')
          setTxHash(hash)
          addToast(
            'success',
            `Redemption confirmed! Flowers will be delivered to ${formData.name}`,
            hash,
          )
          setTimeout(() => {
            setStep('done')
            refetchBalance()
          }, 5000)
        },
        onError: (err) => {
          setStep('idle')
          addToast('error', `Transfer failed: ${err.message.slice(0, 100)}`)
        },
      },
    )
  }

  const isBusy = step === 'transferring' || step === 'confirming'
  const formComplete = formData.name && formData.phone && formData.address
  const canRedeem = isConnected && isOnBase && formComplete && quantity >= 1 && quantity <= maxRedeem && !isBusy

  return (
    <div className="min-h-screen bg-base-dark py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Redeem FPC
        </h1>

        {step === 'done' ? (
          <div className="bg-green-900/30 backdrop-blur-lg p-10 rounded-3xl border border-green-500/50 text-center">
            <div className="text-6xl mb-6">✅</div>
            <h2 className="text-3xl font-bold text-white mb-4">Redemption Confirmed!</h2>
            <p className="text-gray-300 text-lg mb-6">
              {quantity} FPC transferred to florist. Your roses are on the way!
            </p>

            <div className="bg-gray-800/50 p-6 rounded-xl mb-6 text-left space-y-3">
              <h3 className="text-white font-semibold mb-3">Order Details</h3>
              <div className="flex justify-between">
                <span className="text-gray-400">Quantity</span>
                <span className="text-white font-bold">{quantity} dozen roses</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Recipient</span>
                <span className="text-white">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Phone</span>
                <span className="text-white">{formData.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Address</span>
                <span className="text-white text-right max-w-[200px]">{formData.address}</span>
              </div>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-xl mb-6 text-left space-y-3">
              <h3 className="text-white font-semibold mb-3">Fund Distribution</h3>
              <div className="flex justify-between">
                <span className="text-gray-400">Flower Supplier</span>
                <span className="text-green-400 font-bold">${quantity * 5}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Courier</span>
                <span className="text-yellow-400 font-bold">${quantity * 2}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Florist Shop</span>
                <span className="text-blue-400 font-bold">${quantity * 8}</span>
              </div>
            </div>

            {txHash && (
              <a
                href={`${BASE_EXPLORER}/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline text-sm"
              >
                View transaction on BaseScan
              </a>
            )}
          </div>
        ) : (
          <div className="bg-gray-900/50 backdrop-blur-lg p-10 rounded-3xl border border-gray-700">
            {!isConnected && (
              <div className="mb-8 p-4 rounded-xl border border-yellow-500/30 bg-yellow-900/20 text-center">
                <p className="text-yellow-300">Connect wallet to redeem FPC tokens</p>
              </div>
            )}

            {isConnected && !isOnBase && (
              <div className="mb-8 flex items-center justify-between gap-3 rounded-lg border border-yellow-500/40 bg-yellow-900/20 p-4">
                <p className="text-yellow-300">Switch to Base network to continue</p>
                <button
                  onClick={() => switchChain({ chainId: base.id })}
                  className="rounded-lg bg-yellow-600 px-3 py-2 text-sm font-semibold text-white hover:bg-yellow-700"
                >
                  Switch to Base
                </button>
              </div>
            )}

            <div className="mb-8 p-6 bg-blue-900/20 rounded-xl border border-blue-500/30">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-lg">Your FPC Balance</span>
                <span className="text-blue-400 font-bold text-3xl">
                  {isConnected && isOnBase ? fpcBalance : '—'} FPC
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-2">
                = {isConnected && isOnBase ? fpcBalance : 0} dozen roses available
              </p>
            </div>

            <div className="mb-8">
              <label className="block text-gray-300 text-xl font-semibold mb-4">
                How many dozens of roses?
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  min="1"
                  max={maxRedeem || 1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(maxRedeem || 1, Math.max(1, parseInt(e.target.value) || 1)))}
                  disabled={!isConnected || !isOnBase || maxRedeem === 0 || isBusy}
                  className="flex-grow bg-gray-800 border border-gray-700 rounded-lg px-6 py-4 text-white text-2xl font-bold focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
                />
                <span className="text-gray-400 text-sm whitespace-nowrap">
                  1 FPC = 1 dozen roses
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-2">
                {pricing.loading
                  ? 'Reading on-chain quote...'
                  : pricing.usdcPerFpc !== null
                    ? `On-chain: 1 FPC ≈ ${pricing.usdcPerFpc.toFixed(6)} USDC${pricing.ethPerFpc !== null ? ` / ${pricing.ethPerFpc.toFixed(8)} ETH` : ''}`
                    : 'No on-chain quote available'}
              </p>
              {maxRedeem === 0 && isConnected && isOnBase && (
                <p className="text-red-400 text-sm mt-2">You don't have any FPC tokens to redeem</p>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Delivery Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 mb-2">Recipient Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isBusy}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Contact Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={isBusy}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Detailed Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    disabled={isBusy}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none disabled:opacity-50"
                    placeholder="Enter your delivery address"
                  />
                </div>
              </div>
            </div>

            <div className="mb-8 p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl border border-blue-500/30">
              <h3 className="text-lg font-semibold text-white mb-3">How It Works</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                When you redeem, {quantity} FPC will be transferred to the florist's multisig wallet.
                The florist will arrange delivery to your address.
              </p>
              <p className="text-gray-300 leading-relaxed">Per token fund distribution:</p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center">
                  <span className="text-green-400 font-bold text-xl w-12">$5</span>
                  <span className="text-gray-300">→ Flower Supplier</span>
                </div>
                <div className="flex items-center">
                  <span className="text-yellow-400 font-bold text-xl w-12">$2</span>
                  <span className="text-gray-300">→ Courier</span>
                </div>
                <div className="flex items-center">
                  <span className="text-blue-400 font-bold text-xl w-12">$8</span>
                  <span className="text-gray-300">→ Florist Shop (after 3% platform fee)</span>
                </div>
              </div>
            </div>

            {isBusy && (
              <div className="mb-6 p-4 rounded-xl border border-blue-500/30 bg-blue-900/20">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
                  <span className="text-blue-300 text-sm">
                    {step === 'transferring' ? 'Confirm transfer in your wallet...' : 'Waiting for confirmation on chain...'}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={handleRedeem}
              disabled={!canRedeem}
              className={`w-full py-4 rounded-lg font-bold text-xl transition-all ${
                canRedeem
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transform hover:scale-105 shadow-lg cursor-pointer'
                  : 'bg-gray-800 text-gray-600 cursor-not-allowed'
              }`}
            >
              {!isConnected
                ? 'Connect Wallet First'
                : !isOnBase
                  ? 'Switch to Base Network'
                  : isBusy
                    ? 'Processing...'
                    : `Redeem ${quantity} FPC for ${quantity} Dozen Roses`}
            </button>

            <p className="text-gray-500 text-xs text-center mt-4 font-mono">
              Florist Wallet: {FLORIST_WALLET}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RedeemPage
