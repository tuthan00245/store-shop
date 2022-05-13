import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './confirmOrder.scss'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const ConfirmOrder = ({ arrayId, isDisplay, provisional, moneyShip, setIsDisplay, isOne, product, products, keys, quantity, productSelected }) => {
    const history = useNavigate()
    if (!isOne) {
        var newArray = []
        keys.forEach((k, i) => {
            if (products[k].selected) {
                newArray.push(products[k])
            }
        })
    }
    const confirmRef = useRef()
    const ovlRef = useRef()

    const [address, setAddress] = useState('')
    const [refreshKey, setRefreshKey] = useState(0);
    const [city, setCity] = useState('')
    const [phoneNo, setPhoneNo] = useState('')
    const [country, setCountry] = useState('')

    const handleDisplay = () => {
        if (isDisplay) {
            confirmRef.current.classList.add('show')
            ovlRef.current.classList.add('show')
        }
    }
    handleDisplay()
    useEffect(() => {

    }, [isDisplay, refreshKey])

    const handleClose = () => {
        confirmRef.current.classList.remove('show')
        ovlRef.current.classList.remove('show')
        setIsDisplay(!isDisplay)
    }

    if (isOne) {
        var provisional = (product.price * (100 - product.sale) / 100) * quantity;
        var sum = ((((product.price * (100 - product.sale) / 100) * quantity) + product.moneyShip) * 110 / 100)
    }
    else {
        sum = (provisional + moneyShip) * 110 / 100
    }

    const handleCreateOrder = async (e) => {
        e.preventDefault()
        const config = {
            header: {
                "Content-Type": "application/json",
            },
        }
        if (isOne && address !== '' && city !== "" && phoneNo !== "" && country !== "") {
            const shippingInfo = { address, country, city, phoneNo }
            const orderItems = [{ name: product.name, price: product.price, quantity, image: product.images[0].url, product: product._id }]
            const { data } = axios.post('/api/v1/order/new', { shippingInfo, orderItems, itemsPrice: provisional, taxPrice: 10, shippingPrice: product.moneyShip, totalPrice: sum }, config)
            toast.success("Sản phẩm đã được đặt hàng")
            setRefreshKey(oldv => oldv + 1)
            history('/myorder')
        } else if (address !== '' && city !== "" && phoneNo !== "" && country !== "") {
            const shippingInfo = { address, country, city, phoneNo }
            const orderItems = []
            newArray.forEach((item, i) => {
                orderItems.push({ name: item.name, price: item.price, quantity: item.quantity, image: item.images, product: item._id })
            })
            const { data } = axios.post('/api/v1/order/new', { shippingInfo, orderItems, itemsPrice: provisional, taxPrice: 10, shippingPrice: moneyShip, totalPrice: sum }, config)
            toast.success("Sản phẩm đã được đặt hàng")
            setRefreshKey(oldv => oldv + 1)

            history('/myorder')
        }


        handleDeleteCartItem(arrayId)
    }

    const handleDeleteCartItem = async (id) => {
        const config = {
            header: {
                "Content-Type": "application/json"
            }
        }
        const { data } = await axios.post('/api/v1/cart/items', { id }, config)
        if (data) {
            setRefreshKey(oldKey => oldKey + 1)
        }
    }
    return (
        <div className='confirm-order'>
            <div ref={ovlRef} className="ovrly"></div>
            <form ref={confirmRef} onSubmit={handleCreateOrder} className="confirm">
                <div className="closed" onClick={handleClose}><i className="fa-solid fa-square-xmark"></i></div>
                <div className="form--left">
                    <div className="heading-confirm">
                        <h2>CHI TIẾT ĐƠN HÀNG</h2>
                    </div>
                    <div className="form-group">
                        <div className="form-group__align">
                            <label htmlFor="address">Địa chỉ:</label>
                        </div>
                        <input
                            type="text"
                            id='address'
                            required
                            placeholder="Nhập địa chỉ..."
                            onChange={(e) => setAddress(e.target.value)}
                            value={address}
                            tabIndex={1}
                        />
                    </div>
                    <div className="form-group">
                        <div className="form-group__align">
                            <label htmlFor="city">Thành phố:</label>
                        </div>
                        <input
                            type="text"
                            id="city"
                            required
                            placeholder="Nhập thành phố..."
                            onChange={(e) => setCity(e.target.value)}
                            value={city}
                            tabIndex={2}
                        />
                    </div>
                    <div className="form-group">
                        <div className="form-group__align">
                            <label htmlFor="country">Quốc gia:</label>
                        </div>
                        <input
                            type="text"
                            id="country"
                            required
                            placeholder="Nhập quốc gia..."
                            onChange={(e) => setCountry(e.target.value)}
                            value={country}
                            tabIndex={3}
                        />
                    </div>
                    <div className="form-group">
                        <div className="form-group__align">
                            <label htmlFor="phone">Số điện thoại:</label>
                        </div>
                        <input
                            type="text"
                            id='phone'
                            required
                            placeholder="Nhập số điện thoại..."
                            onChange={(e) => setPhoneNo(e.target.value)}
                            value={phoneNo}
                            tabIndex={4}
                        />
                    </div>
                </div>
                <div className="form--right">
                    <div className="heading-confirm">
                        <h2>ĐƠN HÀNG CỦA BẠN</h2>
                    </div>
                    <div className="all--product">
                        <h3>Sản phẩm</h3>
                        <ul>
                            {
                                isOne ? <li>{product.name} x {quantity}
                                    <span>{Math.floor((product.price * (100 - product.sale) / 100)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}đ
                                    </span></li> : newArray.map((item, i) => (
                                        <li key={i}>{item.name} x {item.quantity}<span>{Math.floor((item.price * (100 - item.sale) / 100)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}đ</span></li>
                                    ))
                            }
                        </ul>
                        <h3>Thành tiền</h3>
                        <ul>
                            <li>Tạm tính({isOne ? quantity : productSelected}sản phẩm) <span>{isOne ? Math.floor(provisional).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : Math.floor(provisional).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}đ</span></li>
                            <li>Phí giao hàng <span>{isOne ? Math.floor(product.moneyShip).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : Math.floor(moneyShip).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}đ</span></li>
                            <li>Thuế(VAT) <span>10%</span></li>
                            <li><h2>TỔNG TIỀN</h2> <span>{Math.floor(sum).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}đ</span></li>
                        </ul>
                        <div className='product--pay'>
                            <button className='btn primary-btn' onClick={handleCreateOrder}>THANH TOÁN</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ConfirmOrder