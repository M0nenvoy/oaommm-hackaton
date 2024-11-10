import { useEffect, useState } from "react"
import Item from "./Item"
import style from './style.module.css'

function Wrapper({setForm, messagesList, setMessagesList}) {
  useEffect(() => {
    async function rr() {
      const token = localStorage.getItem('token')

      const responseChatId = await fetch('http://localhost:8000/user/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      // const resultChatId = await responseChatId.json()
      responseChatId.json().then((result) => {
        result = result.filter((msg => msg.date !== undefined))
        console.log(result);
        setMessagesList(result.reverse())
      })
  
      console.log(messagesList);
      // setMessagesList(resultChatId)
    }
    rr()
  }, [])

  function handlenewChat() {
    localStorage.removeItem('idChat')

    localStorage.setItem('idChat', new Date().getTime())

    setForm([])
  }

  return (
    <div>
      <div className={style.btn} onClick={handlenewChat}>Новый чат</div>
      {
        messagesList.map((item, index) => {
          if(index !== 0) {
            return <Item message={item} index={index} timeNext={item.date} key={index} />
          } else {
            return <Item message={item} index={index} timeNext={item.date} key={index} />
          }
        })
      }
    </div>
  )
}

export default Wrapper
