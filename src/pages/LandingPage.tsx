import { Link } from 'react-router-dom'

const LandingPage = () => {
  return (
    <div className="bg-base-dark text-white">
      <section className="min-h-screen flex items-center px-4 py-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                Florist Prepaid Coupon
              </h1>
              <p className="text-2xl md:text-3xl text-gray-300">
                Invest in Your Local Florist, Get Roses in Return
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105">
                  Connect Wallet
                </button>
                <Link to="/buy">
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105">
                    Buy FPC
                  </button>
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-blue-500 transition-colors">
                <div className="text-4xl mb-4">🌹</div>
                <h3 className="text-2xl font-bold mb-4">For Buyers</h3>
                <p className="text-gray-300 leading-relaxed">
                  1 FPC can be redeemed for 1 dozen roses. 
                  Price is quoted on-chain in USDC/ETH by the deployed contract.
                </p>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-purple-500 transition-colors">
                <div className="text-4xl mb-4">💐</div>
                <h3 className="text-2xl font-bold mb-4">For Florist</h3>
                <p className="text-gray-300 leading-relaxed">
                  Zero-interest financing with automatic fund distribution. 
                  No banks, no paperwork, just instant liquidity for your business.
                </p>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-green-500 transition-colors">
                <div className="text-4xl mb-4">🔐</div>
                <h3 className="text-2xl font-bold mb-4">Smart Contract</h3>
                <p className="text-gray-300 leading-relaxed">
                  Automated fund distribution on redemption. 
                  Every transaction is transparent and traceable on the blockchain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
