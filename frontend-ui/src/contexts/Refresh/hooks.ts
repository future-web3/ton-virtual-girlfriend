import { useContext } from 'react'

import { RefreshContext } from './context'

export const useRefresh = () => {
  const { fast, slow, countdown } = useContext(RefreshContext)
  return { fastRefresh: fast, slowRefresh: slow, countdownRefresh: countdown }
}
