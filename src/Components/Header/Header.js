import { React, memo, useEffect, useRef } from 'react'
import './Header.css'
import { Link } from "react-router-dom";
import { IoIosPaper } from 'react-icons/io'
import { BsShop } from 'react-icons/bs'

function Header() {
  const numbersOfOrders = useRef()

  const numbersOfHolds = useRef()

  useEffect(() => {
    const interval = setInterval(() => {
      if (localStorage.getItem("orders")) {
        numbersOfOrders.current.innerHTML = JSON.parse(localStorage.getItem("orders")).length
      } else {
        numbersOfOrders.current.innerHTML = '0'
      }
      if (localStorage.getItem("holdOrders")) {
        numbersOfHolds.current.innerHTML = JSON.parse(localStorage.getItem("holdOrders")).length
      } else {
        numbersOfHolds.current.innerHTML = '0'
      }
    });
    return () => clearInterval(interval);
  }, [])
  return (
    <>
      <header className="layout">
        <div className="contain">
          <div className="title">
            <Link to="/">
              <div className="home">
                <i>
                  <BsShop />
                </i>
                <h1>Restaurant System</h1>
              </div>
            </Link>
          </div>
          <ul className="links">
            <li>
              <Link to="/orders">
                <div className="link">
                  <span>Orders ( <span ref={numbersOfOrders} className="num-orders">0</span> )</span>
                  <i>
                    <IoIosPaper />
                  </i>
                </div>
              </Link>
            </li>
            <li>
              <Link to="/holds">
                <div className="link">
                  <span>Holds ( <span ref={numbersOfHolds} className="num-holds">0</span> )</span>
                  <i>
                    <IoIosPaper />
                  </i>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </header>
    </>
  );
}

export default memo(Header);


