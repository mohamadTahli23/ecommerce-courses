import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";
import { useUser } from "@clerk/nextjs";
import OrderApi from "../../_utils/OrderApi";
import cartApis from "../../_utils/cartApis";

const CheckoutForm = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState();
  const [loading, setLoading] = useState(false);

  const { cart, setCart } = useContext(CartContext);
  const { user } = useUser();

  /* EVENT HANDLER */

  const handleError = (error) => {
    setLoading(false);
    setErrorMessage(error.message);
  };

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    // Create New Order
    createOrder();

    // Send an Email
    sendEmail();

    setLoading(true);

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      handleError(submitError);
      return;
    }

    const bodyReq = {
      amount: amount,
    };

    // Create the PaymentIntent and obtain clientSecret
    const res = await fetch("api/create-intent", {
      method: "POST",
      body: JSON.stringify(bodyReq),
    });

    const clientSecret = await res.text();

    // Confirm the PaymentIntent using the details collected by the Payment Element
    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: "http://localhost:3000/payment-confirm",
      },
    });

    if (result.error) {
      // This point is only reached if there's an immediate error when
      console.log(result.error.message);
      handleError(error);
    } else {
      // Your customer is redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer is redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  const createOrder = () => {
    let productIds = [];
    cart.forEach((el) => {
      productIds.push(el?.product?.id);
    });
    const data = {
      data: {
        email: user.primaryEmailAddress.emailAddress,
        username: user.fullName,
        amount,
        products: productIds,
      },
    };
    OrderApi.createOrder(data).then((res) => {
      if (res) {
        cart.forEach((el) => {
          cartApis.deleteCartItem(el?.id).then((result) => {});
        });
      }
    });
  };

  const sendEmail = async () => {
    const res = await fetch("api/send-email", {
      method: "POST",
    });
  };

  /* ====== EVENT HANDLER ====== */

  return (
    <form onSubmit={handleSubmit}>
      <div className="mx-32 md:mx[320px] mt-12">
        <PaymentElement />
        <button className="bg-primary w-full p-2 mt-4 text-white rounded-md">
          Submit
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;
