import { useContext } from 'react'
import { RefreshContext } from './refreshContext'


const useRefresh = () => {
  const { fast, slow } = useContext(RefreshContext)
  return { fastRefresh: fast, slowRefresh: slow }
}

export default useRefresh
