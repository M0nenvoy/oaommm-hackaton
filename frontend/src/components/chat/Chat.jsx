import './style.module.css'
import Messages from './Messages'
import Send from './Send'
import { useEffect, useRef, useState } from 'react'
import style from './style.module.css'
import '../../App.css'

const ws = new WebSocket("ws://localhost:8000/ws");

function Chat() {
  const [value, setValue] = useState('')
  const [form, setForm] = useState([])
  const messagesRef = useRef(null)
  const [chunk, setChunk] = useState('')

  useEffect(() => {
    ws.onopen = () => {
      console.log('websocket open');
    }

    const cloneItems = [...form]
    let lastIndex = cloneItems[form.length - 1]

    ws.onmessage = function(event) {
      const message = event.data
      const newChunk = JSON.parse(message).msg

      lastIndex.msg += newChunk

      setInterval(() => {
        lastIndex.msg += newChunk
        console.log(lastIndex.msg);
        setForm((prevData) => {
          const updatedData = [...prevData];

          updatedData[updatedData.length - 1].msg = lastIndex.msg;

          return updatedData;
        })
      }, 1000)

      // const typing = document.querySelector('.typing')
      // typing.classList.remove('typing-active')
    };
  }, [form])

  function handleExit() {
    console.log('exit');
    localStorage.removeItem('token')

    window.location.href = '/register'
  }

  return (
    <div className={style.containerChat}>
      <div className={style.header}>
        <div className={style.slu}>еще какая-то инфа</div>
        <div className={style.exit} onClick={handleExit}>Выход</div>
      </div>
      <Messages form={form} setForm={setForm} messagesRef={messagesRef} />
      <Send ws={ws} value={value} setValue={setValue} form={form} setForm={setForm} messagesRef={messagesRef} />
    </div>
  )
}

export default Chat
