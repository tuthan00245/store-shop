import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Thumbs } from 'swiper'
import Loader from '../loader/Loader'
import ProductList from '../productList/ProductList'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import Logo from '../../assets/img/cart-logo-main.svg'
import { toast } from 'react-toastify'
import ConfirmOrder from '../order/ConfirmOrder'



import './productDetail.scss'
import { Rating } from '@material-ui/lab'
import Header from '../header/Header'
const ProductDetail = () => {
  const [isDisplay, setIsDisplay] = useState(false)

  const isAuthenticated = localStorage.getItem("isAuthenticated")

  const [activeThumb, setActiveThumb] = useState()
  const { id } = useParams();
  const [product, setProduct] = useState([])
  const [image, setImage] = useState("")
  const [images, setImages] = useState([])

  const [refreshKey, setRefreshKey] = useState(0);//refresh api

  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const refComon = useRef();
  const refRelate = useRef();

  const [number, setNumber] = useState(1)


  const [productComment, setProductComment] = useState([])
  const [category, setCategory] = useState('')


  const history = useNavigate()


  //get product
  useEffect(() => {
    const getProduct = async () => {
      let results = null;
      results = await axios.get(`/api/v1/product/${id}`);
      setProduct(results.data.product);
      setImage(results.data.product.images[0].url)
      setImages(results.data.product.images)
      setCategory(results.data.product.category)
      setIsLoading(true)
      if (results) {
        results = await axios.get(`/api/v1/reviews?id=${id}`)
        setProductComment(results.data.reviews)
      }
    }
    getProduct();
  }, [id, refreshKey])

  const handleKeyDown = (event) => {
    if (event.keyCode === 13)
      event.preventDefault()
  }

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    // cleanup this component
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);


  // create or update reviews
  const handleSubmit = async (e) => {
    e.preventDefault()
    setComment('')
    setRating(0)
    const config = {
      header: {
        "Content-Type": "application/json"
      }
    }
    const { data } = await axios.put("/api/v1/review", { rating, comment, productId: id }, config)
    if (data) {
      setRefreshKey(oldKey => oldKey + 1)
    }

  }


  const handleDecrease = () => {

    if (number <= 1) {
      return
    }
    setNumber(number - 1)


  }
  const handleIncrease = () => {
    if (number >= product.Stock) {
      return
    }
    setNumber(number + 1)
  }

  //add to cart
  const handleAddToCart = async (product, quantity) => {
    try {
      const { data } = await axios.post('/api/v1/cart', { cartItems: [{ product, quantity }] })
      if (data) {
        setRefreshKey(oldKey => oldKey + 1)
      }
      history('/mycard')
      // window.location.reload("true")
    } catch (error) {
      history('/login')
    }
  }

  const handleClickScrollTop = () => {
    document.body.scrollTop(0);
    document.documentElement.scrollTop(0);
  }



  return (
    <>
      <Header />
      <div className="app-detail">
        <div className="grid wide">
          <div className="row small-gutter  app__content">
            {
              isLoading ?
                <div className="product__content">
                  <div className='change-wrap'>
                    <div className='app__product--detail'>
                      <div>
                        <Swiper
                          loop={true}
                          spaceBetween={10}
                          navigation={true}
                          modules={[Navigation, Thumbs]}
                          grabCursor={true}
                          thumbs={{ swiper: activeThumb }}
                          className='product-images-slider'
                        >
                          {
                            images.map((item, index) => (
                              <SwiperSlide key={index}>
                                <img src={item.url} alt="product images" className='image--main' />
                              </SwiperSlide>
                            ))
                          }
                        </Swiper>
                        <Swiper
                          onSwiper={setActiveThumb}
                          loop={true}
                          spaceBetween={9}
                          slidesPerView={images.length}
                          modules={[Navigation, Thumbs]}
                          className='product-images-slider-thumbs'
                        >
                          {
                            images.map((item, index) => (
                              <SwiperSlide key={index}>
                                <div className="product-images-slider-thumbs-wrapper">
                                  <img src={item.url} alt="product images" className='image--key' />
                                </div>
                              </SwiperSlide>
                            ))
                          }
                        </Swiper>
                      </div>
                    </div>
                    <div className="product-info">
                      <div className="product-info__name">
                        <span className='product-info__name--item'>{product.name}</span>
                      </div>
                      <div className="product-info__about">
                        <div className="product-info__about--ratings">
                          <Rating  {...{
                            size: "large",
                            value: product.ratings || 0,
                            readOnly: true,
                            precision: 0.5,
                          }} />
                        </div>
                        <div className="product-info__about--reviews">
                          <span className='product-info__about--reviews--item'>{product.reviews.length} <span>đánh giá</span></span>
                        </div>
                        <div className="product-info__about--sold">
                          <span className='product-info__about--sold--item'>{product.sold} <span>đã bán</span></span>
                        </div>
                      </div>
                      <div className="product-info__deal">
                        <div className="product-info__deal--item">
                          <div className="product-info__deal--item--old">
                            Giá cũ: <span>{(product.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}đ</span>
                          </div>
                          <div className="product-info__deal--item--new">
                            Giá mới: <span>{Math.floor((product.price * (100 - product.sale) / 100)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}đ</span>
                          </div>
                          <div className="product-info__deal--item--discount">
                            <span>{product.sale}% GIẢM</span>
                          </div>
                        </div>
                      </div>
                      <div className="product-info__description">
                        Description: <span>
                          ✅ {product.description}</span>
                      </div>
                      <div className='product-info__caculator'>
                        <div className="product-info--wrap">
                          <div className="product-info__caculator--number">Số lượng</div>
                          <div className='product-info__caculator--plus'>
                            <button onClick={() => { handleDecrease(); }}>-</button>
                            <input type="text" onChange={() => { }} value={`${number ? number : 1}`} />
                            <button onClick={handleIncrease}>+</button>
                          </div>
                          <div className="product-info__caculator--stock">{product.Stock} <span className='product-info__caculator--stock--real'>Sản phẩm có sẵn</span></div>
                        </div>
                        <button className='product-info__caculator--cart btn primary-btn' onClick={() => { handleAddToCart(product._id, number) }}>Thêm Vào Giỏ Hàng</button>
                        <button className='product-info__caculator--cart btn ' onClick={() => { if (isAuthenticated) { setIsDisplay(!isDisplay) } else { history("/login") } }}>Mua Hàng</button>
                      </div>
                    </div>
                  </div>
                  < div className="powered" >
                    <img src={Logo} alt="Store" />
                    <span>Tài trợ bởi DN Store 💙</span>
                  </div >
                </div> : <Loader />
            }
            <div className="reviews">
              <div className="review__heading">
                <h2>Đánh giá và nhận xét của {product.name}</h2>
              </div>
              <div className="review__add">
                <div className='review__add--info'>
                  <h1>Thêm đánh giá</h1>
                </div>
                <div className="review__add--ratings">

                  <Rating
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    size="large"
                    name='rating'
                  />
                </div>
                <div className='fix-flex'>
                  <textarea wrap='true' cols={20} rows={10} value={comment} onChange={(e) => setComment(e.target.value)} placeholder='Nhập vào đánh giá của bạn...' type="text" />
                  <button className='btn' onClick={handleSubmit}>Đánh giá</button>
                </div>
              </div>
              <div className="review__show">
                {
                  isLoading ? productComment.length ? productComment.slice(0, 5).map((cmt, i) => (
                    < div className='wrap--review__margin' key={i}>
                      <Rating
                        {...{
                          value: cmt.rating || 0,
                          readOnly: true,
                          precision: 0.5,
                        }} />
                      <div className="name--avt">
                        <div className="name--img--wrap">
                          <span>{cmt.name.slice(0, 1)}</span>
                        </div>
                        <h2>{cmt.name}</h2>
                      </div>
                      <h3>{cmt.comment}</h3>
                    </div>
                  )) : "" : <Loader />
                }
              </div>
            </div>
            <div className="section__header mb-2">
              <div className="header__trending">
                <h2>Sản Phẩm phổ biến</h2>
                {/* <div className="heading__trending__cores">
                <div className="heading__trending__cores__today show" ref={refComon} onClick={handleOnClickComon}>
                  Phổ Biến
                </div>
                <div className="heading__trending__cores__thisweek" ref={refRelate} onClick={handleOnClickRelate}>
                  Liên Quan
                </div>
              </div> */}
              </div>
              <Link to="/" onClick={handleClickScrollTop}>
                <button className="btn">
                  Xem Thêm
                </button>
              </Link>
            </div>
            <ProductList />
          </div>
        </div>

        <ConfirmOrder isOne={true} product={product} quantity={number} isDisplay={isDisplay} setIsDisplay={setIsDisplay} />
      </div>
    </>
  )
}

export default ProductDetail
