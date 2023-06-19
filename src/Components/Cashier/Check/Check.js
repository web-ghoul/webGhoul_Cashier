import { React, useState, useEffect, useRef, memo } from 'react'
import './Check.css'
import { FaCashRegister } from "react-icons/fa"
import Swal from 'sweetalert2'
import { IoIosAddCircleOutline } from "react-icons/io"
import { AiOutlineMinusCircle } from 'react-icons/ai'


function Check(props) {
  const noOrder = useRef()
  const order = useRef()
  const sub = useRef()
  const total = useRef()
  const tax = useRef()
  const ordersNum = useRef()
  const totalPrices = useRef()
  const normalBtns = useRef()
  const updateBtns = useRef()
  const [currentOrder, setCurrentOrder] = useState([])
  const [date, setDate] = useState(new Date().getDate())
  const [clock, setClock] = useState(new Date().getTime())



  const toggleOrder = (val) => {
    if (val === 1) {
      order.current.classList.remove('hide')
      noOrder.current.classList.add('hide')
      localStorage.setItem('isOrder', JSON.stringify(val))
      props.isReady(val)
    } else {
      order.current.classList.add('hide')
      noOrder.current.classList.remove('hide')
      localStorage.setItem('isOrder', JSON.stringify(val))
      props.isReady(val)
    }
  }

  const ordersCount = () => {
    let orders = []
    if (localStorage.getItem('orders')) {
      orders = JSON.parse(localStorage.getItem('orders'))
    }
    ordersNum.current.innerHTML = orders.length
  }

  const getTotalPrices = () => {
    let orders = []
    let total = 0
    if (localStorage.getItem('orders')) {
      orders = JSON.parse(localStorage.getItem('orders'))
      orders.map((order) => {
        total += +order.cash.total
      })
    }
    totalPrices.current.innerHTML = total.toFixed(2)
  }

  const handleSweetAlert = (title, icon, msg, btnVal) => {
    Swal.fire({
      title: title,
      text: msg,
      icon: icon,
      confirmButtonText: btnVal
    })
  }

  const getDataFromLocal = () => {
    let t = 0
    if (localStorage.getItem('curOrder')) {
      let curOrder = JSON.parse(localStorage.getItem('curOrder'))
      curOrder.map((item) => {
        t += +item.total
      })
      sub.current.innerHTML = t
      tax.current.innerHTML = (t * 5 / 100).toFixed(2)
      total.current.innerHTML = (t * 105 / 100).toFixed(2)
    } else {
      sub.current.innerHTML = (0).toFixed(2)
      tax.current.innerHTML = (0).toFixed(2)
      total.current.innerHTML = (0).toFixed(2)
    }
    totalPrices.current.innerHTML = getTotalOrdersPrice()
  }

  const increaseItem = (e) => {
    const id = e.currentTarget.parentElement.parentElement.id
    let curOrder = JSON.parse(localStorage.getItem('curOrder'))
    curOrder.map((item) => {
      if (item.id === id) {
        item.number += 1
        item.total += item.price
      }
    })
    setCurrentOrder(curOrder)
    localStorage.setItem('curOrder', JSON.stringify(curOrder))
    getDataFromLocal()
  }

  const decreaseItem = (e) => {
    const id = e.currentTarget.parentElement.parentElement.id
    let arr = []
    let curOrder = JSON.parse(localStorage.getItem('curOrder'))
    curOrder.map((item) => {
      if (item.id === id) {
        if (item.number > 1) {
          item.number -= 1
          item.total -= item.price
          arr.push(item)
        } else {
          if (curOrder.length === 1) {
            localStorage.removeItem('curOrder')
          }
          props.renderData(id)
        }
      } else {
        arr.push(item)
      }
    })
    curOrder = arr
    if (curOrder.length === 0) {
      setCurrentOrder()
      localStorage.removeItem('curOrder')
    } else {
      setCurrentOrder(curOrder)
      localStorage.setItem('curOrder', JSON.stringify(curOrder))
    }
    getDataFromLocal()
  }

  const handleCurrentOrder = (local, ID = -1) => {
    let id = 0;
    if (localStorage.getItem('id-gen')) {
      id = JSON.parse(localStorage.getItem('id-gen'))
    }
    let orders = []
    if (localStorage.getItem(local)) {
      orders = JSON.parse(localStorage.getItem(local))
    }
    let curOrder = []
    if (localStorage.getItem('curOrder')) {
      curOrder = JSON.parse(localStorage.getItem('curOrder'))
    }
    if (ID === -1) {
      localStorage.setItem('id-gen', JSON.stringify(id + 1))
      let order = {
        id: id,
        items: curOrder,
        cash: {
          sub: +sub.current.innerHTML,
          total: +total.current.innerHTML,
          tax: +tax.current.innerHTML
        }, time: {
          date: date,
          time: clock
        }
      }
      orders.push(order)
    } else {
      localStorage.setItem('id-gen', JSON.stringify(id))
      orders.map((order) => {
        if (+order.id === ID) {
          order.items = curOrder
          order.cash = {
            sub: +sub.current.innerHTML,
            total: +total.current.innerHTML,
            tax: +tax.current.innerHTML
          }
        }
      })
    }
    localStorage.setItem(local, JSON.stringify(orders))
  }

  const holdOrderBtn = () => {
    if (localStorage.getItem('curOrder')) {
      handleCurrentOrder("holdOrders")
      handleSweetAlert("Done", 'success', "The Order Is Held", "Ok")
    } else {
      handleSweetAlert("Error", "error", 'Data Is Not Found', 'Ok')
    }
    cancelOrderBtn(false)
    renderData()
  }

  const sendOrderBtn = () => {
    if (localStorage.getItem('curOrder')) {
      handleCurrentOrder("orders")
      handleSweetAlert("Done", 'success', "The Order Is Sent", "Ok")
    } else {
      handleSweetAlert("Error", "error", 'Data Is Not Found', 'Ok')
    }
    cancelOrderBtn(false)
    renderData()
  }

  const cancelOrderBtn = (val) => {
    localStorage.removeItem("curOrder")
    localStorage.removeItem("updateOrder")
    if (val) {
      handleSweetAlert("Done", 'success', "The Order Is Canceled", "Ok")
    }
    props.isCancel(0)
    toggleOrder(0)
    setCurrentOrder()
    localStorage.removeItem('isUpdate')
    renderData()
  }

  const updateOrderBtn = () => {
    if (localStorage.getItem('isUpdate')) {
      let id = 0;
      id = JSON.parse(localStorage.getItem('isUpdate'))
      handleCurrentOrder("orders", id)
      localStorage.removeItem('isUpdate')
      isUpdate()
      cancelOrderBtn(false)
      handleSweetAlert("Done", 'success', "The Order Is Update", "Ok")
    } else {
      handleSweetAlert("Error", 'error', "The Order Is Not Found", "Ok")
    }
    renderData()
  }

  const renderData = () => {
    let curOrder = []
    if (localStorage.getItem('curOrder')) {
      curOrder = JSON.parse(localStorage.getItem('curOrder'))
      setCurrentOrder(curOrder)
    } else {
      setCurrentOrder()
    }
    if (JSON.parse(localStorage.getItem("isOrder")) === 0) {
      localStorage.removeItem('curOrder')
      localStorage.removeItem('isUpdate')
    }
    isOrder()
    ordersCount()
    getTotalPrices()
    isUpdate()
    getDataFromLocal()
  }

  const isOrder = () => {
    let n = 0
    if (localStorage.getItem('isOrder')) {
      n = JSON.parse(localStorage.getItem('isOrder'))
      if (n === 1) {
        toggleOrder(1)
      } else {
        setCurrentOrder()
        toggleOrder(0)
      }
    } else {
      setCurrentOrder()
      toggleOrder(0)
    }
  }

  const getTotalOrdersPrice = () => {
    let total = 0;
    if (localStorage.getItem('orders')) {
      let orders = JSON.parse(localStorage.getItem('orders'))
      orders.map((order) => {
        total += order.cash.total
      })
    }
    localStorage.setItem('totalPriceOrder', JSON.stringify(total))
    return total.toFixed(2)
  }

  const isUpdate = () => {
    if (localStorage.getItem('isUpdate')) {
      updateBtns.current.classList.remove('hide')
      normalBtns.current.classList.add('hide')
    } else {
      updateBtns.current.classList.add('hide')
      normalBtns.current.classList.remove('hide')
    }
  }


  useEffect(() => {
    renderData()
    let tikTok = setInterval(() => {
      setClock(new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds())
      setDate(new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate())
    }, 1000)
    return (() => clearInterval(tikTok))
  }, [props.data])


  return (
    <div className='check'>
      <div className="contain">
        <div className="head">
          <span className="date">{date}</span>
          <span className='clock'>{clock}</span>
        </div>

        <div className="no-order" ref={noOrder}>
          <i>
            <FaCashRegister />
          </i>
          <h3>You don't have new order's yet</h3>
          <div className="btn">
            <button onClick={() => toggleOrder(1)}>new order</button>
          </div>
        </div>

        <div className="order hide" ref={order}>
          <div className="border">
            <div className="lists">
              <ul className="top">
                <li>Name</li>
                <li>QTY</li>
                <li>Each</li>
                <li>Total</li>
              </ul>

              <div className="orders">
                {
                  currentOrder ? currentOrder.map((e, i) => {
                    return (
                      <ul key={i} id={e.id}>
                        <li className='name'>{e.name}</li>
                        <li className='QTY'>
                          <span className="min" onClick={(e) => decreaseItem(e)}>
                            <AiOutlineMinusCircle />
                          </span>
                          <span className="qty">{e.number}</span>
                          <span className="add" onClick={(e) => increaseItem(e)}>
                            <IoIosAddCircleOutline />
                          </span>
                        </li>
                        <li className='each'>${e.price}</li>
                        <li className="total">${e.total}</li>
                      </ul>
                    )
                  }) : (
                    <h4 className='noItem'>No Items Yet</h4>
                  )
                }
              </div>
            </div>

            <div className="info-price">
              <div className="sub-total">
                <span>Sub Total</span>
                <div className="sub-price">$ <span className='sub' ref={sub}>0.00</span></div>
              </div>
              <div className="tax">
                <span>tax <span className="precent">5%</span></span>
                <div className="tax-price">$ <span className='tax' ref={tax}>0.00</span></div>
              </div>
              <div className="total">
                <span>Total</span>
                <div className="total-price">$ <span className='total' ref={total}>0.00</span></div>
              </div>
            </div>
          </div>

          <div className="btns normal" ref={normalBtns}>
            <div className="hold-btn">
              <button onClick={(e) => holdOrderBtn()}>Hold Order</button>
            </div>
            <div className="options-btn">
              <button className='cancel' onClick={() => cancelOrderBtn(true)}>Cancel Order</button>
              <button onClick={() => sendOrderBtn()}>Send Order</button>
            </div>
          </div>

          <div className="btns btns-update hide" ref={updateBtns}>
            <button className='cancel' onClick={() => cancelOrderBtn(true)}>Cancel</button>
            <button onClick={() => updateOrderBtn()}>Update Order</button>
          </div>
        </div>

        <div className="info">
          <span>Total order's today</span>
          <span className="counter" ref={ordersNum}>0</span>
          <span className="total-price">$ <span className='price' ref={totalPrices}>0</span> </span>
        </div>
      </div>
    </div>
  );
}

export default memo(Check);
