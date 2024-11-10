import { useState } from 'react';
import Modal from '../modal/Modal';
import style from './style.module.css'

function Btn({open, setOpen, handleClick, nameSelect}) {
  return (
    <>
      <div className={style.btn} onClick={handleClick}>
        Загрузить
      </div>
      {
        open ?
          <Modal open={open} setOpen={setOpen} nameSelect={nameSelect} />
          :
          <></>
      }
    </>
  )
}

export default Btn
