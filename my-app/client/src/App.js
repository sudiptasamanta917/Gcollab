import React from 'react'
import CodeEditor from './components/CodeEditor'
import { SignUp } from './components/SignUp'
import './App.css'

const App = () => {
  return (
    <div className='app'>
      <h1>CodeEditor</h1>
      <SignUp />
      {/* <CodeEditor /> */}
    </div>
  )
}

export default App