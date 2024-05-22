import React, { ReactNode } from 'react'
import { TransitionStatus, TransitionType, useInoutro } from '../hooks/useInoutro'

export interface InoutroRenderProps {
  status: TransitionStatus
  duration: number
  type: TransitionType
  visible: boolean
}

export interface InoutroProps {
  render: (props: InoutroRenderProps) => ReactNode
  open: boolean

  duration?: number
  initial?: TransitionStatus
  onEnter?: () => void
  onExit?: () => void

  ignoreIntro?: boolean
  ignoreOutro?: boolean

  safeMode?: boolean
}

const Inoutro = ({
  open,
  initial,
  render,
  onExit,
  duration: propDuration = 250,
  onEnter,
  ignoreIntro,
  ignoreOutro,
  safeMode = false,
}: InoutroProps) => {
  const { visible, duration, status, type } = useInoutro({
    initial,
    open,
    duration: propDuration,
    onExit,
    onEnter,
    ignoreIntro,
    ignoreOutro,
  })

  if (status === 'after-close' && !safeMode) {
    return null
  }

  return <>{render({ status, duration, type, visible })}</>
}

export default Inoutro
