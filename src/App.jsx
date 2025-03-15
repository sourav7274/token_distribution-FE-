import { useEffect, useState } from 'react'


async function getToken(data)
{
    const response = await fetch('https://token-distribution-be.vercel.app/claimToken',{
      method:"POST",
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify(data),
      credentials:'include'
    })

    if(!response.ok)
    {
      console.log("Error OCcured")
    }
    const result = await response.json()
    // console.log(result)    
    return result
}

function App() {
  const [tokenValue, setTokenValue] = useState("")
  const [timeleft,setTimeleft] = useState(0)

  useEffect(() =>{

    const storedToken = sessionStorage.getItem('lastToken')
    if(storedToken)
    {
      setTokenValue(storedToken)
    }

    if(timeleft > 0)
    {
      const timer = setInterval(() =>{
        setTimeleft((pval) => (pval > 0 ? pval - 1 : 0))
      },1000)
    

    return () => clearInterval(timer)
    
  }
   },[timeleft])


  const handleClick = async () =>{
    const value = await getToken({user:"test"})

    if(value)
    {
      if(value.error == "Too soon")
      {
        setTimeleft(Math.ceil(value.timeLeft/1000)) 
      }
      if(value.message == "Token CLaim Success")
      {
        setTimeleft(0)
        setTokenValue(value.token)
        sessionStorage.setItem('lastToken', value.token)
      }
     }
}
  return (
    <>
        <div className='h-screen bg-gray-500 text-white p-12'>
          <div className='text-center pt-10'>
          <button onClick={handleClick} disabled={timeleft > 0} className={`rounded-full p-3 ${timeleft > 0 ? 'bg-gray-400' : 'bg-red-600'}`}>
            Claim Token
          </button>
          </div>       
         {tokenValue && <><p className='text-xl mt-4'>{timeleft > 0?"Last Claimed Token: ": "Here is your token:"} {tokenValue}</p></>}
         {timeleft > 0 && <><p className='text-xl mt-4'>Please Try again after: {timeleft} s</p></>}
        </div>
    </>
  )
}

export default App
