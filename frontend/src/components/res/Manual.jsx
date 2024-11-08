import { useState } from 'react'
import Btn from './Btn'
import List from './List'
import style from './style.module.css'

function Manual() {
  const data = [
    {
      id: 1,
      name: 'файл'
    },
    {
      id: 2,
      name: 'файл 1'
    },
    {
      id: 3,
      name: 'файл 2'
    },
    {
      id: 1,
      name: 'файл'
    },
    {
      id: 2,
      name: 'файл 1'
    },
    {
      id: 3,
      name: 'файл 2'
    },
    {
      id: 1,
      name: 'файл'
    },
    {
      id: 2,
      name: 'файл 1'
    },
    {
      id: 3,
      name: 'файл 2'
    },
    {
      id: 1,
      name: 'файл'
    },
    {
      id: 2,
      name: 'файл 1'
    },
    {
      id: 3,
      name: 'файл 2'
    },
  ]
  const [open, setOpen] = useState(false)

  function handleClick() {
    console.log('click click click');
    setOpen(true)
  }

  return (
    <>
      <List data={data} />
      <Btn open={open} setOpen={setOpen} handleClick={handleClick} />
    </>
  )
}

export default Manual
