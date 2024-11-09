import { useEffect } from 'react';
import style from './style.module.css'
import Item from './Item';

function UploadsFile({data, setData}) {
  useEffect(() => {
    console.log(data);
  }, [data])
  
  return (
    <div className={style.uploadListContainer}>
      <div className={style.title}>ФАЙЛЫ</div>
      <ul className={style.uploadList}>
        {data.map((item, index) => (
          <Item name={item} data={data} setData={setData} index={index} key={index} />
        ))}
      </ul>
    </div>
  )
}

export default UploadsFile
