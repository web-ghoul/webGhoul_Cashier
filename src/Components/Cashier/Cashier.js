import { React, useState, memo, useEffect } from 'react'
import './Cashier.css'
import Menu from "./Menu/Menu"
import Check from "./Check/Check"

function Cashier() {
    const [data, setData] = useState()
    const [cancel, setCancel] = useState()
    const [ready, setReady] = useState()
    const [render, setRender] = useState()

    const sendData = (info, id) => {
        setData(info)
    }

    const isCancel = (data) => {
        setCancel(data)
    }

    const isReady = (data) => {
        setReady(data)
    }

    const renderData = (data) => {
        setRender(data)
    }
    return (
        <section className='cashier'>
            <div className="contain">
                <Menu sendData={sendData} render={render} ready={ready} cancel={cancel} />
                <Check data={data} renderData={renderData} isReady={isReady} isCancel={isCancel} />
            </div>
        </section>
    );
}

export default memo(Cashier);
