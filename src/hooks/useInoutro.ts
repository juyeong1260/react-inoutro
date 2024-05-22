import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useMatchMedia } from './useMatchMedia'

export type TransitionStatus = 'before-open' | 'open' | 'after-open' | 'before-close' | 'close' | 'after-close'
export type TransitionType = 'init' | 'open' | 'close'

const NO_PREFERS_REDUCE_MOTION = '(prefers-reduced-motion: no-preference)'

export interface UseInoutroOptions {
  open: boolean

  duration?: number
  initial?: TransitionStatus
  onExit?: () => void
  onEnter?: () => void

  ignoreOutro?: boolean
  ignoreIntro?: boolean
}

export const useInoutro = ({
  open,
  initial,
  duration: propDuration = 200,
  onEnter,
  onExit,
  ignoreOutro,
  ignoreIntro,
}: UseInoutroOptions) => {
  const initialStatus = useMemo(() => initial ?? (open ? 'after-open' : 'after-close'), [])
  const [status, setStatus] = useState<TransitionStatus>(initialStatus)
  const { matches } = useMatchMedia({
    query: NO_PREFERS_REDUCE_MOTION,
    defaultMatches: true,
  })
  const duration = matches ? propDuration : 0

  useEffect(() => {
    if (open) {
      if (status.includes('close')) {
        setStatus('before-open')
      }
    } else {
      if (status.includes('open')) {
        setStatus('before-close')
      }
    }
  }, [open])

  const timer = useRef<number | undefined>()
  const animationFrame = useRef<number | null>(null)

  const handleUpdateStatusAfterDuration = useCallback(
    (nextStatus: TransitionStatus, onTimer?: () => void, ignore?: boolean) => {
      if (ignore) {
        animationFrame.current = setTimeout(() => {
          setStatus(nextStatus)
          onTimer?.()
        }, 0)
      } else {
        timer.current = setTimeout(
          () => {
            setStatus(nextStatus)
            onTimer?.()
          },
          Math.max(duration, 16)
        )
      }
    },

    []
  )

  useEffect(() => {
    switch (status) {
      case 'before-open':
        animationFrame.current = setTimeout(() => setStatus('open'), 16)
        break
      case 'before-close':
        animationFrame.current = setTimeout(() => setStatus('close'), 0)
        break
      case 'open':
        handleUpdateStatusAfterDuration('after-open', onEnter, ignoreIntro)
        break
      case 'close':
        handleUpdateStatusAfterDuration('after-close', onExit, ignoreOutro)
        break
    }
    return () => {
      if (timer.current !== undefined) {
        clearTimeout(timer.current)
        timer.current = undefined
      }
      if (animationFrame.current !== null) {
        clearTimeout(animationFrame.current)
        animationFrame.current = null
      }
    }
  }, [status])

  const type = useMemo<TransitionType>(() => {
    switch (status) {
      case 'before-open':
        return 'init'
      case 'open':
      case 'after-open':
        return 'open'
      default:
        return 'close'
    }
  }, [status])

  const visible = type === 'open'
  return {
    status,
    duration: visible ? (ignoreIntro ? 0 : duration) : ignoreOutro ? 0 : duration,
    type,
    visible,
  }
}

export type UseInoutroResult = ReturnType<typeof useInoutro>
