import React, { createContext, useContext, useState } from 'react'

const IntroContext = createContext({
  introPhase: 'typing', // 'typing' | 'shifting' | 'done'
  setIntroPhase: () => {}
})

export const IntroProvider = ({ children }) => {
  const [introPhase, setIntroPhase] = useState('typing')
  return (
    <IntroContext.Provider value={{ introPhase, setIntroPhase }}>
      {children}
    </IntroContext.Provider>
  )
}

export const useIntro = () => useContext(IntroContext)
