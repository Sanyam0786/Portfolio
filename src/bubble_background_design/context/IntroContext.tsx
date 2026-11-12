import React, { createContext, useContext, useState, ReactNode } from 'react'

export type IntroPhase = 'typing' | 'shifting' | 'done'

export interface IntroContextType {
  introPhase: IntroPhase
  setIntroPhase: (phase: IntroPhase) => void
}

const IntroContext = createContext<IntroContextType>({
  introPhase: 'typing',
  setIntroPhase: () => {}
})

export const IntroProvider = ({ children }: { children: ReactNode }) => {
  const [introPhase, setIntroPhase] = useState<IntroPhase>('typing')
  return (
    <IntroContext.Provider value={{ introPhase, setIntroPhase }}>
      {children}
    </IntroContext.Provider>
  )
}

export const useIntro = (): IntroContextType => useContext(IntroContext)
