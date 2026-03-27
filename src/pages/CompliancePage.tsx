const CompliancePage = () => {
  const mockTransactions = [
    { txHash: '0xabc...123', amount: '$15', type: 'Buy', date: '2026-03-26' },
    { txHash: '0xdef...456', amount: '1 token', type: 'Redeem', date: '2026-03-25' },
  ]

  return (
    <div className="min-h-screen bg-base-dark py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Compliance & Wallet
        </h1>

        <div className="bg-gray-900/50 backdrop-blur-lg p-8 rounded-2xl border border-gray-700 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-white">Wallet Information</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-4 border-b border-gray-800">
              <span className="text-gray-400">Connected Wallet</span>
              <span className="text-white font-mono">0x1234...5678</span>
            </div>
            <div className="flex justify-between items-center py-4 border-b border-gray-800">
              <span className="text-gray-400">Network</span>
              <span className="text-green-400 flex items-center">
                <span className="mr-2">Base</span>
                <span>✅</span>
              </span>
            </div>
            <div className="flex justify-between items-center py-4 border-b border-gray-800">
              <span className="text-gray-400">KYC Status</span>
              <span className="bg-green-500/20 text-green-400 px-4 py-1 rounded-full font-semibold">
                Verified
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-lg p-8 rounded-2xl border border-gray-700 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-white">Transaction History</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Tx Hash</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Amount</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Type</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {mockTransactions.map((tx, index) => (
                  <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                    <td className="py-4 px-4 text-blue-400 font-mono">{tx.txHash}</td>
                    <td className="py-4 px-4 text-white">{tx.amount}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        tx.type === 'Buy' ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-300">{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-lg p-8 rounded-2xl border border-gray-700 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-white">Smart Contract Information</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-4 border-b border-gray-800">
              <span className="text-gray-400">Contract Address</span>
              <span className="text-blue-400 font-mono text-sm">0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb</span>
            </div>
            <div className="flex justify-between items-center py-4 border-b border-gray-800">
              <span className="text-gray-400">Network</span>
              <span className="text-white">Base</span>
            </div>
          </div>
        </div>

        <div className="bg-yellow-900/20 backdrop-blur-lg p-8 rounded-2xl border border-yellow-500/30">
          <h2 className="text-xl font-bold mb-4 text-yellow-400">⚠️ Compliance Notice</h2>
          <p className="text-gray-300 leading-relaxed">
            This is a POC project. In production, AML/KYC checks will be performed via 
            Chainalysis or Open Banking APIs to ensure regulatory compliance and prevent 
            financial crimes.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CompliancePage
