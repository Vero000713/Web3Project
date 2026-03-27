import { useEffect, useRef, useState } from 'react'
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'
import { base } from 'wagmi/chains'

const shortenAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`

const WALLET_ICONS: Record<string, string> = {
  'MetaMask': '🦊',
  'OKX Wallet': '⭕',
  'Coinbase Wallet': '🔵',
  'Trust Wallet': '🛡️',
  'Rabby Wallet': '🐰',
  'Phantom': '👻',
}

const WalletConnect = () => {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { address, isConnected, chain } = useAccount()
  const { connectors, connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain, isPending: isSwitching } = useSwitchChain()

  const isOnBase = chain?.id === base.id

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const uniqueConnectors = connectors.filter(
    (c, i, arr) => arr.findIndex((x) => x.name === c.name) === i,
  )

  const handleConnect = (connector: (typeof connectors)[number]) => {
    setError('')
    connect(
      { connector },
      {
        onSuccess: () => setOpen(false),
        onError: (err) => setError(err.message || 'Connection failed'),
      },
    )
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900/60 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-xs text-gray-200 font-mono">
            {shortenAddress(address)}
          </span>
          <span className="text-xs text-gray-500">|</span>
          <span className={`text-xs font-medium ${isOnBase ? 'text-blue-400' : 'text-yellow-400'}`}>
            {chain?.name ?? 'Unknown'}
          </span>
        </div>

        {!isOnBase && (
          <button
            onClick={() => switchChain({ chainId: base.id })}
            disabled={isSwitching}
            className="rounded-lg bg-yellow-600 px-3 py-2 text-xs font-semibold text-white hover:bg-yellow-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSwitching ? 'Switching...' : 'Switch to Base'}
          </button>
        )}

        <button
          onClick={() => disconnect()}
          className="rounded-lg bg-gray-700 px-3 py-2 text-xs font-semibold text-white hover:bg-gray-600"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => { setOpen((prev) => !prev); setError('') }}
        disabled={isPending}
        className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? 'Connecting...' : 'Connect Wallet'}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-gray-700 bg-gray-900 p-3 shadow-2xl z-[100]">
          <p className="text-xs text-gray-500 mb-2 px-1">Select a wallet</p>

          {error && (
            <div className="mb-2 rounded-lg bg-red-900/30 border border-red-500/40 p-2 text-xs text-red-300">
              {error}
            </div>
          )}

          <div className="space-y-1">
            {uniqueConnectors.length === 0 && (
              <div className="text-center py-4">
                <p className="text-gray-400 text-sm mb-2">No wallet detected</p>
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline text-xs"
                >
                  Install MetaMask
                </a>
              </div>
            )}

            {uniqueConnectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => handleConnect(connector)}
                disabled={isPending}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-all hover:bg-gray-800 disabled:opacity-60"
              >
                <span className="text-xl">
                  {WALLET_ICONS[connector.name] ?? '💎'}
                </span>
                <span className="text-sm font-medium text-white">{connector.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default WalletConnect
