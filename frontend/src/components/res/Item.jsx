import style from './style.module.css'

function Item({item, type}) {
  console.log(item, 'uitem');

  function handleItem() {
    console.log(item);
  }

  console.log('type', type, 'item.type', item.type);
  
  return ( 
      <>
        {
          type === item.type ?
            <div className={style.item} onClick={handleItem}>
              {item.name}
            </div>
            :
            <></>
        }
      </>
  )
}

export default Item
