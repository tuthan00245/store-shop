import React, { useEffect, useState } from 'react'
import './dashboardCreateProduct.scss'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from 'react-router-dom'

import axios from 'axios'

const DashboardCreateProduct = () => {
    const history = useNavigate()
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [moneyShip, setMoneyShip] = useState(0)
    const [price, setPrice] = useState(0)
    const [sale, setSale] = useState(0)
    const [images, setImages] = useState([])
    const [category, setCategory] = useState('')
    const [Stock, setStock] = useState(0)
    const [keyFresh, setKeyFresh] = useState(0)
    const [avatarPreview, setAvatarPreview] = useState([]);


    const createProductImagesChange = (e) => {
        const files = Array.from(e.target.files);

        setImages([]);

        files.forEach((file) => {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImages([...images, reader.result]);
                    setAvatarPreview([...images, reader.result]);
                }
            };

            reader.readAsDataURL(file);
        });
    };
    useEffect(() => {
        console.log('hehehehe');
    }, [keyFresh])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const config = {
            header: {
                "Content-Type": "application/json"
            }
        }
        try {
            const { data } = await axios.post('/api/v1/admin/product/new', { name, description, price, category, Stock, sale, moneyShip, images }, config)
            if (data.success) {
                toast.success("Sản phẩm mới vừa được tạo thành công")
                history('/dashboard/products')
                setKeyFresh(oldv => oldv + 1)
            }
        } catch (error) {
            // toast.error(`${error.response.data.message}`)
            toast.error(`Vui lòng nhập đầy đủ và chính xác thông tin!`)

        }
    }
    return (
        <div className="col l-10 create-product">
            <form action="name" onSubmit={handleSubmit}>
                <div className="form-group">
                    <div className="form-group__align">

                        <label htmlFor="name">Tên sản phẩm</label>
                    </div>
                    <input
                        type="text"
                        placeholder='Tên sản phẩm...'
                        id='name'
                        value={name}
                        onChange={(e) => { setName(e.target.value) }}
                    />
                </div>
                <div className="form-group">
                    <div className="form-group__align">

                        <label htmlFor="description">Mô tả sản phẩm</label>
                    </div>
                    <textarea
                        type="text"
                        placeholder='Mô tả sản phẩm...'
                        id='description'
                        value={description}
                        onChange={(e) => { setDescription(e.target.value) }}
                    />
                </div>
                <div className="form-group">
                    <div className="form-group__align">

                        <label htmlFor="moneyship">Tiền ship</label>
                    </div>
                    <input
                        type="number"
                        min={0}
                        placeholder='Tiền ship...'
                        id='moneyship'
                        onChange={(e) => { setMoneyShip(e.target.value) }}
                    />
                </div>
                <div className="form-group">
                    <div className="form-group__align">

                        <label htmlFor="price">Giá</label>
                    </div>
                    <input
                        type="number"
                        min={0}
                        placeholder='Giá...'
                        id='price'
                        onChange={(e) => { setPrice(e.target.value) }}
                    />
                </div>
                <div className="form-group">
                    <div className="form-group__align">

                        <label htmlFor="sale">Giảm giá</label>
                    </div>
                    <input
                        type="number"
                        min={0}
                        placeholder='Giảm giá...'
                        id='sale'
                        onChange={(e) => { setSale(e.target.value) }}
                    />
                </div>
                <div className="form-group">
                    <div className="form-group__align">

                        <label htmlFor="category">Loại</label>
                    </div>
                    <input
                        type="text"
                        placeholder='Loại...'
                        id='category'
                        value={category}
                        onChange={(e) => { setCategory(e.target.value) }}
                    />
                </div>
                <div className="form-group">
                    <div className="form-group__align">

                        <label htmlFor="stock">Số lượng</label>
                    </div>
                    <input
                        type="number"
                        min={0}
                        placeholder='Số lượng...'
                        id='stock'
                        onChange={(e) => { setStock(e.target.value) }}
                    />
                </div>
                {/* <div className="form-group">
                    <input
                        type="file"
                        name="avatar"
                        accept="image/*"
                        onChange={createProductImagesChange}
                        multiple
                    />
                </div> */}
                <div className="form-group avt-file">
                    {/* <img src={avatarPreview} alt="Avatar Preview" /> */}
                    
                    <label className='file'>
                        <input
                            type="file"
                            name="avatar"
                            accept="image/*"
                            onChange={createProductImagesChange}
                            multiple
                        />
                        <span className='file-custom'>
                        </span>
                    </label>
                    <div className="wrap--img--product">
                        {
                            avatarPreview.length > 0 && avatarPreview.map((avt, i) => (
                                 <img src={avt} alt="Avatar Preview" /> 
                            ))
                        }
                    </div>
                </div>
                <button className='btn' onClick={handleSubmit}>TẠO MỚI</button>
            </form>
        </div>
    )
}

export default DashboardCreateProduct