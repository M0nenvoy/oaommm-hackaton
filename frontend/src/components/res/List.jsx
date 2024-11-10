import { useState } from 'react';
import Item from './Item'
import style from './style.module.css'

function List({dataLocal, dataAll, type}) {
  console.log(dataLocal, dataAll);
  // const [tyu, setTyu] = useState([])

  console.log(dataLocal);
  
  const tyu = [...dataLocal, ...dataAll]
  // setTyu(...dataLocal, ...dataAll)
  console.log(tyu);
  
  return (
    <div className={style.list}>
      {tyu.map((item, index) => (
        <Item item={item} type={type} key={index} />
      ))}
    </div>
  )
}

export default List
