import { useEffect, useState } from 'react'
import { formatUnits } from 'viem'
import { useAccount, useReadContract, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { base } from 'wagmi/chains'
import { useToast } from '../components/Toast'
import { FPC_ADDRESS, USDC_ADDRESS, erc20Abi, fpcAbi } from '../config/contracts'
import { useFpcPricing } from '../hooks/useFpcPricing'

type BuyStep = 'idle' | 'buying' | 'confirming' | 'done'

const BuyPage = () => {
  const [quantity, setQuantity] = useState(1)
  const [step, setStep] = useState<BuyStep>('idle')

  const { address, isConnected, chain } = useAccount()
  const { switchChain } = useSwitchChain()
  const { addToast } = useToast()
  const isOnBase = chain?.id === base.id

  const pricing = useFpcPricing(quantity)
  const priceUsdc = pricing.usdcPerFpc
  const priceEth = pricing.ethPerFpc
  const totalEthRaw = (pricing.ethPerFpcRaw ?? 0n) * BigInt(quantity)
  const totalEth = Number(formatUnits(totalEthRaw, 18))

  const { data: usdcBalance } = useReadContract({
    address: USDC_ADDRESS,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address!],
    query: { enabled: Boolean(address && isOnBase) },
  })
  const { data: userFpcRaw, refetch: refetchUserFpc } = useReadContract({
    address: FPC_ADDRESS,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address!],
    query: { enabled: Boolean(address && isOnBase) },
  })

  const hasEnoughUsdc = Boolean(usdcBalance && priceUsdc && Number(formatUnits(usdcBalance, 6)) >= priceUsdc * quantity)
  const previousFpcBalance = userFpcRaw ?? 0n

  const { writeContract: buyCoupon, data: buyTxHash } = useWriteContract()

  const { isLoading: isBuyConfirming, isSuccess: isBuyConfirmed } = useWaitForTransactionReceipt({
    hash: buyTxHash,
    query: {
      enabled: Boolean(buyTxHash),
    },
  })

  useEffect(() => {
    if (!isBuyConfirmed || step !== 'confirming') return
    refetchUserFpc()
    setStep('done')
    addToast('success', 'Purchase confirmed on-chain. FPC should now be in your wallet.', buyTxHash)
  }, [isBuyConfirmed, step, refetchUserFpc, addToast, buyTxHash])

  const handleBuy = async () => {
    if (!isConnected || !address) return

    try {
      setStep('buying')
      addToast('pending', `Calling buyCoupon(${quantity}) with ${totalEth.toFixed(12)} ETH...`)
      buyCoupon(
        {
          address: FPC_ADDRESS,
          abi: fpcAbi,
          functionName: 'buyCoupon',
          args: [BigInt(quantity)],
          value: totalEthRaw,
        },
        {
          onSuccess: (hash) => {
            setStep('confirming')
            addToast('info', 'Transaction submitted, waiting on-chain confirmation...', hash)
          },
          onError: (err) => {
            setStep('idle')
            addToast('error', `Buy failed: ${err.message.slice(0, 140)}`)
          },
        },
      )
    } catch {
      setStep('idle')
      addToast('error', 'Transaction failed')
    }
  }

  const handleDecrease = () => { if (quantity > 1) setQuantity(quantity - 1) }
  const handleIncrease = () => { if (quantity < 100) setQuantity(quantity + 1) }

  const isBusy = step !== 'idle' && step !== 'done'
  const usdcBalanceFormatted = usdcBalance !== undefined ? Number(formatUnits(usdcBalance, 6)).toFixed(2) : '—'

  const getButtonText = () => {
    if (!isConnected) return 'Connect Wallet First'
    if (!isOnBase) return 'Switch to Base Network'
    if (isBuyConfirming || step === 'confirming') return 'Confirming Purchase...'
    if (step === 'buying') return 'Submitting Buy...'
    if (step === 'done') return '✅ Purchase Complete!'
    return `Pay ${totalEth.toFixed(12)} ETH to Buy ${quantity} FPC`
  }

  return (
    <div className="min-h-screen bg-base-dark py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Buy FPC Prepaid Coupon
        </h1>

        <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-lg p-8 rounded-2xl border border-blue-500/30 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-white">Token Information</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-700">
              <span className="text-gray-400">Token</span>
              <span className="text-white font-semibold">FloristPrepaidCoupon (FPC)</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-700">
              <span className="text-gray-400">Supply</span>
              <span className="text-white font-semibold">100 tokens</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-700">
              <span className="text-gray-400">Price</span>
              <span className="text-white font-semibold">
                {priceUsdc !== null ? `${priceUsdc.toFixed(6)} USDC` : 'N/A (contract not exposing USDC quote)'}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-700">
              <span className="text-gray-400">Price (ETH)</span>
              <span className="text-white font-semibold">
                {priceEth !== null ? `${priceEth.toFixed(12)} ETH` : 'N/A'}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Pricing source: {pricing.source === 'contract' ? 'On-chain contract quote' : 'Fallback from token issuance ratio (1 FPC = 0.000001 ETH)'}
            </p>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-400">Chain</span>
              <span className="text-blue-500 font-semibold">Base</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-lg p-10 rounded-3xl border border-gray-700 shadow-2xl">
          {isConnected && isOnBase && (
            <div className="mb-8 flex justify-between items-center py-4 px-5 bg-gray-800/50 rounded-xl border border-gray-700">
              <span className="text-gray-400">Your USDC Balance</span>
              <span className="text-white font-bold text-lg">{usdcBalanceFormatted} USDC</span>
            </div>
          )}

          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 text-lg">Price per token</span>
              <span className="text-white font-bold text-2xl">
                {priceEth !== null ? `${priceEth.toFixed(12)} ETH` : 'N/A'}
              </span>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-gray-400 text-lg mb-4">Quantity</label>
            <div className="flex items-center justify-center space-x-6">
              <button
                onClick={handleDecrease}
                className="w-14 h-14 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-2xl font-bold transition-colors disabled:opacity-50"
                disabled={quantity <= 1 || isBusy}
              >
                -
              </button>
              <span className="text-5xl font-bold text-white w-24 text-center">{quantity}</span>
              <button
                onClick={handleIncrease}
                className="w-14 h-14 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-2xl font-bold transition-colors disabled:opacity-50"
                disabled={quantity >= 100 || isBusy}
              >
                +
              </button>
            </div>
            <p className="text-center text-gray-500 text-sm mt-2">Min: 1 | Max: 100</p>
          </div>

          <div className="mb-8 py-6 bg-blue-900/20 rounded-xl border border-blue-500/30">
            <div className="flex justify-between items-center px-6">
              <span className="text-gray-300 text-xl">Total Price</span>
              <span className="text-blue-400 font-bold text-4xl">
                {`${totalEth.toFixed(12)} ETH`}
              </span>
            </div>
            {priceUsdc !== null && (
              <p className="mt-2 text-center text-sm text-gray-400">
                Approx. {(priceUsdc * quantity).toFixed(6)} USDC
              </p>
            )}
          </div>

          {step !== 'idle' && step !== 'done' && (
            <div className="mb-6 p-4 rounded-xl border border-blue-500/30 bg-blue-900/20">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
                <span className="text-blue-300 text-sm">
                  {step === 'buying' && 'Confirm buy transaction in wallet...'}
                  {step === 'confirming' && 'Purchase confirming on chain...'}
                </span>
              </div>
            </div>
          )}

          {step === 'done' && (
            <div className="mb-6 p-4 rounded-xl border border-green-500/30 bg-green-900/20">
              <p className="text-green-300 text-sm text-center">
                🎉 Buy confirmed! FPC has been minted/transferred to your wallet.
              </p>
              <p className="text-center text-xs text-gray-400 mt-2">
                Wallet FPC balance before tx: {formatUnits(previousFpcBalance, 18)}
              </p>
            </div>
          )}

          <button
            onClick={!isOnBase && isConnected ? () => switchChain({ chainId: base.id }) : handleBuy}
            disabled={
              !isConnected || isBusy || (isOnBase && !priceEth)
            }
            className={`w-full py-4 rounded-lg font-bold text-xl transition-all ${
              !isConnected || isBusy || (isOnBase && !priceEth)
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transform hover:scale-105 shadow-lg'
            }`}
          >
            {getButtonText()}
          </button>

          {!hasEnoughUsdc && priceUsdc !== null && (
            <p className="mt-4 text-center text-xs text-yellow-300">USDC may be insufficient for equivalent value ({usdcBalanceFormatted} USDC)</p>
          )}

          <div className="mt-8 p-6 bg-gray-800/30 rounded-xl border border-gray-700">
            <p className="text-gray-300 text-center leading-relaxed">
              1 FPC can be redeemed for one dozen roses.<br />
              Purchase uses contract `buyCoupon()` so tokens can flow into buyer wallet.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm font-mono">
            FPC: {FPC_ADDRESS}
          </p>
        </div>
      </div>
    </div>
  )
}

export default BuyPage
