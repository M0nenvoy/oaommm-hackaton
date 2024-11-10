import style from './style.module.css'

function Item({item, type}) {
  console.log(item, 'uitem');

  async function handleItem() {
    console.log(item);
    const response = await fetch(`http://localhost:8000/file/download?id=${item.id}`, {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    })

    // Преобразуем ответ в Blob
    const blob = await response.blob();

    console.log(blob);
    const url = URL.createObjectURL(blob);

    // Создаем и кликаем на ссылку для загрузки файла
    const link = document.createElement('a');
    link.href = url;
    link.download = item.name; // Укажите желаемое имя файла
    link.click();
    
    // Освобождаем память, удаляя временный URL
    URL.revokeObjectURL(url);
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
