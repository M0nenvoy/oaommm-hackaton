import { useEffect, useState } from 'react'
import Btn from './Btn'
import List from './List'
import style from './style.module.css'

function Manual({type, typeSelect}) {
  const [dataAll, setDataAll] = useState([])
  const [dataLocal, setDataLocal] = useState([])

  useEffect(() => {
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
  }, [dataAll, dataLocal])

  const [open, setOpen] = useState(false)

  function handleClick() {
    console.log('click click click');
    setOpen(true)
  }

  return (
    <>
      <List dataLocal={dataLocal} dataAll={dataAll} type={type} />
      <Btn
        open={open}
        setOpen={setOpen}
        handleClick={handleClick} 
        nameSelect={typeSelect}
        dataAll={dataAll}
        setDataAll={setDataAll}
        dataLocal={dataLocal}
        setDataLocal={setDataLocal}
      />
    </>
  )
}

export default Manual
