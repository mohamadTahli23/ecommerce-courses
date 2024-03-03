"use client";
import { useEffect, useState } from "react";
import ProductList from "./ProductList";
import ProductApi from "../_utils/ProductApi";

function ProductSection() {
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    getLatestProduct_();
  }, []);

  // Call APi product and save data in state
  const getLatestProduct_ = () => {
    ProductApi.getLatestProducts().then((res) => {
      //console.log(res.data.data);
      setProductList(res.data.data);
    });
  };

  return (
    <div className="px-10 md:px-20 my-14">
      <h1 className="my-3 text-xl p-2">Latest courses</h1>
      <ProductList productList={productList} />
    </div>
  );
}

export default ProductSection;
