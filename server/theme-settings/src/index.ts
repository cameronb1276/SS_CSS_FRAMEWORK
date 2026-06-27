import { createApp } from "./app";

const port = Number(process.env.PORT ?? 3004);
const app = createApp();

app.listen(port, () => {
  console.log(`SS theme settings backend listening on http://localhost:${port}`);
});
