import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './dashboardProducts.scss'
import DataTable from 'react-data-table-component'
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import Loader from '../loader/Loader'
const DashboardProducts = () => {
  const history = useNavigate()
  const [products, setProducts] = useState([]);

  const [isLoading, setIsLoading] = useState(false)
  const [countSelected, setCountSelected] = useState(0)
  const [keyFresh, setKeyFresh] = useState(0)
  const [arrayId, setArrayId] = useState([])

  useEffect(() => {
    //get products
    const getProducts = async () => {
      let product = null
      product = await axios.get(`/api/v1/products?resultPerPage=1000`);
      setProducts(product.data.products)
      setIsLoading(true)
    }
    getProducts();
  }, [keyFresh])

  //delete product
  const handleDeleteProduct = async (row) => {
    try{
      const {data} = await axios.delete(`/api/v1/admin/product/${row._id}`)
      if(data.success) {
          setKeyFresh(oldv => oldv + 1 )
          setCountSelected(0)

      }
    }catch(error) {
      console.log(error.response.data.message);
    }
  }

  const columns = [
    {
      name: "Id",
      selector: (row) => row._id.toString()
    },
    {
      name: "Name",
      selector: (row) => row.name.toString(),
      sortable: true
    },
    {
      name: "Stock",
      selector: (row) => row.Stock.toString(),
      sortable: true

    },
    {
      name: "Price",
      selector: (row) => { return `${Math.floor(row.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}đ`.toString()},
      sortable: true
    },
    {
      name: "Actions",
      selector: (row) => <div className='action--item'>
        <button className='btn' onClick={() => {history(`/dashboard/update/product/${row._id}`)}}>Sửa</button>
        <button className='btn' onClick={() => {handleDeleteProduct(row)}}>Xóa</button>
      </div>
    }
  ]
  const handleSelectedChange = (state) => {
    setCountSelected(state.selectedCount)
    let array = [];
    state.selectedRows.forEach((item, i) => {
      array.push(item._id)
    })
    setArrayId(array)
  }

  const tableData = {
    columns,
    data: products
  }

  const handleDeleteMutiple = async () => {
    const config = {
      header: {
        "Content-Type": "application/json"
      }
    }
    try{
      const {data} = await axios.post('/api/v1/admin/muitiple/product', {id: arrayId}, config)
      if(data.success) {
        setKeyFresh(oldv => oldv + 1)
        setCountSelected(0)

      }
    }catch(error) {
      console.log(error.response.data.message);
    }
  }
  return (
    <div className="col l-10">
      {
        isLoading ? 
        // <DataTableExtensions {...tableData} >
        <DataTable
          title="Danh sách sản phẩm"
          columns={columns}
          data={products}
          pagination
          fixedHeader
          fixedHeaderScrollHeight='500px'
          selectableRows
          selectableRowsHighlight={false}
          onSelectedRowsChange={handleSelectedChange}
          actions={
            <div>
              <button className='btn' onClick={handleDeleteMutiple}>Xóa ({countSelected}) </button>
            </div>
          }
        />
      // </DataTableExtensions> 
      : <Loader />
      }
    </div>
  )
}

export default DashboardProducts