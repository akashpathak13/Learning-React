function Btn({color,text,textcolor ,onClick}){
    return ( 
           <button onClick={ ()=> onClick(color)} className='outline-none px-4 py-1 rounded-full shadow-lg' style={{backgroundColor:color, color:textcolor,}}>{text}</button>
    )
}

export default Btn