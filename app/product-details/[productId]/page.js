"use client";
import Breadcrumb from "@/app/_components/Breadcrumb ";
import ProductApi from "@/app/_utils/ProductApi";
import React, { useEffect, useState } from "react";
import ProductBanner from "./_components/ProductBanner";
import ProductInfo from "./_components/ProductInfo";
import ProductList from "@/app/_components/ProductList";
import { usePathname } from "next/navigation";

function ProductDetails({ params }) {
  const path = usePathname();
  // STATES //
  const [productDetails, setProductDetails] = useState({});
  const [productList, setProductList] = useState([]);
  // === STATES === //

  useEffect(() => {
    getProductById();
  }, [params?.productId]);

  // HANDLER API FUNCTIONS //

  const getProductById = () => {
    ProductApi.getProductById(params?.productId).then((res) => {
      console.log(res.data.data);
      setProductDetails(res.data.data);
      getProductByCategory(res.data.data);
    });
  };

  const getProductByCategory = (product) => {
    ProductApi.getProductByCategory(product?.attributes?.category).then(
      (res) => {
        console.log(res?.data?.data);
        setProductList(res?.data?.data);
      }
    );
  };

  // === HANDLER API FUNCTIONS === //

  return (
    <div className="px-10 md:px-28 py-8">
      <Breadcrumb path={path} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-0 mt-10 justify-around">
        <ProductBanner product={productDetails} />
        <ProductInfo product={productDetails} />
      </div>

      <div>
        <h2 className="mt-24 mb-4 text-xl">Similar Product</h2>
        <ProductList productList={productList} />
      </div>
    </div>
  );
}

export default ProductDetails;
