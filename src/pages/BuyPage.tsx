import { useState } from 'react'

const BuyPage = () => {
  const [quantity, setQuantity] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('USDC')
  const pricePerToken = 15

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1)
  }

  const handleIncrease = () => {
    if (quantity < 100) setQuantity(quantity + 1)
  }

  const totalPrice = quantity * pricePerToken

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
              <span className="text-white font-semibold">$15 USDC</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-400">Chain</span>
              <span className="text-blue-500 font-semibold">Base</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-lg p-10 rounded-3xl border border-gray-700 shadow-2xl">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 text-lg">Price per token</span>
              <span className="text-white font-bold text-2xl">$15 USDC</span>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-gray-400 text-lg mb-4">Quantity</label>
            <div className="flex items-center justify-center space-x-6">
              <button
                onClick={handleDecrease}
                className="w-14 h-14 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-2xl font-bold transition-colors"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="text-5xl font-bold text-white w-24 text-center">{quantity}</span>
              <button
                onClick={handleIncrease}
                className="w-14 h-14 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-2xl font-bold transition-colors"
                disabled={quantity >= 100}
              >
                +
              </button>
            </div>
            <p className="text-center text-gray-500 text-sm mt-2">Min: 1 | Max: 100</p>
          </div>

          <div className="mb-8 py-6 bg-blue-900/20 rounded-xl border border-blue-500/30">
            <div className="flex justify-between items-center px-6">
              <span className="text-gray-300 text-xl">Total Price</span>
              <span className="text-blue-400 font-bold text-4xl">${totalPrice} USDC</span>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-gray-400 text-lg mb-4">Payment Method</label>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setPaymentMethod('USDC')}
                className={`py-4 px-6 rounded-lg font-semibold transition-all ${
                  paymentMethod === 'USDC'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                USDC
              </button>
              <button
                onClick={() => setPaymentMethod('ETH')}
                className={`py-4 px-6 rounded-lg font-semibold transition-all ${
                  paymentMethod === 'ETH'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                ETH
              </button>
              <button
                disabled
                className="py-4 px-6 rounded-lg font-semibold bg-gray-800/50 text-gray-600 cursor-not-allowed"
              >
                eHKD
                <span className="block text-xs">coming soon</span>
              </button>
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-lg font-bold text-xl transition-all transform hover:scale-105 shadow-lg">
            Connect Wallet to Buy
          </button>

          <div className="mt-8 p-6 bg-gray-800/30 rounded-xl border border-gray-700">
            <p className="text-gray-300 text-center leading-relaxed">
              Each token can be redeemed for one dozen roses.<br />
              Smart contract will distribute funds upon redemption.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Contract: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb (placeholder)
          </p>
        </div>
      </div>
    </div>
  )
}

export default BuyPage
