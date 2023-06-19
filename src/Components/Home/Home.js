import { React, memo } from 'react'
import './Home.css'
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    const gotToOrders = () => {
        navigate("/orders", { replace: true })
    }

    const gotToNewOrders = () => {
        navigate("/cashier", { replace: true })
    }

    const gotToHoldOrders = () => {
        navigate("/holds", { replace: true })
    }
    return (<>
        <section className='home'>
            <div className="contain">
                <div className="content">
                    <h1>welcome to webGhoul system</h1>
                    <div className="btns">
                        <div className="btn newOrder">
                            <button onClick={() => gotToNewOrders()}>New Order</button>
                        </div>
                        <div className="btn Orders">
                            <button onClick={() => gotToOrders()}>Orders</button>
                        </div>
                        <div className="btn holdOrders">
                            <button onClick={() => gotToHoldOrders()}>Hold Orders</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>
    );
}

export default memo(Home);
