import { useState } from 'react'
import Input from './components/input/Input'
import Select from './components/select/Select'
import Chat from './components/chat/Chat'
import Place from './components/place/Place'
import './App.css'

function App() {
  const [value, setValue] = useState('')
  const [errorInput, setErrorInput] = useState(false)
  const options = ['option 1', 'option 2', 'option 3']

  // Обработчик отправки формы
  const handleSubmit = (event) => {
    event.preventDefault(); // Останавливаем перезагрузку страницы

    if(value === 'rrr') {
      setErrorInput(true)
    } else {
      setErrorInput(false)
    }

    console.log(value);
  };

  return (
    <div className='container'>
      {/* <form onSubmit={handleSubmit}>
        <Input name='Новый инпут' value={value} setValue={setValue} errorInput={errorInput} />
        <input type="submit" value='Отправить' />
      </form>
      <Select name='новый селект' options={options} />
      <Chat /> */}
      <Place flag={true}>
        История чата
      </Place>
      <Chat />
      <Place flag={false}>
        Настройка импортов и экспортов файлов
      </Place>
    </div>
  )
}

export default App
