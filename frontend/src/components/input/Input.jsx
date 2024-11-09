import style from './style.module.css'

function Input({name, value, setValue, errorInput}) {
  function handleInput(event) {
    setValue(event.target.value.trim());
  }
  
  return (
    <label className={style.container}>
      <p className={style.name}>{name}</p>
      <input
        className={style.input}
        type="text"
        placeholder='Ввведите значение'
        onChange={handleInput}
        value={value}
      />
      {errorInput ?
        <p className={style.error}>Значение введено неверно!</p>
        :
        <></>
      }
    </label>
  )
}

export default Input
