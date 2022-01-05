import express from "express";
import "express-async-errors";
import { NotFoundError } from "./errors/not-found-error";
import errorHandler from "./middleware/errorHandler";
import { currentUserRouter } from "./routes/currentuser";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";

const app = express();
app.use(express.json());

//

app.use(currentUserRouter);
app.use(signupRouter);
app.use(signoutRouter);
app.use(signinRouter);

// Not found
app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Auth service listening on port 3000");
});
