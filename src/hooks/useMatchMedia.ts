import { useEffect, useState } from 'react'

export interface MatchedState {
  matches: boolean
  state: 'initial' | 'matched' | 'unsupport' | 'failure'
}
export interface UseMatchMediaOptions {
  query: string
  defaultMatches?: boolean
}
export const useMatchMedia = ({ query, defaultMatches = false }: UseMatchMediaOptions) => {
  const [state, setState] = useState<MatchedState>({
    matches: defaultMatches,
    state: 'initial',
  })

  useEffect(() => {
    if (state.state !== 'initial') {
      setState({ matches: defaultMatches, state: 'initial' })
    }

    if ('matchMedia' in window) {
      try {
        const matches = window.matchMedia(query)
        setState({ matches: matches.matches, state: 'matched' })

        const onMatchChange = (ev: MediaQueryListEvent) => {
          setState({ matches: ev.matches, state: 'matched' })
        }

        if ('addEventListener' in matches) {
          matches.addEventListener('change', onMatchChange)
          return () => {
            matches.removeEventListener('change', onMatchChange)
          }
        } else if ('addListener' in matches) {
          ;(matches as any).addListener(onMatchChange)

          return () => {
            ;(matches as any).removeListener(onMatchChange)
          }
        }
      } catch (e) {
        setState((prev) => (prev.state === 'matched' ? prev : { ...prev, state: 'failure' }))
      }
    } else {
      setState((prev) => ({ ...prev, state: 'unsupport' }))
    }
  }, [query])

  return state
}
