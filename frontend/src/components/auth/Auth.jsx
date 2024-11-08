import { useState } from 'react'
import Input from '../input/Input'

function Auth() {
  const [value, setValue] = useState('')
  const [errorInput, setErrorInput] = useState('')
  const [valuePass, setValuePass] = useState('')
  const [errorInputPass, setErrorInputPass] = useState('')

  async function handleForm(e) {
    e.preventDefault()

    console.log(value, valuePass);

    const response = await fetch('http://localhost:8000/user/register', {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'username': value, 'password': valuePass})
    })
    const result = await response.json()
    console.log(result);
  }

  return (
    <form onSubmit={handleForm}>
      <Input name='Логин' value={value} setValue={setValue} errorInput={errorInput} />
      <br />
      <Input name='Пароль' value={valuePass} setValue={setValuePass} errorInput={errorInputPass} />
      <input type="submit" value='Отправить' />
    </form>
  )
}

export default Auth
