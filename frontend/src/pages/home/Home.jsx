import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Pagination from "react-js-pagination";
import Loader from '../../components/loader/Loader'
import ProductCard from '../../components/productCard/ProductCard';
import axios from 'axios'

import './home.scss'
import Header from '../../components/header/Header';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categorys, setCategorys] = useState([])
  const [category, setCategory] = useState("");
  const [productsCount, setProductCount] = useState(1)
  const [resultPerPage, setResultPerPage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [sort, setSort] = useState(5)
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0)
  const btnActive = useRef(null)
  const btnMoiNhat = useRef(null)
  const btnBanChay = useRef(null)

  const arrayCategory = ["Laptop", "Áo khoác", "Guitar", "Đồng hồ", "Áo phông", "Điện thoại", "Váy", "Quần"]

  useEffect(() => {
    setIsLoading(false)
    const getProducts = async (category, currentPage) => {
      let product = null
      product = await axios.get(`/api/v1/products?sort=${sort}&resultPerPage=15`);
      if (currentPage) {
        product = await axios.get(`/api/v1/products?page=${currentPage}&sort=${sort}&resultPerPage=15`);
      }
      if (category) {
        product = await axios.get(`/api/v1/products?page=${currentPage}&category=${category}&sort=${sort}&resultPerPage=15`);
      }
      setProducts(product.data.products)
      setProductCount(product.data.productsCount)
      setResultPerPage(product.data.resultPerPage)
      setCount(product.data.filteredProductsCount)
      setIsLoading(true)
    }
    getProducts(category, currentPage, sort);

    const getCategorys = async () => {
      let product = null
      product = await axios.get(`/api/v1/products?resultPerPage=15`);
      setCategorys(product.data.products)
    }
    getCategorys()

  }, [category, currentPage, sort])


  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  }
  function tabs(tab) {
    const tabss = []
    tabss.push(btnBanChay)
    tabss.push(btnMoiNhat)
    tabss.push(btnActive)
    tabss.forEach((t, i) => {
      tab.classList.add('primary-btn')

      if(t !== tab) {
        t.current.classList.remove('primary-btn')
        tab.classList.add('primary-btn')
      }
    })
  }


  return (
    <>
    <Header />
    <div className="app__container">
      <div className="grid wide">
        <div className="row sm-gutter app__content">
          <div className="col l-2 m-0 c-0">
            <nav className="category">
              <h3 className="category__heading">
                <i className="fas fa-list category__heading-icon"></i>
                Danh Mục
              </h3>
              <ul className="category__heading--list">
                <li className='category__heading--item' onClick={() => { setCategory(""); setCurrentPage(1) }}> <span className='category__heading--item-link'>ALL</span></li>
                {
                  arrayCategory.length > 0 ? arrayCategory.map((cate, i) => (
                    <li key={i} onClick={() => { setCategory(cate); setCurrentPage(1) }} className="category__heading--item ">
                      <span className='category__heading--item-link'>{cate}</span>
                    </li>
                  )) : ""
                }
              </ul>
            </nav>
          </div>
          <div className="col l-10 m-12 c-12  ">
            <div className="content__home hide-on-mobile-tablet">
              <span className="content__arrange">Sắp xếp theo</span>

              <button ref={btnActive} className="btn primary-btn content__arrange-btn" onClick={() => { setSort(5); tabs(btnActive.current);}}>Phổ biến</button>
              <button ref={btnMoiNhat} className="btn content__arrange-btn" onClick={() => { setSort(""); tabs(btnMoiNhat.current); }}>Mới nhất</button>
              <button ref={btnBanChay} className="btn content__arrange-btn" onClick={() => { setSort("banchay"); tabs(btnBanChay.current); }} >Bán chạy</button>

              <div className="content__option">
                <span className="content_option-text">Giá</span>
                <i className="fas fa-chevron-down content_option-icon "></i>
                <ul className="content__option-list">
                  <li className="content__option-item" onClick={() => { setSort(-1) }}>Giá: Cao đến thấp</li>
                  <li className="content__option-item" onClick={() => { setSort(1) }}>Giá: Thấp đến cao</li>
                </ul>
              </div>
            </div>
            {
              isLoading ? <div className="home__product">
              <div className="row sm-gutter">
                {
                  products.length > 0 ? products.map((product, i) => (
                    <ProductCard key={i} product={product} />
                  )) : "Khong co san pham nao"
                }
              </div>
            </div> : <Loader />
            }
          </div>
          {resultPerPage < count && (
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={Number(resultPerPage)}
                totalItemsCount={productsCount}
                onChange={setCurrentPageNo}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="1st"
                lastPageText="Last"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  )
}

export default Home