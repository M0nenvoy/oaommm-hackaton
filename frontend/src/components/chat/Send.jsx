import style from './style.module.css'

function Send({ws, value, setValue, form, setForm, messagesRef}) {
  function handleInput(event) {
    setValue(event.target.value);
  }

  async function handleForm(e) {
    e.preventDefault()

    const response1 = await fetch('http://localhost:8000/user/history', {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'username': 'Anton'})
    })
    const res1 = await response1.json()
    console.log(res1);

    setForm([...form, {
      msg: value,
      who: 'me'
    }])

    console.log(ws);
    
    ws.send(JSON.stringify({msg: value, username: 'Anton'}))

    setValue('')
  }

  return (
    <form className={style.container} onSubmit={handleForm}>
      <input 
        type="text"
        placeholder='Введите сообщение'
        onChange={handleInput}
        value={value}
        className={style.input}
      />
      <input type="submit" className={style.btn} />
    </form>
  )
}

export default Send
