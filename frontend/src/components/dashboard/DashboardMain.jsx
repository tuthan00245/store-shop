import React, { useState, useEffect } from 'react'
import './dashboardMain.scss'
import { Line, Doughnut } from 'react-chartjs-2'
import axios from 'axios'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { Link } from 'react-router-dom'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)
const DashboardMain = () => {

  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([]);

  const [isLoading, setIsLoading] = useState(false)
  const [orders, setOrder] = useState([])


  useEffect(() => {
    //get order
    const getOrder = async () => {
      try {
        const { data } = await axios.get('/api/v1/orders/me')
        setOrder(data.orders)
        setIsLoading(true)
      } catch (error) {
        console.log(error.response.data.error);
      }
    }
    getOrder()

    //get products
    const getProducts = async () => {
      let product = null
      product = await axios.get(`/api/v1/products`);
      setProducts(product.data.products)
      setIsLoading(true)
    }
    getProducts();

    //get users
    const getUsers = async () => {
      let user = null
      user = await axios.get('/api/v1/admin/users')
      setUsers(user.data.users)
    }
    getUsers()
  }, [])



  //get user


  let totalAmount = 0;
  orders &&
    orders.forEach((item) => {
      totalAmount += item.totalPrice;
    });
  const lineState = {
    // labels: ["Initial Amount", "Amount Earned"],
    labels: ["Tháng 2", "Tháng 4", "Tháng 6", "Tháng 8", "Tháng 10", "Tháng 12"],
    datasets: [
      {
        label: "TỔNG DOANG THU",
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        // data: [0, totalAmount],
        data: [1500202, 2489000, 9462821, 8402832, 15528293, totalAmount]
      },
      // {
      //   label: "Second dataset",
      //   data: [33, 25, 35, 51, 54, 76],
      //   fill: false,
      //   borderColor: "#742774"
      // }
    ],
  };


  let outOfStock = 0;

  products &&
    products.forEach((item) => {
      if (item.Stock === 0) {
        outOfStock += 1;
      }
    });


  const doughnutState = {
    labels: ["Hết hàng", "Còn hàng"],
    datasets: [
      {
        backgroundColor: ["#00A6B4", "#6800B4"],
        hoverBackgroundColor: ["#4B5000", "#35014F"],
        data: [outOfStock, products.length - outOfStock],
      },
    ],
  };

  return (
    // <Line options={options} data={data} />
    <div className="col l-10">
      <h1 className='title__dashboard'>THÔNG SỐ CỤ THỂ</h1>
      <div className="all--info">
        <Link to="/dashboard/orders" className="info--item orders">
          <h3>Orders </h3>
          <span><i className="fa-solid fa-burger"></i> {orders.length}</span>
        </Link>
        <Link to="/dashboard/users" className="info--item">
          <h3>Users </h3>
          <span><i className="fa-solid fa-users"></i> {users.length}</span>
        </Link>
        <Link to="/dashboard/products" className="info--item products">
          <h3>Products </h3>
          <span><i className="fa-solid fa-cart-shopping"></i> {products.length}</span>
        </Link>
      </div>

      <div className="chart__dashboard">
        <div className="lineChart">
          <h1>BẢNG THỐNG KÊ DOANH THU</h1>
          <Line data={lineState} />
        </div>
        <div className="doughnutChart">
          <h1>BIỂU ĐỒ THỐNG KÊ SẢN PHẨM</h1>
          <Doughnut data={doughnutState} />
        </div>
      </div>
    </div>
  )
}

export default DashboardMain