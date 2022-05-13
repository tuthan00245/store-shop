import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './dashboardUsers.scss'
import DataTable from 'react-data-table-component'
import DataTableExtensions from 'react-data-table-component-extensions';
import "react-data-table-component-extensions/dist/index.css";
import Loader from '../loader/Loader'
import { useNavigate } from 'react-router-dom';


const DashboardUsers = () => {
    const history = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [keyFresh, setKeyFresh] = useState(0)
    const [countSelected, setCountSelected] = useState(0)
    const [arrayId, setArrayId] = useState([])


    const [users, setUsers] = useState([])

    useEffect(() => {
        const getUsers = async () => {
            try {
                const { data } = await axios.get('/api/v1/admin/users')
                if (data.success) {
                    setIsLoading(true)
                    setUsers(data.users)
                }
            } catch (error) {
                console.log(error.response);
            }
        }
        getUsers()
    }, [keyFresh])

    const handleDeleteUser = async (row) => {
        try {
            const { data } = await axios.delete(`/api/v1/admin/user/${row._id}`)
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
            selector: (row) => row._id,
        },
        {
            name: "Tên",
            selector: (row) => row.name,
            sortable: true
        },
        {
            name: "Email",
            selector: (row) => row.email,
            sortable: true

        },
        {
            name: "Tham gia lúc",
            selector: (row) => row.createAt.slice(0, 10),
            sortable: true
        },
        {
            name: "Actions",
            selector: (row) => <div className='action--item'>
                <button className='btn' onClick={() => {history(`/dashboard/update/user/${row._id}`) }}>Sửa</button>
                <button className='btn' onClick={() => {handleDeleteUser(row) }}>Xóa</button>
            </div>,
            
        }
    ]

    const tableData = {
        columns,
        data: users
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
            const { data } = await axios.post('/api/v1/admin/muitiple/user', { id: arrayId }, config)
            if (data.success) {
                setKeyFresh(oldv => oldv + 1)
                setCountSelected(0)
            }
        } catch (error) {
            console.log(error.data.response.message)
        }
    }
    return (
        <div className="col l-10">
            {
                isLoading ? 
                // <DataTableExtensions {...tableData} >
                    <DataTable
                        title="Danh sách người dùng"
                        columns={columns}
                        data={users}
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

export default DashboardUsers