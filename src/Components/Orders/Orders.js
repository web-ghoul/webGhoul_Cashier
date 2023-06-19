import { React, useState, useEffect, useRef, memo } from 'react'
import './Orders.css'
import womanImg from '../../Images/woman_working_2.svg'
import { useNavigate } from "react-router-dom";

function Orders() {
  // const searchDate = useRef()
  // const searchTime = useRef()
  const searchNumber = useRef()
  const navigate = useNavigate();
  const [data, setData] = useState([])

  // const searchByDate = () => {
  //   const dateInput = searchDate.current.value
  //   let orders = []
  //   if (localStorage.getItem("orders")) {
  //     orders = JSON.parse(localStorage.getItem("orders"))
  //     setData(orders)
  //   }
  //   if (dateInput) {
  //     setData((d) => d.filter(e => e.time.date === dateInput))
  //   }
  // }

  // const emptySearchByDate = () => {
  //   const dateInput = searchDate.current.value
  //   if (!dateInput) {
  //     let orders = []
  //     if (localStorage.getItem("orders")) {
  //       orders = JSON.parse(localStorage.getItem("orders"))
  //       setData(orders)
  //     }
  //   }
  // }

  // const searchByTime = () => {
  //   const timeInput = searchTime.current.value
  //   console.log(timeInput)
  //   let orders = []
  //   if (localStorage.getItem("orders")) {
  //     orders = JSON.parse(localStorage.getItem("orders"))
  //     setData(orders)
  //   }
  //   if (timeInput) {
  //     setData((d) => d.filter(e => {
  //       let h = +e.time.time.split(":")[0] === +timeInput.split(":")[0]
  //       let m = +e.time.time.split(":")[1] === +timeInput.split(":")[1]
  //       if (h && m) {
  //         return e
  //       }
  //     }))
  //   }
  // }

  // const emptySearchByTime = () => {
  //   const timeInput = searchTime.current.value
  //   if (!timeInput) {
  //     let orders = []
  //     if (localStorage.getItem("orders")) {
  //       orders = JSON.parse(localStorage.getItem("orders"))
  //       setData(orders)
  //     }
  //   }
  // }

  const searchByNumber = () => {
    const numberInput = searchNumber.current.value
    let orders = []
    if (localStorage.getItem("orders")) {
      orders = JSON.parse(localStorage.getItem("orders"))
      setData(orders)
    }
    if (numberInput) {
      setData((d) => d.filter(e => +e.id === +numberInput))
    }
  }

  const emptySearchByNumber = () => {
    const numberInput = searchNumber.current.value
    if (!numberInput) {
      let orders = []
      if (localStorage.getItem("orders")) {
        orders = JSON.parse(localStorage.getItem("orders"))
        setData(orders)
      }
    }
  }

  const clearInput = (e) => {
    e.currentTarget.parentElement.parentElement.children[1].value = ""
    // emptySearchByDate()
    emptySearchByNumber()
    // emptySearchByTime()
  }

  const deleteOrder = (e) => {
    let id = e.currentTarget.parentElement.parentElement.id
    let total = 0;
    let orders = []
    orders = JSON.parse(localStorage.getItem("orders"))
    let arr = []
    for (let i = 0; i < orders.length; i++) {
      if (+orders[i].id !== +id) {
        arr.push(orders[i])
      }
      if (+orders[i].id === +id) {
        total = orders[i].cash.total
      }
    }
    orders = arr
    localStorage.setItem("orders", JSON.stringify(orders))
    setData(orders)
    if (orders.length === 0) {
      localStorage.removeItem("orders")
      localStorage.setItem("totalPriceOrder", JSON.stringify(0))
    } else {
      let totalPrice = JSON.parse(localStorage.getItem("totalPriceOrder")) - total
      localStorage.setItem("totalPriceOrder", JSON.stringify(totalPrice))
    }
  }

  const updateOrder = (e) => {
    let id = e.currentTarget.parentElement.parentElement.id
    let updateOrder
    let orders = JSON.parse(localStorage.getItem("orders"))
    for (let i = 0; i < orders.length; i++) {
      if (+orders[i].id === +id) {
        updateOrder = orders[i]
        break;
      }
    }
    localStorage.setItem('curOrder', JSON.stringify(updateOrder.items))
    localStorage.setItem("isOrder", JSON.stringify(1))
    localStorage.setItem('isUpdate', JSON.stringify(+id))
    navigate("/cashier", { replace: true })
  }

  useEffect(() => {
    let orders = []
    if (localStorage.getItem("orders")) {
      orders = JSON.parse(localStorage.getItem("orders"))
      setData(orders)
    }
  }, [])

  return (
    <section className="orders">
      <div className="contain">
        <div className="head">
          <picture>
            <img src={womanImg} alt="womanImg" />
          </picture>
          <h2>All Orders</h2>
        </div>
        <div className="orders-control">
          <form action="">
            {/* <div className="search-date">
              <label htmlFor="date">Search By Date</label>
              <input type="date" id='date' onInput={() => emptySearchByDate()} ref={searchDate} />
              <div className="btn">
                <button type='button' onClick={(e) => clearInput(e)}>Clear</button>
                <button type='button' onClick={() => searchByDate()}>Search</button>
              </div>
            </div>
            <div className="search-time">
              <label htmlFor="time">Search By Time</label>
              <input type="time" id="time" onInput={() => emptySearchByTime()} ref={searchTime} />
              <div className="btn">
                <button type='button' onClick={(e) => clearInput(e)}>Clear</button>
                <button type='button' onClick={() => searchByTime()}>Search</button>
              </div>
            </div> */}
            <div className="search-orderNum">
              <label htmlFor="number">Search By Order Number</label>
              <input type="number" id='number' onInput={() => emptySearchByNumber()} ref={searchNumber} />
              <div className="btn">
                <button type='button' onClick={(e) => clearInput(e)}>Clear</button>
                <button type='button' onClick={() => searchByNumber()}>Search</button>
              </div>
            </div>
          </form>
        </div>
        <div className="orders-lists">
          <ul>
            {data.length > 0 ? data.map(e => {
              return (
                <li key={e.id} id={e.id}>
                  <div className="info">
                    <div className="date">date : <span>{e.time.date}</span></div>
                    <div className="time">time : <span>{e.time.time}</span></div>
                  </div>
                  <div className="order-num">
                    <span>Order Number : </span>
                    <span># {e.id}</span>
                  </div>
                  <div className="items">
                    <ul className="head">
                      <li>name</li>
                      <li>number</li>
                      <li>price</li>
                      <li>total</li>
                    </ul>
                    {
                      e.items.map(i => {
                        return (
                          <ul key={i.id}>
                            <li>{i.name}</li>
                            <li>{i.number}</li>
                            <li>{i.price}</li>
                            <li>$ {(+i.number * +i.price).toFixed(2)}</li>
                          </ul>
                        )
                      })
                    }
                  </div>
                  <div className="cash">
                    <div className="sub">
                      <span>sub total : </span>
                      <span>$ {e.cash.sub}</span>
                    </div>
                    <div className="tax">
                      <span>Tax 5% : </span>
                      <span>$ {e.cash.tax}</span>
                    </div>
                    <div className="total">
                      <span>total Price : </span>
                      <span>$ {e.cash.total}</span>
                    </div>
                  </div>
                  <div className="options">
                    <button onClick={(e) => deleteOrder(e)}>Delete</button>
                    <button onClick={(e) => updateOrder(e)}>Update</button>
                  </div>
                </li>
              )
            }) : (<h3 className='noFoundData'>No Items Founds</h3>)
            }
          </ul>
        </div>
      </div>
    </section>
  );
}

export default memo(Orders);
