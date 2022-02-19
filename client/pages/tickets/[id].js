import Router from "next/router";
import useRequest from "../../hooks/useRequest";
const TicketPage = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      Router.push("/orders/[orderId]", `/orders/${order.id}`),
  });

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>{ticket.price}</h4>
      {errors}
      <button className="btn btn-primary" onClick={() => doRequest()}>
        Purchase
      </button>
    </div>
  );
};

TicketPage.getInitialProps = async (context, client) => {
  const { id } = context.query;
  const { data } = await client.get(`api/tickets/${id}`);
  return { ticket: data };
};

export default TicketPage;
