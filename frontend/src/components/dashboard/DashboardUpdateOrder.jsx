import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import Loader from '../loader/Loader'
import './dashboardUpdateOrder.scss'

const DashboardUpdateOrder = () => {
  const history = useNavigate()
  const { id } = useParams()
  const [order, setOrder] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [keyFresh, setKeyFresh] = useState(0)
  const [orderItems, setOrderItems] = useState([])
  const [time, setTime] = useState('')
  const [shippingInfo, setShippingInfo] = useState([])
  const [status, setStatus] = useState('')

  useEffect(() => {
    const getOrder = async () => {
      const { data } = await axios.get(`/api/v1/order/${id}`)
      setOrder(data.order)
      setTime(data.order.createdAt.slice(0, 10))
      setOrderItems(data.order.orderItems)
      setShippingInfo(data.order.shippingInfo)
      setIsLoading(true)
    }
    getOrder()
  }, [keyFresh])

  const handleUpdate = async () => {
    const config = {
      header: {
        "Content-Type": "application/json"
      }
    }
    try {
      if (status !== '') {
        const { data } = await axios.put(`/api/v1/admin/order/${id}`, { status }, config)
        if (data.success) {
          setKeyFresh(oldv => oldv + 1)
          history('/dashboard/orders')
        }
      }
    } catch (error) {
      console.log(error.response.data.message)
    }
  }
  return (
    <>
      <div className="col l-7">
        {
          isLoading ? <div className='wrap--product__order'>
            <div className="heading--time">
              <h3>Đặt hàng vào lúc: <span>{time}</span></h3>
            </div>
            <div className="wrap--main">
              <div className="products">
                <h2>Chi tiết sản phẩm</h2>
                {
                  orderItems.map((item, i) => (
                    <div className='wrap--product__order--twice' key={i}>
                      <div className="products__image">
                        <img src={item.image} alt="order" />
                      </div>
                      <div className="products__info">
                        <div className="products__info--name">
                          <h4>{item.name} <span>x{(item.quantity)}</span></h4>
                        </div>
                        <div className="products__info--price">
                          <h4>Giá: <span>{Math.floor(item.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}đ</span></h4>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
              <div className="info--all">
                <div className="info--all__heading">
                  <h2>Thông tin đơn hàng</h2>
                  <ul>
                    <li>Địa chỉ: {shippingInfo.address}</li>
                    <li>Số điện thoại: {shippingInfo.phoneNo}</li>
                    <li>Tình trạng đơn hàng: <span className='order-status'>{order.orderStatus === 'Processing' ? "Đang xử lý" : order.orderStatus === 'Shipped' ? 'Đã đặt ship' : 'Đã nhận hàng'}</span></li>
                  </ul>
                  <h2>Thông tin sản phẩm</h2>
                  <ul>
                    <li>Tạm tính (sản phẩm) <span>{Math.floor(order.itemsPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span></li>
                    <li>Phí giao hàng <span>{Math.floor(order.shippingPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}đ</span></li>
                    <li>Thuế(VAT) <span>10%</span></li>
                    <li><h2>TỔNG TIỀN <span>(Tiền mặt)</span></h2> <span>{Math.floor(order.totalPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}đ</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div> : <Loader />
        }
      </div>
      <div className="col l-3 select-status">
        <h1>Cập nhật trạng thái</h1>
        <select name="update" id="" onChange={(e) => { setStatus(e.target.value) }}>
          <option value="">Chọn trạng thái</option>
          <option value="Shipped">Đã đặt ship</option>
          <option value="Delivered">Đã nhận hàng</option>
        </select>
        <button className='btn' onClick={handleUpdate}>Cập nhật</button>
      </div>
    </>
  )
}

export default DashboardUpdateOrder

