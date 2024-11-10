import { useEffect, useState } from 'react'
import Btn from './Btn'
import List from './List'
import style from './style.module.css'

function Manual({type, typeSelect}) {
  const [dataAll, setDataAll] = useState([])
  const [dataLocal, setDataLocal] = useState([])

  useEffect(() => {
    function getFiles() {
      const token = localStorage.getItem('token')

      fetch('http://localhost:8000/file', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      })
      .then(response => response.json())
      .then(response => {
        console.log(response)
        setDataAll(response.map(x => {
          x.type = 'all'
          return x
        }))
      })
    }

    function getFilesLocal() {
      const token = localStorage.getItem('token')

      fetch('http://localhost:8000/user/file', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      })
      .then(response => response.json())
      .then(response => {
        console.log(response)
        setDataLocal(response.map(x => {
          x.type = 'local'
          return x
        }))
      })
    }

    if (type == "all") {
      getFiles()
    } else {
      getFilesLocal()
    }
  }, [])

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
