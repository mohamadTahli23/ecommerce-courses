'use client'
import { useEffect } from "react"
import ProductList from "./ProductList"
import ProductApi from "./_utils/ProductApi"

function ProductSection() {

    useEffect(() => {
        getLatestProduct_()
    },[])

    const getLatestProduct_ = () => {
        ProductApi.getLatestProducts().then(res => {
            console.log(res.data);
        })
    }

  return (
    <div><ProductList/></div>
  )
}

export default ProductSection