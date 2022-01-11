import axios from "axios";
import { useState } from "react";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/users/signup", { email, password });

      console.log(res.data);
    } catch (err) {
      setErrors(err.response.data.errors);
    }
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
      {errors.length > 0 && (
        <div className="alert alert-danger">
          <h4>Ooops..</h4>
          <ul className="my-0">
            {errors.map((err) => {
              return <li key={err.message}>{err.message}</li>;
            })}
          </ul>
        </div>
      )}
      <button type="submit" className="btn btn-primary">
        Signup
      </button>
    </form>
  );
};

export default SignUpPage;
