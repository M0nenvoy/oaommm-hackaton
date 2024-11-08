import style from './style.module.css'

function Item({item}) {
  console.log(item, 'uitem');

  function handleItem() {
    console.log(item);
  }
  
  return (
    <div className={style.item} onClick={handleItem}>
      {item.name}
    </div>
  )
}

export default Item
