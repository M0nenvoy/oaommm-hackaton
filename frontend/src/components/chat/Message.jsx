import style from './style.module.css'

export default function Message({message}) {
  return (
    <div className={message.who === 'me' ? style.message : style.messageAI}>
      {message.msg}
    </div>
  )
}
