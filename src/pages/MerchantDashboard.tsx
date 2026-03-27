const MerchantDashboard = () => {
  const tokensSold = 45
  const totalSupply = 100
  const totalRevenue = 675
  const progressPercentage = (tokensSold / totalSupply) * 100

  const mockOrders = [
    { id: '001', quantity: 1, status: 'Ready to ship' },
    { id: '002', quantity: 2, status: 'Ready to ship' },
  ]

  return (
    <div className="min-h-screen bg-base-dark py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Florist Shop Dashboard
        </h1>

        <div className="bg-gray-900/50 backdrop-blur-lg p-8 rounded-2xl border border-gray-700 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-white">Sales Progress</h2>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Tokens Sold</span>
              <span className="text-white font-bold text-xl">{tokensSold} / {totalSupply}</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-6 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-center text-gray-400 mt-2">{progressPercentage}% Complete</p>
          </div>
          <div className="mt-6 p-6 bg-blue-900/20 rounded-xl border border-blue-500/30">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-lg">Total Revenue (Locked in Contract)</span>
              <span className="text-blue-400 font-bold text-3xl">${totalRevenue} USDC</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-lg p-8 rounded-2xl border border-gray-700 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-white">Fund Distribution</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-900/30 to-green-700/20 p-6 rounded-xl border border-green-500/30">
              <h3 className="text-green-400 font-semibold mb-2">Supplier</h3>
              <p className="text-4xl font-bold text-white mb-1">$225</p>
              <p className="text-gray-400 text-sm">released</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-700/20 p-6 rounded-xl border border-yellow-500/30">
              <h3 className="text-yellow-400 font-semibold mb-2">Logistics</h3>
              <p className="text-4xl font-bold text-white mb-1">$90</p>
              <p className="text-gray-400 text-sm">released</p>
            </div>

            <div className="bg-gradient-to-br from-blue-900/30 to-blue-700/20 p-6 rounded-xl border border-blue-500/30">
              <h3 className="text-blue-400 font-semibold mb-2">Florist</h3>
              <p className="text-4xl font-bold text-white mb-1">$315</p>
              <p className="text-gray-400 text-sm">ready to withdraw</p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-3 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg">
              Withdraw Funds
            </button>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-lg p-8 rounded-2xl border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-white">Pending Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Order ID</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Quantity</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Status</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {mockOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                    <td className="py-4 px-4 text-white font-mono">#{order.id}</td>
                    <td className="py-4 px-4 text-white">{order.quantity} token{order.quantity > 1 ? 's' : ''}</td>
                    <td className="py-4 px-4 text-yellow-400">{order.status}</td>
                    <td className="py-4 px-4">
                      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                        Mark as Shipped
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MerchantDashboard
