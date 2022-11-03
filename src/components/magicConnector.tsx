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
      <button onClick={login} className="primary">
      Magic Connect
    </button>}
    {account &&
      (<div className="flex gap-1">
      <button onClick={showWallet} className="primary">
        {shortAddress}
      </button>
      <button onClick={disconnect} className="secondary">
        Disconnect
      </button>
    </div>)}
    </>
  )
}