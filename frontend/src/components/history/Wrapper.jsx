import { useEffect, useState } from "react"
import Item from "./Item"
import style from './style.module.css'

function Wrapper() {
  const [messagesList, setMessagesList] = useState([
    // [ // этот массив означает ОДНУ СЕССИЮ
    //   {
    //     "date": "2024-11-07",
    //     "id": 1
    //   },
    //   [
    //     {
    //       'msg': 'new message',
    //       'who': 'me'
    //     },
    //     {
    //       'msg': 'new message 1',
    //       'who': ''
    //     },
    //     {
    //       'msg': '2024-11-07       1',
    //       'who': 'me'
    //     },
    //   ]
    // ],
    // [ // этот массив означает ВТОРУЮ СЕССИЮ
    //   {"date": "2024-11-07","id": 2},
    //   [
    //     {
    //       'msg': 'new message',
    //       'who': 'me'
    //     },
    //     {
    //       'msg': 'new message 1',
    //       'who': ''
    //     },
    //     {
    //       'msg': '2024-11-07       2',
    //       'who': 'me'
    //     },
    //   ]
    // ],
    // [ // этот массив означает ОДНУ СЕССИЮ
    //   {"date": "2024-11-07","id": 3},
    //   [
    //     {
    //       'msg': 'new message',
    //       'who': 'me'
    //     },
    //     {
    //       'msg': 'new message 1',
    //       'who': ''
    //     },
    //     {
    //       'msg': '2024-11-07       3',
    //       'who': 'me'
    //     },
    //   ]
    // ],
    // [ // этот массив означает ВТОРУЮ СЕССИЮ
    //   {"date": "2023-11-07","id": 4},
    //   [
    //     {
    //       'msg': 'new message',
    //       'who': 'me'
    //     },
    //     {
    //       'msg': 'new message 1',
    //       'who': ''
    //     },
    //     {
    //       'msg': '2023-11-07              1',
    //       'who': 'me'
    //     },
    //   ]
    // ],
    // [ // этот массив означает ОДНУ СЕССИЮ
    //   {"date": "2023-11-07","id": 5},
    //   [
    //     {
    //       'msg': 'new message',
    //       'who': 'me'
    //     },
    //     {
    //       'msg': 'new message 1',
    //       'who': ''
    //     },
    //     {
    //       'msg': '2023-11-07              2',
    //       'who': 'me'
    //     },
    //   ]
    // ],
    // [ // этот массив означает ВТОРУЮ СЕССИЮ
    //   {"date": "2022-11-07","id": 6},
    //   [
    //     {
    //       'msg': 'new message',
    //       'who': 'me'
    //     },
    //     {
    //       'msg': 'new message 1',
    //       'who': ''
    //     },
    //     {
    //       'msg': '2022-11-07              1',
    //       'who': 'me'
    //     },
    //   ]
    // ],[ // этот массив означает ВТОРУЮ СЕССИЮ
    //   {"date": "2022-11-07","id": 7},
    //   [
    //     {
    //       'msg': 'new message',
    //       'who': 'me'
    //     },
    //     {
    //       'msg': 'new message 1',
    //       'who': ''
    //     },
    //     {
    //       'msg': '2022-11-07              1',
    //       'who': 'me'
    //     },
    //   ]
    // ],
    // [ // этот массив означает ВТОРУЮ СЕССИЮ
    //   {"date": "202-11-07","id": 8},
    //   [
    //     {
    //       'msg': 'new message',
    //       'who': 'me'
    //     },
    //     {
    //       'msg': 'new message 1',
    //       'who': ''
    //     },
    //     {
    //       'msg': '202-11-07              1',
    //       'who': 'me'
    //     },
    //   ]
    // ],
  ])

  useEffect(() => {
    async function rr() {
      const token = "8e903923-f59b-463e-9a8a-5b172c6bc922"//localStorage.getItem('token')

      const responseChatId = await fetch('http://localhost:8000/user/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      responseChatId.json().then(result => {
        result = result.filter((msg => msg.date !== undefined))
        console.log(result)
        setMessagesList(result)
      })
    }
    rr()
  }, [])

  return (
    <div>
      {
        messagesList.map((item, index) => {
          if(index !== 0) {
            return <Item message={item} index={index} timeNext={"2022-10-10"} key={index} />
          } else {
            return <Item message={item} index={index} timeNext={"2022-10-10"} key={index} />
          }
        })
      }
    </div>
  )
}

export default Wrapper
