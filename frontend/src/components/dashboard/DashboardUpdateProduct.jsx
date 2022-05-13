import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import './dashboardUpdateProduct.scss'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const DashboardUpdateProduct = () => {
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
    const [oldImages, setOldImages] = useState([]);

    const {id} = useParams()

    const updateProductImagesChange = (e) => {
        const files = Array.from(e.target.files);

        setImages([]);
        setAvatarPreview([]);
        setOldImages([]);

        files.forEach((file) => {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview([...avatarPreview, reader.result]);
                    setImages([...images, reader.result]);
                }
            };
            reader.readAsDataURL(file);
        });
        console.log({images});
    };
    useEffect(() => {
        const getProduct = async () => {
            const { data } = await axios.get(`/api/v1/product/${id}`);
            setName(data.product.name);
            setDescription(data.product.description);
            setPrice(data.product.price);
            setCategory(data.product.category);
            setStock(data.product.Stock);
            setOldImages(data.product.images);
            setMoneyShip(data.product.moneyShip)
        }
        getProduct();
    }, [keyFresh])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const config = {
            header: {
                "Content-Type": "application/json"
            }
        }
        try{
            const {data} = await axios.put(`/api/v1/admin/product/${id}`, { name, description, price, category, Stock, sale, moneyShip, images }, config)
            if (data.success) {
                toast.success("Sản phẩm mới vừa được tạo thành công")
                history('/dashboard/products')
                setKeyFresh(oldv => oldv + 1)
            }
        }catch(error) {
            console.log(error.response.data.message)
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
                        value={moneyShip}
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
                        value={price}

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
                        value={sale}

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
                        value={Stock}

                        onChange={(e) => { setStock(e.target.value) }}
                    />
                </div>
                <div className="form-group avt-file">
                    <label className='file'>
                        <input
                            type="file"
                            name="avatar"
                            accept="image/*"
                            onChange={updateProductImagesChange}
                            multiple
                        />
                        <span className='file-custom'>
                        </span>
                    </label>
                    <div className="wrap--img--product">
                        {
                            oldImages.length > 0 ? oldImages.map((avt, i) => (
                                <img key={i} src={avt.url} alt="Avatar Preview" />
                            )) : avatarPreview.map((avt, i) => (
                                <img key={i} src={avt} alt="Avatar new" />
                            ))
                        }
                    </div>
                </div>
                <button className='btn' onClick={handleSubmit}>TẠO MỚI</button>
            </form>
        </div>
    )
}

export default DashboardUpdateProduct