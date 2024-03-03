"use client";
import React, { useContext } from "react";
import { ShoppingCart } from "lucide-react";
import SkeletonProductInfo from "./SkeletonProductInfo";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import cartApis from "../../../_utils/cartApis";
import { CartContext } from "../../../context/CartContext";

function ProductInfo({ product }) {
  // STATES
  const { user } = useUser();
  const router = useRouter();
  // === STATES === //
  const { cart, setCart } = useContext(CartContext);

  const handelAddToCard = () => {
    if (!user) {
      router.push("/sign-in");
    } else {
      const data = {
        data: {
          username: user.fullName,
          email: user.primaryEmailAddress.emailAddress,
          products: [product?.id],
        },
      };
      cartApis
        .addToCart(data)
        .then((res) => {
          console.log("done", res);
          setCart((oldCart) => [
            ...oldCart,
            {
              id: res?.data?.data?.id,
              product,
            },
          ]);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  return (
    <div>
      {product?.id ? (
        <div>
          <h2 className="text-[20px]">{product?.attributes?.title}</h2>
          <h2 className="text-[15px] text-gray-400">
            {product?.attributes?.category}
          </h2>
          <h2 className="text-[12px] mt-5">
            {product?.attributes?.description[0]?.children[0]?.text}
          </h2>
          <h2 className="text-[32px] mt-3 text-primary">
            ${product?.attributes?.price}
          </h2>
          <button
            onClick={() => handelAddToCard()}
            className="flex gap-2 p-3 text-white bg-primary rounded-lg hover:bg-teal-600"
          >
            <ShoppingCart /> Add To Cart
          </button>
        </div>
      ) : (
        <SkeletonProductInfo />
      )}
    </div>
  );
}

export default ProductInfo;
