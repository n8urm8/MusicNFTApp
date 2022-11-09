import Head from 'next/head'
import Link from 'next/link'
import { useContext } from 'react'
import styles from '../styles/layout.module.css'
import { WalletContext } from '../utils/walletContext'
import { MagicConnector } from './magicConnector'

interface FullPageProps {
  children: React.ReactNode
}

export const Layout: React.FC<FullPageProps> = ({ children }) => {
  const { account } = useContext(WalletContext)
  const { login } = useContext(WalletContext)
  const { disconnect } = useContext(WalletContext)
  const { showWallet } = useContext(WalletContext)
  const { requestEmail } = useContext(WalletContext)
 
  const shortAddress = `${account?.slice(0, 4)}...${account?.slice(-4)}`

  return (
    <div className={styles.wrapper}>
      <Head>
        <title>Chain Beatz</title>
        <meta name="description" content="The forever music app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className='flex justify-between px-2 py-1 border-b bg-white'>
        <Link href='/'>
          <a>
            <h1 className="text-3xl font-extrabold leading-normal text-gray-850 ">
              Chain <span className="primary">Beatz</span>
            </h1>
          </a>
        </Link>
        <div className='flex flex-row gap-1'>
          <MagicConnector
            shortAddress={shortAddress}
            account={account}
            login={login}
            disconnect={disconnect}
            showWallet={showWallet}
            showEmail={requestEmail}
          />
        </div>
      </header>
      <main className={styles.pageMain}>{children}</main>
      <footer></footer>
    </div>
  )
}