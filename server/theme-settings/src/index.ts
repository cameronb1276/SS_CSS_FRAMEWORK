import { createApp } from "./app";
import { serverPort } from "./config";

const port = serverPort();
const app = createApp();

app.listen(port, () => {
  console.log(`SS theme settings backend listening on http://localhost:${port}`);
});
