import style from './style.module.css'

function Option({optionText, setOptionName}) {
  console.log(optionText);

  function handleOption() {
    setOptionName(optionText)
  }
  
  return (
    <div className={style.option} onClick={() => handleOption()}>{optionText}</div>
  )
}

export default Option
