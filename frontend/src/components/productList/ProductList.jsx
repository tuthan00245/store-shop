import React, { useState, useEffect } from 'react'
import axios from 'axios';
import './productList.scss'



import { SwiperSlide, Swiper } from 'swiper/react'
import ProductCard from '../productCard/ProductCard';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';

const ProductList = ({category}) => {
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(false)


    useEffect(() => {
        setIsLoading(false)
        const getProducts = async (category) => {
            let product = null
            if(category) {
                product = await axios.get(`/api/v1/products?resultPerPage=20&category=${category}`);
            }else{
                product = await axios.get(`/api/v1/products?resultPerPage=20`);
            }

            setProducts(product.data.products)
            setIsLoading(true)
        }
        getProducts(category);

    }, [category])

    return (
        <div style={{width: "100%"}}>
            <div className="product-list">
                <Swiper
                    modules={[Navigation, Pagination, Scrollbar, A11y]}
                    // scrollbar={{ draggable: true }}
                    grabCursor={true}
                    spaceBetween={1}
                    slidesPerView={'auto'}
                // // navigation
                // pagination={{ clickable: true }}
                >
                    {products.map((item, i) => (
                        <SwiperSlide key={i}>
                            <ProductCard product={item} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    )
}

export default ProductList