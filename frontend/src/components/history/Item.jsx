import { useEffect, useMemo, useState } from "react";
import style from './style.module.css'
import Time from "./Time";

function Item({message, timeNext, index}) {
  const [flagDate, setFlagDate] = useState(true)

  useEffect(() => {
    const date = message[0].date.trim()

    if(timeNext.trim() === date.trim()) {
      setFlagDate(false)
      console.log('timeNext', timeNext, 'date', date);
    } else {
      setFlagDate(true)
      console.log('timeNext', timeNext, 'date', date);
    }
  }, [timeNext])

  function handleItemHistory() {
    console.log('click click click');
    console.log(message[0].id);

    
  }
  
  return (
    <div>
      {/* {message[1].map((item, index) => {
        return (<div key={index}>{item.msg}</div>)
      })} */}
      {
        flagDate || !index ?
          <Time date={message[0].date.trim()}/>
          :
          <></>
      }
      <div className={style.itemHistoryList} onClick={handleItemHistory}>
        {message[1][message.length].msg}
      </div>
    </div>
  )
}

export default Item
