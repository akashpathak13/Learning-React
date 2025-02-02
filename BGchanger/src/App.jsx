import { useState } from 'react'
import Btn from './Btn'

const color = {
  // Neutral tones
  white: '#ffffff', // Classic white
  black: '#000000', // Vibrant and accent colors
  red: '#ff6b6b', // Vibrant red
  orange: '#ffa500', // Bright orange
  yellow: '#ffd700', // Vibrant yellow
  green: '#32cd32', // Lime green
  blue: '#1e90ff', // Dodger blue
  purple: '#9370db', // Medium purple
  
  // Earth tones
  beige: '#f5f5dc', // Neutral beige
  olive: '#808000', // Earthy olive
  brown: '#a52a2a', // Rich brown
};

function App() {
const [colour, setColor] = useState(color.purple)
  return (
    <div className='w-full h-screen' style={{backgroundColor:colour}}>
      <div className='fixed flex flex-wrap justify-center bottom-12 inset-x-0 px-2'>
        <div className='flex flex-wrap justify-center bg-white rounded-3xl px-3 py-2  gap-3'>
          <Btn color={color.red} text='Red' textcolor={color.white} onClick={setColor} />
          <Btn color={color.orange} text='Orange' textcolor={color.white}  onClick={setColor}/>
          <Btn color={color.yellow} text='Yellow' textcolor={color.black}  onClick={setColor}/>
          <Btn color={color.green} text='Green' textcolor={color.white}  onClick={setColor}/>
          <Btn color={color.blue} text='Blue' textcolor={color.white}  onClick={setColor}/>
          <Btn color={color.purple} text='Purple' textcolor={color.white}  onClick={setColor}/>
          <Btn color={color.beige} text='Beige' textcolor={color.black}  onClick={setColor}/>
          <Btn color={color.olive} text='Olive' textcolor={color.white} onClick={setColor} />
          <Btn color={color.brown} text='Brown' textcolor={color.white}  onClick={setColor}/>
          <Btn color={color.white} text='White' textcolor={color.black}  onClick={setColor}/>
          <Btn color={color.black} text='Black' textcolor={color.white}  onClick={setColor}/>
        </div> 
      </div>
    </div>
  )
}

export default App
