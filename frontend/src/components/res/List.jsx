import Item from './Item'
import style from './style.module.css'

function List({data, type}) {
  console.log(data);
  
  return (
    <div className={style.list}>
      {data.map((item, index) => (
        <Item item={item} type={type} key={index} />
      ))}
    </div>
  )
}

export default List
