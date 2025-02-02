import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Card from './Card'

function App() {

  const name1 = 'Akash';
  const name2 = 'Aman';
  const job1 = 'Engg';
  const job2 = 'Prof.';

  return (
    <>
      <h1 className='bg-green-400 text-black p-4 rounded-xl'>Hello World!</h1>
      <Card name={name1} job={job1}/>
      <Card name={name2} job={job2}/>
    </>
  )
}

export default App
