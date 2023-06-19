import { React, useEffect, useState, useRef, memo } from 'react'
import './Menu.css'
import shopImg from "../../../Images/shop.jfif"
import { BiSearchAlt } from 'react-icons/bi'
import { IoIosThunderstorm, IoMdAdd } from "react-icons/io"
import { IoFastFoodOutline } from 'react-icons/io5'
import { RiDeleteBin6Line } from 'react-icons/ri'
import info from "../../../API/menu.json"

function Menu(props) {
    const items = useRef()
    const [category, setCategory] = useState('beaf')
    const [data, setData] = useState()

    const categoriesHandle = (cat) => {
        const type = cat.currentTarget.classList
        if (type.length > 0) {
            setCategory(type[0])
        } else {
            setCategory(type)
        }
    }

    const clearInfo = () => {
        Object.keys(info).map((cat) => {
            info[cat].map((item) => {
                item.active = false;
                item.number = 1
            })
        })
        setData(info)
        renderData()
    }

    const addToLocal = (item) => {
        let curOrder = []
        if (localStorage.getItem('curOrder')) {
            curOrder = JSON.parse(localStorage.getItem("curOrder"))
        }
        item.total = item.price
        curOrder.push(item)
        localStorage.setItem('curOrder', JSON.stringify(curOrder))
    }

    const removeToLocal = (item) => {
        let curOrder = []
        if (localStorage.getItem('curOrder')) {
            curOrder = JSON.parse(localStorage.getItem("curOrder"))
            let arr = []
            for (let i = 0; i < curOrder.length; i++) {
                if (curOrder[i].id !== item.id && curOrder[i].img !== item.img) {
                    arr.push(curOrder[i])
                }
            }
            curOrder = arr
        }
        if (curOrder.length === 0) {
            localStorage.removeItem('curOrder')
        } else {
            localStorage.setItem('curOrder', JSON.stringify(curOrder))
        }
    }

    const itemChosen = (e) => {
        let id
        if (e === undefined) {
            return
        }
        if (typeof (e) === 'object') {
            id = e.currentTarget.id
        } else {
            id = e
        }
        if (data) {
            let cats = []
            Object.keys(data).map((cat) => {
                cats.push(cat)
            })
            for (let x = 0; x < cats.length; x++) {
                for (let i = 0; i < data[cats[x]].length; i++) {
                    data[cats[x]][i].number = 1
                    if (data[cats[x]][i].id === id) {
                        if (data[cats[x]][i].active) {
                            data[cats[x]][i].active = false
                            removeToLocal(data[cats[x]][i])
                            renderData()
                            props.sendData(JSON.parse(localStorage.getItem('curOrder')))
                            return 0
                        } else {
                            data[cats[x]][i].active = true
                            addToLocal(data[cats[x]][i])
                            renderData()
                            props.sendData(JSON.parse(localStorage.getItem('curOrder')))
                            return 0
                        }
                    }
                }
            }
        }

    }
    const isOrder = () => {
        let n = 0
        if (localStorage.getItem('isOrder')) {
            n = JSON.parse(localStorage.getItem('isOrder'))
            if (n === 1) {
                setData(info)
            } else {
                setData()
            }
        } else {
            setData()
        }
    }

    const isReady = () => {
        if (props.ready === 1) {
            setData(info)
        } else if (props.ready === 0) {
            setData()
        }
        isOrder()
    }

    const renderData = () => {
        let curOrder = []
        if (localStorage.getItem('curOrder')) {
            curOrder = JSON.parse(localStorage.getItem('curOrder'))
            curOrder.map((el) => {
                Object.keys(info).map((cat) => {
                    info[cat].map((item) => {
                        if (item.id === el.id && item.img === el.img && item.price === el.price) {
                            item.total = (item.number * item.price).toFixed(2)
                            item.active = true
                        }
                    })
                })
            })
        } else {
            Object.keys(info).map((cat) => {
                info[cat].map((item) => {
                    item.active = false
                })
            })
        }
        setData(info)
        isReady()
    }

    // localStorage.clear()


    useEffect(() => {
        if (props.cancel) {
            clearInfo()
        }
        if (props.render) {
            itemChosen(props.render)
        }
        renderData()
    }, [props.cancel, props.ready, props.render])


    return (
        <div className='menu'>
            <div className="contain">
                <div className="lists">
                    {/* <div className="head">
                        <div className="add">
                            <i>
                                <IoMdAdd />
                            </i>
                            <span>Add New Item</span>
                        </div>

                        <div className="search">
                            <input onInput={(e) => searchForItem(e)} type="search" placeholder='Search Items here...' />
                            <i onClick={(e) => toggleSearch(e)}>
                                {isSearch ? <BiSearchAlt /> : <RiDeleteBin6Line />}
                            </i>
                        </div>
                    </div> */}

                    <nav className="items" ref={items}>
                        {
                            data ? <ul>
                                {
                                    data[category].map((item) => {
                                        return (
                                            <li key={item.id} id={item.id} className={item.active ? "item active" : "item"} onClick={(e) => itemChosen(e)}>
                                                <picture>
                                                    <img src={item.img} alt={item.name} />
                                                </picture>
                                                <div className="info">
                                                    <span className="name">{item.name}</span>
                                                    <span className="price">$ {item.price}</span>
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                            </ul> : (<picture className='no-order'>
                                <img src={shopImg} alt="shopImg" />
                            </picture>)
                        }
                    </nav>
                </div>
                <div className="categories">
                    <ul className='cats'>
                        {
                            data ? Object.keys(data).map((type, i) => {
                                return (
                                    <li key={i} onClick={(e) => categoriesHandle(e)} id={i} className={type === category ? `${type} active` : type}>
                                        <i>
                                            <IoFastFoodOutline />
                                        </i>
                                        <span className="name">{type}</span>
                                    </li>
                                )
                            }) : (<></>)
                        }
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default memo(Menu);

