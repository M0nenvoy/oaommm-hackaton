import style from './style.module.css'
import '../../App.css'

function Send({ws, value, setValue, form, setForm, messagesRef, setMessagesList}) {
  function handleInput(event) {
    setValue(event.target.value);
  }

  async function handleForm(e) {
    e.preventDefault()

    const token = localStorage.getItem('token')

    setForm([...form, {
      msg: value,
      who: 'me'
    }, {
      msg: '',
      who: ''
    }])

    let idChat = localStorage.getItem('idChat')
    if(!idChat) {
      idChat = new Date().getTime()
      localStorage.setItem('idChat', idChat)
      console.log(idChat, 'idChat');
    }

    console.log(idChat);
    
    ws.send(JSON.stringify({
      msg: value,
      chat_id: String(idChat),
      access_token: token
    }))

    const typing = document.querySelector('.typing')
    typing.classList.add('typing-active')

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
    }
    rr()

    setValue('')
  }

  return (
    <>
      <form className={style.container} onSubmit={handleForm}>
        <div className='typing'>
          <div className="lds-ellipsis lds-ellipsis-none"><div></div><div></div><div></div><div></div></div>
          <div className='typing-text'>Машинка ищет лучшие ответы...</div>
        </div>
        <input
          type="text"
          placeholder='Введите сообщение'
          onChange={handleInput}
          value={value}
          className={style.input}
        />
        <input type="submit" className={style.btn} value='' />
      </form>
    </>
  )
}

export default Send
