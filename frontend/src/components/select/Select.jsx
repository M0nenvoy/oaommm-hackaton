import { useEffect, useRef, useState } from "react"
import style from './style.module.css'
import Option from "./Option";

function Select({name, options, setTypeSelect}) {
  const [openSelect, setOpenSelect] = useState(false)
  const dropdownRef = useRef(null); // ref для элемента
  const [optionsState, setOptionsState] = useState(options)
  const [optionName, setOptionName] = useState(name)

  function handleSelect() {
    if(!openSelect) {
      setOpenSelect(true)
    } else {
      setOpenSelect(false)
    }
  }

  // Функция для обработки клика вне элемента
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpenSelect(false); // Закрываем элемент
    }
  };

  useEffect(() => {
    // Добавляем обработчик клика к документу
    document.addEventListener('mousedown', handleClickOutside);
    
    // Удаляем обработчик при размонтировании компонента
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div ref={dropdownRef} className={style.place} onClick={handleSelect}>
        <p className={style.name}>{optionName}</p>
        <p className={style.icon}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-360 280-560h400L480-360Z"/></svg>
        </p>
        {
          openSelect ?
          <div className={style.container}>
            {optionsState.map((item, index) => (
              <Option setTypeSelect={setTypeSelect} optionText={item} optionName={optionName} setOptionName={setOptionName} key={index} />
            ))}
          </div>
          :
          <></>
        }
      </div>
    </>
  )
}

export default Select
