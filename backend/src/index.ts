import express from 'express';
import createFoldersRoute from './routes/createFolders';
import bodyParser from 'body-parser';
import cors from 'cors';
import classifyRoute from "./routes/classify";
app.use("/api", classifyRoute);

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api', createFoldersRoute);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
