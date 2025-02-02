import { useState,useCallback,useEffect,useRef } from 'react'


function App() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(8);
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [charAllowed, setCharAllowed] = useState(false);
  const [copyText , setCopyText] = useState('Copy');

  const passwordRef = useRef(null);

  const passwordGenerator = () =>{
    let pass="";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    if(numberAllowed) str += '0123456789';
    if(charAllowed) str += '@#$%^&*<>?!~';

    for(let i=0; i<=length; i++){
      let char = Math.floor(Math.random()*str.length+1);
      pass += str.charAt(char);
    }
    setPassword(pass);
    setCopyText('Copy');
    
  }
  
  useEffect(()=>{
    passwordGenerator();
  },[charAllowed,numberAllowed,length,passwordGenerator])
  
  const copyPassword = useCallback(() => {
    window.navigator.clipboard.writeText(password)
    setCopyText('Copied');
  }, [password])

  return (
    <>
      
      <div className='relative top-20 w-full max-w-lg mx-auto shadow-md bg-gray-800 px-4 py-3 rounded-lg text-orange-500'>
          <h1 className='text-white text-center my-4'>Password Generator</h1>
          <div className='flex  shadow rounded-lg overflow-hidden mb-4'>
            <input
             type="text"
             value={password}
             className='outline-none w-full py-1 px-3'
             ref={passwordRef}
             readOnly
             placeholder='Password'
             />
             <button
             onClick={copyPassword}
             className='outline-none bg-blue-700 text-white px-3 py-0.5 shrink-0 hover:opacity-70 transition-opacity'
             >{copyText}</button>
          </div>
          <div>
            <div className='flex justify-evenly text-sm gap-x-4'>
              <div className='flex items-center gap-x-1'>
                <input
                value={length}
                onChange={(e)=>setLength(e.target.value)}
                className='cursor-pointer'
                min={8}
                max={100}
                type="range"
                 />
                 <label >Length : {length}</label>
              </div>
              <div className='flex items-center gap-x-1'>
                <input 
                  type="checkbox"
                  className='cursor-pointer'
                  defaultChecked={numberAllowed}
                  id='numberAllowed'
                  onChange={()=>{
                    setNumberAllowed(prev => !prev);
                  }}
                />
                <label htmlFor="numberAllowed">Numbers</label>
              </div>
              <div className='flex items-center gap-x-1'>
                <input 
                  type="checkbox"
                  className='cursor-pointer'
                  defaultChecked={charAllowed}
                  id='charAllowed'
                  onChange={()=>{
                    setCharAllowed(prev => !prev);
                  }}
                />
                <label htmlFor="charAllowed">Character</label>
              </div>
            </div>
          </div>
      </div>
    </>
  )
}

export default App
