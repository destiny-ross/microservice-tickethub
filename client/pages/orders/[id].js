import { useEffect, useState } from "react";
import Router from "next/router";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/useRequest";
const OrderPage = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: { orderId: order.id },
    onSuccess: (payment) => Router.push("/orders"),
  });
  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  if (timeLeft < 0) {
    return <div>Order expired</div>;
  }
  return (
    <div>
      {timeLeft} seconds until order expires.
      <StripeCheckout
        email={currentUser.email}
        amount={order.ticket.price * 100}
        stripeKey="pk_test_51KTVqcBvUCV170dje1QQcbQy00o061oGAIK4RFoXFTHZOsHPMvLhM9vsi9lW9IBohk9WA5aNrMI8s9DvFH00ZDCA007ByH8Ln0"
        token={({ id }) => doRequest({ token: id })}
      />
      {errors}
    </div>
  );
};

OrderPage.getInitialProps = async (context, client) => {
  const { id } = context.query;
  const { data } = await client.get(`api/orders/${id}`);
  return { order: data };
};

export default OrderPage;
