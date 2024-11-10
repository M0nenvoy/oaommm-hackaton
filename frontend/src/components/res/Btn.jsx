import { useState } from 'react';
import Modal from '../modal/Modal';
import style from './style.module.css'

function Btn({open, setOpen, handleClick, nameSelect, dataAll, setDataAll, dataLocal, setDataLocal}) {
  function rere() {
    const loader = document.querySelector('.loader')
    loader.classList.remove('display-none')
    
    if(nameSelect === 'all') {
      setTimeout(() => {
        async function getFiles() {
          const token = localStorage.getItem('token')
    
          try {
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
            loader.classList.add('display-none')
          } catch(e) {
            console.log(e);
          }
        }
        getFiles()
      }, 0)
    } else {
      setTimeout(() => {
        async function getFilesLocal() {
          const token = localStorage.getItem('token')
    
          try {
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
            loader.classList.add('display-none')
          } catch(e) {
            console.log(e);
          }
          // setData(resultAll, ty)
        }
      getFilesLocal()
      }, 0)
    }
    
    handleClick()
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
