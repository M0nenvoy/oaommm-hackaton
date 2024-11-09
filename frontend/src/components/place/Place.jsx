import { useRef } from 'react'
import style from './style.module.css'

function Place({flag, children}) {
  const closeRef = useRef(null)

  function handleClose() {
    closeRef.current.style.transform = `translateX('-200px')`
    console.log(closeRef, closeRef.current);
  }

  return (
    <div
      ref={closeRef}
      className={style.containerPlace}
    >
      <div className={flag ? style.placeStart : style.placeEnd}>
        {children}
      </div>
    </div>
  )
}

export default Place
