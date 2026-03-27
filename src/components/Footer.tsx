const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-400 text-sm">
            <p>Contract: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb (placeholder)</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-blue-500 font-semibold">Built on Base Chain</span>
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
          <div className="text-gray-400 text-sm">
            <p>&copy; 2026 FPC Platform. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
