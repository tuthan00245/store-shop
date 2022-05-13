import React, { useEffect, useState } from 'react'
import './dashboardOrders.scss'
import DataTable from 'react-data-table-component'
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import Loader from '../loader/Loader'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';


const DashboardOrders = () => {
    const history = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [keyFresh, setKeyFresh] = useState(0)
    const [countSelected, setCountSelected] = useState(0)
    const [arrayId, setArrayId] = useState([])

    const [orders, setOrders] = useState([])

    useEffect(() => {
        const getOrders = async () => {
            try {
                const { data } = await axios.get('/api/v1/admin/orders')
                if (data.success) {
                    setOrders(data.orders)
                    setIsLoading(true)
                }
            } catch (error) {
                console.log(error.response.data.message)
            }
        }
        getOrders()
    }, [keyFresh])

    const handleDeleteOrder = async (row) => {
        try {
            const { data } = await axios.delete(`/api/v1/admin/order/${row._id}`)
            if (data.success) {
                setKeyFresh(oldv => oldv + 1)
                setCountSelected(0)

            }
        } catch (error) {
            console.log(error.data.response.message)
        }
    }

    const columns = [
        {
            name: "Id",
            selector: (row) => row._id
        },
        {
            name: "Số sản phẩm",
            selector: (row) => row.orderItems.length,
            sortable: true
        },
        {
            name: "Tổng tiền",
            selector: (row) => { return `${Math.floor(row.totalPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}đ`},
            sortable: true

        },
        {
            name: "Đặt hàng lúc",
            selector: (row) => row.paidAt.slice(0, 10),
            sortable: true
        },
        {
            name: "Tiến trình",
            selector: (row) => {return `${row.orderStatus === 'Processing' ? 'Đang xử lý': row.orderStatus === 'Shipped' ? 'Đã đặt ship': 'Đã nhận hàng'}`}
        },
        {
            name: "Actions",
            selector: (row) => <div className='action--item'>
                <button className='btn' onClick={() => { history(`/dashboard/update/order/${row._id}`) }}>Sửa</button>
                <button className='btn' onClick={() => { handleDeleteOrder(row) }}>Xóa</button>
            </div>
        }
    ]

    const tableData = {
        columns,
        data: orders
    }

    const handleSelectedChange = (state) => {
        setCountSelected(state.selectedCount)
        let array = [];
        state.selectedRows.forEach((item, i) => {
            array.push(item._id)
        })
        setArrayId(array)
    }
    const handleDeleteMutiple = async () => {
        const config = {
            "Content-Type": "application/json"
        }
        try {
            const { data } = await axios.post('/api/v1/admin/muitiple/order', { id: arrayId }, config)
            if (data.success) {
                setKeyFresh(oldv => oldv + 1)
                setCountSelected(0)

            }
        } catch (error) {
            console.log(error.data.response.message)
        }
    }

    return (
        <div className="col l-10 ">
            {
                isLoading ?
                //  <DataTableExtensions {...tableData} >
                    <DataTable
                        title="Danh sách đơn hàng"
                        columns={columns}
                        data={orders}
                        pagination
                        fixedHeader
                        fixedHeaderScrollHeight='400px'
                        selectableRows
                        selectableRowsHighlight={false}
                        onSelectedRowsChange={handleSelectedChange}
                        actions={
                            <div>
                                <button className='btn' onClick={handleDeleteMutiple}>Xóa ({countSelected}) </button>
                            </div>
                        }
                        dense
                    />
                // </DataTableExtensions> 
                : <Loader />
            }
        </div>
    )
}

export default DashboardOrders
