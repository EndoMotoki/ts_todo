import express from 'express';
import todoRoutes from './routes/todoRoutes';
import { top } from './controllers/todoController';
import dotenv from 'dotenv';
import path from 'path';
import bodyParser from "body-parser";


dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views','/src/views');
app.set('views', path.join(__dirname, 'views')); // 修正: TypeScript用に調整

app.set('/',top);
app.use('/',todoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
