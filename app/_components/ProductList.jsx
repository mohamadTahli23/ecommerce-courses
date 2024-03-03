import React from "react";
import ProductItem from "./ProductItem.jsx";

function ProductList({ productList }) {
  // Make Product item compensate with data from API
  const productItems = productList.map((item) => {
    return <ProductItem product={item} key={item.id} />;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 ">
      {productItems}
    </div>
  );
}

export default ProductList;
