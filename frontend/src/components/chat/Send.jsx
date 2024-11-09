import style from './style.module.css'
import '../../App.css'

function Send({ws, value, setValue, form, setForm, messagesRef}) {
  function handleInput(event) {
    setValue(event.target.value);
  }

  async function handleForm(e) {
    e.preventDefault()

    // const response1 = await fetch('http://localhost:8000/user/history', {
    //   method: 'POST',
    //   headers: {
    //     'Access-Control-Allow-Origin': '*',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({'username': 'Anton'})
    // })
    // const res1 = await response1.json()
    // console.log(res1);

    setForm([...form, {
      msg: value,
      who: 'me'
    }, {
      msg: '',
      who: ''
    }])

    ws.send(JSON.stringify({
      msg: value,
      chat_id: 'dfhjdfhk12',
      access_token: '6a6edcae-582e-4f5f-a3bc-fec96a6e30f7'
    }))

    const typing = document.querySelector('.typing')
    typing.classList.add('typing-active')

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
