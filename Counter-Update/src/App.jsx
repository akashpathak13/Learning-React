import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
let [count, setCount] = useState(0);
  function increaseCount(){
    setCount(count+1);
  }
  function decreaseCount(){
    setCount(count-1);
  }

  return (
    <>
        <h1>Count : {count}</h1>
        <button
          onClick={increaseCount}
        >Increase : {count}</button>
        <button
          onClick={decreaseCount}
        >Decrease : {count}</button>
    </>
  )
}

export default App
