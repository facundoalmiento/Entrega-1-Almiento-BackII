import express from 'express';
import handlebars from 'express-handlebars';
import {Server} from 'socket.io';
import mongoose from 'mongoose';

import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js';
import userRouter from './routes/userRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import __dirname from './utils/constantsUtil.js';
import websocket from './websocket.js';

import passport from "passport";
import cookieParser from "cookie-parser";
import { iniciarPassport } from "./config/passport.config.js";
import sessionsRouter from "./routes/sessionsRouter.js";


const app = express();

const uri = 'mongodb://127.0.0.1:27017/entrega-final-almiento';
mongoose.connect(uri);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

iniciarPassport();
app.use(passport.initialize());

//Handlebars Config
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/../views');
app.set('view engine', 'handlebars');

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

//Routers
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/users', userRouter);
app.use('/', viewsRouter);
app.use("/api/sessions", sessionsRouter);

app.get('/', (req, res) => {
    res.setHeader('content-type', 'text/html');
    res.status(200).send('<h1>DALE LOBOo</h1>');
});

const PORT = 3000;
const httpServer = app.listen(PORT, () => {
    console.log(`Start server in PORT ${PORT}`);
});

const io = new Server(httpServer);

websocket(io);