import { useState } from "react"
import Chat from "../chat/Chat"
import Wrapper from "../history/Wrapper"
import Place from "../place/Place"
import Manual from "../res/Manual"
import Select from "../select/Select"

function Main() {
  const [value, setValue] = useState('')
  const [errorInput, setErrorInput] = useState(false)
  const options = ['option 1', 'option 2', 'option 3']
  const [typeSelect, setTypeSelect] = useState('all')

  if(!localStorage.getItem('token') || undefined === localStorage.getItem('token')) {
    window.location.href = '/register'
  }

  return (
    <>
      <Place flag={true}>
        <Wrapper />
      </Place>
      <Chat />
      <Place flag={false}>
        <Select name='all' options={['all', 'local']} setTypeSelect={setTypeSelect} />
        <Manual type={typeSelect} />
      </Place>
      <div className='copied'>Данные скопировались!</div>
    </>
  )
}

export default Main
