import Router from "next/router";
import { useState } from "react";
import useRequest from "../../hooks/useRequest";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/signup",
    method: "post",
    body: { email, password },
    onSuccess: () => {
      Router.push("/");
    },
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    doRequest();
  };
  return (
    <form onSubmit={onSubmit}>
      <h1>Signup</h1>
      <label htmlFor="email">Email Address</label>
      <div className="input-group">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          className="form-control"
          aria-label="Email address"
          id="email"
        />
      </div>
      <label htmlFor="password">Password</label>
      <div className="input-group">
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="form-control"
          aria-label="Password"
          id="password"
        />
      </div>
      {errors}
      <button type="submit" className="btn btn-primary">
        Signup
      </button>
    </form>
  );
};

export default SignUpPage;
