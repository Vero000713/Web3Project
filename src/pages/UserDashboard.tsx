import { Link } from 'react-router-dom'

const UserDashboard = () => {
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
            <span className="text-white font-mono text-lg">0x1234...5678</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-700/20 backdrop-blur-lg p-8 rounded-2xl border border-blue-500/30">
            <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">FPC Balance</h3>
            <p className="text-5xl font-bold text-white mb-2">3</p>
            <p className="text-blue-400">tokens</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/30 to-purple-700/20 backdrop-blur-lg p-8 rounded-2xl border border-purple-500/30">
            <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Total Spent</h3>
            <p className="text-5xl font-bold text-white mb-2">$45</p>
            <p className="text-purple-400">USDC</p>
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
