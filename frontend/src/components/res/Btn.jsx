import { useState } from 'react';
import Modal from '../modal/Modal';
import style from './style.module.css'

function Btn({open, setOpen, handleClick, nameSelect, dataAll, setDataAll, dataLocal, setDataLocal}) {
  function rere() {
    handleClick()
    
    async function getFiles() {
      const token = localStorage.getItem('token')

      const responseAll = await fetch('http://localhost:8000/file', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      })
      const resultAll = await responseAll.json()

      console.log('resultAll', resultAll);
      for(let i = 0; i < resultAll.length; i++) {
        resultAll[i].type = 'all'
      }
      setDataAll(resultAll)
      // setData(dataLocal, resultAll)
    }

    async function getFilesLocal() {
      const token = localStorage.getItem('token')

      const responseAll = await fetch('http://localhost:8000/user/file', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      })
      const resultAll = await responseAll.json()

      console.log('resultLocal', resultAll);
      for(let i = 0; i < resultAll.length; i++) {
        resultAll[i].type = 'local'
      }
      setDataLocal(resultAll)
      // setData(resultAll, ty)
    }

    getFiles()
    getFilesLocal()
  }

  return (
    <>
      <div className={style.btn} onClick={rere}>
        Загрузить
      </div>
      {
        open ?
          <Modal 
            open={open} 
            setOpen={setOpen} 
            nameSelect={nameSelect}
            dataAll={dataAll}
            setDataAll={setDataAll}
            dataLocal={dataLocal}
            setDataLocal={setDataLocal}
          />
          :
          <></>
      }
    </>
  )
}

export default Btn
