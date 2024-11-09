import style from './style.module.css'

function Option({optionText, setOptionName, optionName, setTypeSelect}) {
  console.log(optionText);

  function handleOption() {
    setOptionName(optionText)
    setTypeSelect(optionText)
  }
  
  return (
    <div className={optionName === optionText ?
      style.optionActive
      :
      style.option
    } onClick={() => handleOption()}>{optionText}</div>
  )
}

export default Option
