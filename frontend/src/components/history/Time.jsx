import style from './style.module.css'

function Time({date}) {
  return (
    <div className={style.date}>
      <div className={style.line}></div>
      <div className={style.textDate}>{date}</div>
      <div className={style.line}></div>
    </div>
  )
}

export default Time
