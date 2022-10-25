interface MagicConnectorProps {
  account: string | null | undefined
  shortAddress: string
  login: () => void
  showWallet: () => void
  disconnect: () => void
}

export const MagicConnector: React.FC<MagicConnectorProps> = ({
  account, shortAddress, login, showWallet, disconnect
}) => {
  return (
    <>
    {!account &&
      <button onClick={login} className="hover:bg-gray-500 border rounded-md border-gray-200 px-2 py-1.5 text-gray-300 font-bold">
      Magic Connect
    </button>}
    {account &&
      (<div className="flex gap-1">
      <button onClick={showWallet} className="hover:bg-gray-500 border rounded-md border-gray-200 px-2 py-1.5 text-gray-300 font-bold">
        {shortAddress}
      </button>
      <button onClick={disconnect} className="hover:bg-gray-500 border rounded-md border-gray-200 px-2 text-gray-300 font-bold">
        Disconnect
      </button>
    </div>)}
    </>
  )
}