import { useEffect, useMemo } from 'react';
import style from './style.module.css'
import Message from './Message';
import PropTypes from "prop-types";

function Messages({page, filePath, form, setForm, messagesRef}) {
  useEffect(() => {
    console.log(form);
    if (messagesRef.current) {
      // Прокручиваем до конца с анимацией
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [form])
  
  return (
    <div ref={messagesRef} className={style.messagesContainer}>
      {form.map((item, index) => (
        <Message page={page} filePath={filePath} message={item} key={index} />
      ))}
    </div>
  )
}

Messages.propTypes = {
  form: PropTypes.array.isRequired,
};

export default Messages
