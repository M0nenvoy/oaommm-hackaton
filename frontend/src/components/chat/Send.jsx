import style from './style.module.css'

function Send({ws, value, setValue, form, setForm, messagesRef}) {
  function handleInput(event) {
    setValue(event.target.value);
  }

  function handleForm(e) {
    e.preventDefault()

    setForm([...form, {
      msg: value,
      who: 'me'
    }])

    ws.send({msg: value, username: 'Anton'})

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
