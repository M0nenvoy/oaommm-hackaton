import { useState } from "react"
import Chat from "../chat/Chat"
import Wrapper from "../history/Wrapper"
import Place from "../place/Place"
import Manual from "../res/Manual"
import Select from "../select/Select"

function Main() {
  const [typeSelect, setTypeSelect] = useState('all')
  const [form, setForm] = useState([])
  const [messagesList, setMessagesList] = useState([])

  if(!localStorage.getItem('token') || undefined === localStorage.getItem('token')) {
    window.location.href = '/register'
  }

  return (
    <>
      <Place flag={true}>
        <Wrapper setForm={setForm} messagesList={messagesList} setMessagesList={setMessagesList} />
      </Place>
      <Chat form={form} setForm={setForm} setMessagesList={setMessagesList} />
      <Place flag={false}>
        <Select name={typeSelect} options={['all', 'local']} setTypeSelect={setTypeSelect} />
        <Manual 
          type={typeSelect} 
          typeSelect={typeSelect}
        />
      </Place>
      <div className='copied'>Данные скопировались!</div>
    </>
  )
}

export default Main
