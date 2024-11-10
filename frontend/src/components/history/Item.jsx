import { useEffect, useMemo, useState } from "react";
import style from './style.module.css'
import Time from "./Time";

function Item({message, timeNext, index}) {
  const [flagDate, setFlagDate] = useState(true)

  useEffect(() => {
    const date = message.date.trim()

    if(timeNext.trim() === date.trim()) {
      setFlagDate(false)
      console.log('timeNext', timeNext, 'date', date);
    } else {
      setFlagDate(true)
      console.log('timeNext', timeNext, 'date', date);
    }
  }, [timeNext])

  async function handleItemHistory() {
    console.log(message.id);
    const token = localStorage.getItem('token')

    const response = await fetch(`http://localhost:8000/user/history`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id: message.id})
    })
    const result = await response.json()
    console.log(result);
    
  }
  
  return (
    <div>
      {/* {message[1].map((item, index) => {
        return (<div key={index}>{item.msg}</div>)
      })} */}
      {
        flagDate || !index ?
          <Time date={message.date.trim()}/>
          :
          <></>
      }
      <div className={style.itemHistoryList} onClick={handleItemHistory}>
        {message.text}
      </div>
    </div>
  )
}

export default Item
