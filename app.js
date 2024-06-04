require('dotenv').config();

const express = require('express');
const session = require('express-session');
const { setupWebSocket, broadcast } = require('./websocket'); // นำเข้า WebSocket จากไฟล์ใหม่

const https = require('https');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const axios = require('axios');
const compression = require('compression');
/* router some page */
const router = require('./routes/router');
/* database */
const mongoose = require('mongoose');
const products = require('./routes/products');
const category = require('./routes/category');
const type = require('./routes/type');
const employees = require('./routes/employees');
const owner = require('./routes/owner');
const importProduct = require('./routes/importProduct');
const countProduct = require('./routes/countProduct');
const activity = require('./routes/activity');
const sales = require('./routes/sales');

const secretKey = process.env.SESSION_SECRET;
console.log("Session Secret:", secretKey); // ตรวจสอบค่าของ Session Secret

mongoose.Promise = global.Promise;

mongoose.connect('mongodb+srv://coco:62BkDlEjFthts7s3@cluster0.91fcjua.mongodb.net/?retryWrites=true&w=majority')
        .then(()=> console.log('connection database success!!'))
        .catch((err)=>console.error(err))

const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

// Set up session middleware
app.use(session({
    secret: secretKey, // Replace with a secure secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use('/products',products)
app.use('/category',category)
app.use('/type',type)
app.use('/employees',employees)
app.use('/owner',owner)
app.use('/import',importProduct)
app.use('/count',countProduct)
app.use('/activitylog',activity)
app.use('/sales',sales)

/* be for use router page */
app.use(express.static(path.join(__dirname,'public')));
app.use(router);
app.use(compression());
setupWebSocket(server);

const PORT = 3443;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
  
// Define global variables
global.list_predict_products = [];
global.list_predict_undata = [
    { NameProduct: '--', predicted_sales: '--' },
    { NameProduct: '--', predicted_sales: '--' },
    { NameProduct: '--', predicted_sales: '--' },
    { NameProduct: '--', predicted_sales: '--' },
    { NameProduct: '--', predicted_sales: '--' },
    { NameProduct: '--', predicted_sales: '--' },
    { NameProduct: '--', predicted_sales: '--' },
    { NameProduct: '--', predicted_sales: '--' },
    { NameProduct: '--', predicted_sales: '--' },
    { NameProduct: '--', predicted_sales: '--' },
    { NameProduct: '--', predicted_sales: '--' }
];
function broadcast(data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}
const fetchPredictions = async () => {
    try {
        const response = await axios.post('https://cocostore-ml-api-0254062f42fb.herokuapp.com/predict');
        global.list_predict_products = response.data;

        if (global.list_predict_products.length === 0) {
            global.list_predict_products = global.list_predict_undata;
        }

        console.log('Predictions fetched:', global.list_predict_products);

        // Add notification for machine learning predictions
        notificate_items.unshift({
            name: 'ML',
            img: '/img/logo_new.png',
            des: 'ผลการทำนายการสั่งซื้อล่วงหน้า',
            time: moment().tz('Asia/Bangkok').format('HH:mm')
        });

        // Broadcast updated notifications
        broadcast({ type: 'prediction', data: global.list_predict_products });
    } catch (error) {
        console.error('Error fetching predictions:', error);
    }
};

// Fetch predictions at startup
fetchPredictions();