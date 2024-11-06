import './style.module.css'
import Messages from './Messages'
import Send from './Send'
import { useEffect, useRef, useState } from 'react'
import style from './style.module.css'

const ws = new WebSocket("ws://localhost:8000/ws");

function Chat() {
  const [value, setValue] = useState('')
  const [form, setForm] = useState([])
  const messagesRef = useRef(null)


  ws.onopen = () => {
    console.log('ffkfjk');
  }

  ws.onmessage = function(event) {
    setForm([...form, {
      msg: event.data,
      who: ''
    }])

    console.log(event.data);
  };

  // useEffect(() => {
  //   setTimeout(() => {
  //     console.log(form);
      
  //     setForm([...form, {
  //       message: 'ответ'
  //     }])
  //   }, 3000)
  // }, [form])

  return (
    <div className={style.containerChat}>
      <Messages form={form} setForm={setForm} messagesRef={messagesRef} />
      <Send ws={ws} value={value} setValue={setValue} form={form} setForm={setForm} messagesRef={messagesRef} />
    </div>
  )
}

export default Chat
