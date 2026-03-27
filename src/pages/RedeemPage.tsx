import { useState } from 'react'

const RedeemPage = () => {
  const [quantity, setQuantity] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  })
  const [showConfirmation, setShowConfirmation] = useState(false)

  const fpcBalance = 3

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleConfirm = () => {
    setShowConfirmation(true)
  }

  return (
    <div className="min-h-screen bg-base-dark py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Redeem FPC
        </h1>

        {showConfirmation ? (
          <div className="bg-green-900/30 backdrop-blur-lg p-10 rounded-3xl border border-green-500/50 text-center">
            <div className="text-6xl mb-6">✅</div>
            <h2 className="text-3xl font-bold text-white mb-4">Redemption Confirmed!</h2>
            <p className="text-gray-300 text-lg mb-6">
              {quantity} FPC token{quantity > 1 ? 's' : ''} will be burned and smart contract will distribute funds:
            </p>
            <div className="bg-gray-800/50 p-6 rounded-xl mb-6">
              <div className="space-y-3 text-left">
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
            </div>
            <p className="text-gray-400">Your roses will be delivered to the address provided.</p>
          </div>
        ) : (
          <div className="bg-gray-900/50 backdrop-blur-lg p-10 rounded-3xl border border-gray-700">
            <div className="mb-8 p-6 bg-blue-900/20 rounded-xl border border-blue-500/30">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-lg">Your FPC Balance</span>
                <span className="text-blue-400 font-bold text-3xl">{fpcBalance} FPC</span>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-gray-300 text-xl font-semibold mb-4">
                How many dozens of roses?
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  min="1"
                  max={fpcBalance}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(fpcBalance, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="flex-grow bg-gray-800 border border-gray-700 rounded-lg px-6 py-4 text-white text-2xl font-bold focus:outline-none focus:border-blue-500 transition-colors"
                />
                <span className="text-gray-400 text-sm whitespace-nowrap">
                  1 FPC = 1 dozen roses
                </span>
              </div>
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
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
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
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
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
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    placeholder="Enter your delivery address"
                  />
                </div>
              </div>
            </div>

            <div className="mb-8 p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl border border-blue-500/30">
              <h3 className="text-lg font-semibold text-white mb-3">Fund Distribution Per Token</h3>
              <p className="text-gray-300 leading-relaxed">
                When you redeem 1 FPC:
              </p>
              <div className="mt-4 space-y-2">
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

            <button
              onClick={handleConfirm}
              disabled={!formData.name || !formData.phone || !formData.address}
              className={`w-full py-4 rounded-lg font-bold text-xl transition-all ${
                formData.name && formData.phone && formData.address
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transform hover:scale-105 shadow-lg cursor-pointer'
                  : 'bg-gray-800 text-gray-600 cursor-not-allowed'
              }`}
            >
              Confirm Redemption
            </button>

            <p className="text-gray-500 text-sm text-center mt-4">
              This will burn {quantity} FPC token{quantity > 1 ? 's' : ''} and trigger smart contract fund distribution
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RedeemPage
