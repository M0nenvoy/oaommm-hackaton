import { useState } from 'react';
import style from './style.module.css'

export default function Message({message}) {
  const [text, setText] = useState(message.msg);

  function handleCopy() {
    navigator.clipboard.writeText(text)
    .then(() => {
      const copied = document.querySelector('.copied')
      copied.classList.add('copied-true')
      setTimeout(() => {
        copied.classList.remove('copied-true')
      }, 700)
    })
    .catch((error) => {
      alert("Ошибка при копировании текста: " + error);
    });
  }

  return (
    <div className={message.who === 'me' ? style.message : style.messageAI}>
      {message.who === 'me' ?
        <></>
      :
        <div className={style.icon}>icon</div>
      }
      <div className={style.msg}>{message.msg}</div>
      <div className={message.who === 'me' ? style.copy : style.copyAI} onClick={handleCopy}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg>
      </div>
      {message.who === 'me' ? 
        <div className={style.icon}>icon</div>
      :
        <></>
      }
    </div>
  )
}
