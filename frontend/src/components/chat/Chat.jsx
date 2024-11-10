import './style.module.css'
import Messages from './Messages'
import Send from './Send'
import { useEffect, useRef, useState } from 'react'
import style from './style.module.css'
import '../../App.css'

const ws = new WebSocket("ws://localhost:8000/ws");

function Chat({form, setForm, setMessagesList}) {
  const [value, setValue] = useState('')
  const messagesRef = useRef(null)
  const [chunk, setChunk] = useState('')
  const [login, setLogin] = useState('')

  useEffect(() => {
    ws.onopen = () => {
      console.log('websocket open');
    }

    setLogin(localStorage.getItem('username'))

    const cloneItems = [...form]
    let lastIndex = cloneItems[form.length - 1]

    ws.onmessage = function(event) {
      const message = event.data
      const newChunk = JSON.parse(message).msg.msg

      lastIndex.msg += newChunk

      lastIndex.msg += newChunk
      console.log(lastIndex.msg);
      setForm((prevData) => {
        const updatedData = [...prevData];

        updatedData[updatedData.length - 1].msg = lastIndex.msg;

        return updatedData;
      })

      // const typing = document.querySelector('.typing')
      // typing.classList.remove('typing-active')
    };

    // ws.onclose = function() {
    //   localStorage.removeItem('idChat')
      // localStorage.removeItem('token')
      // localStorage.removeItem('username')
    // }
  }, [form])

  function handleExit() {
    console.log('exit');
    localStorage.removeItem('token')
    localStorage.removeItem('username')

    setLogin('')

    window.location.href = '/register'
  }

  return (
    <div className={style.containerChat}>
      <div className={style.header}>
        <div className={style.slu}>Аккаунт: <strong>{login}</strong></div>
        <div className={style.exit} onClick={handleExit}>Выход</div>
      </div>
      <Messages form={form} setForm={setForm} messagesRef={messagesRef} />
      <Send setMessagesList={setMessagesList} ws={ws} value={value} setValue={setValue} form={form} setForm={setForm} messagesRef={messagesRef} />
    </div>
  )
}

export default Chat
