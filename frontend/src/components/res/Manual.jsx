import { useEffect, useState } from 'react'
import Btn from './Btn'
import List from './List'
import style from './style.module.css'

function Manual({type, typeSelect}) {
  const data1 = [
    {
      id: 1,
      name: 'файл',
      type: 'all'
    },
    {
      id: 2,
      name: 'файл 1',
      type: 'local'
    },
    {
      id: 3,
      name: 'файл 2',
      type: 'all'
    },
    {
      id: 1,
      name: 'файл',
      type: 'all'
    },
    {
      id: 2,
      name: 'файл 1',
      type: 'all'
    },
    {
      id: 3,
      name: 'файл 2',
      type: 'all'
    },
    {
      id: 1,
      name: 'файл',
      type: 'all'
    },
    {
      id: 2,
      name: 'файл 1',
      type: 'local'
    },
    {
      id: 3,
      name: 'файл 2',
      type: 'all'
    },
    {
      id: 1,
      name: 'файл',
      type: 'local'
    },
    {
      id: 2,
      name: 'файл 1',
      type: 'all'
    },
    {
      id: 3,
      name: 'файл 2',
      type: 'all'
    },
  ]
  const [data, setData] = useState([])

  useEffect(() => {
    async function getFiles() {
      const responseAll = await fetch('http://localhost:8000/file')
      const resultAll = await responseAll.json()

      console.log('resultAll', resultAll);
    }

    getFiles()
  }, [])

  const [open, setOpen] = useState(false)

  function handleClick() {
    console.log('click click click');
    setOpen(true)
  }

  return (
    <>
      <List data={data} type={type} />
      <Btn open={open} setOpen={setOpen} handleClick={handleClick} nameSelect={typeSelect} />
    </>
  )
}

export default Manual
