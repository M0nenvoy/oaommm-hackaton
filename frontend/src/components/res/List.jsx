import Item from './Item'
import style from './style.module.css'

function List({data}) {
  console.log(data);
  
  return (
    <div className={style.list}>
      {data.map((item, index) => (
        <Item item={item} key={index} />
      ))}
    </div>
  )
}

export default List
