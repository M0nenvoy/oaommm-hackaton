import { useState } from 'react'
import Input from '../input/Input'
import style from './style.module.css'
import '../../App.css'

function Auth() {
  const [value, setValue] = useState('')
  const [errorInput, setErrorInput] = useState('')
  const [valuePass, setValuePass] = useState('')
  const [errorInputPass, setErrorInputPass] = useState('')

  localStorage.removeItem('token')
  // обработать момент с регистрацией повторного пользователя

  async function handleForm(e) {
    e.preventDefault()

    console.log(value, valuePass);

    const formData = new FormData()

    formData.append('username', value)
    formData.append('password', valuePass)

    const response = await fetch('http://localhost:8000/register', {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: formData
    })
    const result = await response.json()
    console.log(result);

    window.location.href = '/'

    localStorage.setItem('token', result.access_token)
  }

  async function handleAuth(e) {
    e.preventDefault()

    console.log(value, valuePass);

    const formData = new FormData()

    formData.append('username', value)
    formData.append('password', valuePass)

    const response = await fetch('http://localhost:8000/token', {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: formData
    })
    const result = await response.json()
    console.log(result);

    window.location.href = '/'

    localStorage.setItem('token', result.access_token)
  }

  return (
    <div className={style.placeAuth}>
      <form onSubmit={handleForm} className={style.startPage}>
        <Input name='Логин' value={value} setValue={setValue} errorInput={errorInput} />
        <br />
        <Input name='Пароль' value={valuePass} setValue={setValuePass} errorInput={errorInputPass} />
        <div>
          <input className={style.btn} type="submit" value='Зарегистрироваться' />
        </div>
        <div>
          <input onClick={handleAuth} className={style.btnAuth} type="submit" value='Войти' />
        </div>
      </form>
    </div>
  )
}

export default Auth
