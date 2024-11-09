import { useRef, useState } from 'react'
import Select from '../select/Select'
import Btn from '../res/Btn'
import style from './style.module.css'
import UploadsFile from './UploadsFile';

function Modal({open, setOpen}) {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);  // Хранит выбранный файл
  const [fileName, setFileName] = useState("Добавить файл");
  const [files, setFiles] = useState([]); // Начальное значение текста кнопки

  function handleClose() {
    setOpen(false)
  }

  function handleClick() {
    console.log('clic click');
    setOpen(false)
  }

  function handleModal(e) {
    e.stopPropagation()
  }

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);  // Отображаем имя выбранного файла
    }

    const selectedFiles1 = Array.from(event.target.files); // Преобразуем FileList в массив
    setFiles(selectedFiles1);
  };

  return (
    <div className={style.modalWrapper} onClick={handleClose}>
      <div className={style.modal} onClick={handleModal}>
        <div className={style.header}>
          <div className={style.name}>Загрузка файлов</div>
          <div className={style.close} onClick={handleClose}>close</div>
        </div>
        <div className={style.body}>
          <Select name='тип' options={['тип 1', 'тип 1', 'тип 1']} />

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            multiple
          />
          <div className={style.uploadContainer}>
            <div className={style.uploadButton} onClick={handleIconClick}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" fill="#a9f0ff" />
                <path d="M12 7v10M7 12h10" stroke="black" strokeWidth="2" />
              </svg>
              <span>{fileName}</span>
            </div>
            <UploadsFile />
          </div>

          <Btn handleClick={handleClick} />
        </div>
      </div>
    </div>
  )
}

export default Modal
