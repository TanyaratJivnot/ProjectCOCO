const express = require('express');
const axios = require('axios');
const moment = require('moment-timezone');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');
const Owner = require('../models/Owner.js');
const import_products = require('../models/import_Product.js');
const Employee = require('../models/Employee.js');
const Product = require('../models/Product.js');
const Count_product = require('../models/Counts_Product');
//const ActivityLogNew = require('../models/ActivityLog');
const SalesOrder = require('../models/Sales_Order');
const getWeatherData = require('../models/weater');
const fs = require('fs');
const { body, validationResult } = require('express-validator');

// ตั้งค่า multer ให้เก็บไฟล์ในหน่วยความจำ
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

let employees_items;

let notificate_items = [];
async function createNotifications(req) {
    try {
        const db = mongoose.connection.db;
        const activityLogCollection = db.collection('activitylog');

        // ดึงข้อมูลกิจกรรมการล็อกอินและล็อกเอาต์ของวันปัจจุบัน
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const loginActivities = await activityLogCollection.find({
            Activity_Type: { $in: ['login', 'log out'] },
            Activity_Timestamp: { $gte: today }
        }).toArray();

        console.log("Login Activities:", loginActivities);  // ตรวจสอบข้อมูลที่ดึงมา

        notificate_items.length = 0;

        for (const activity of loginActivities) {
            const employee = await Employee.findOne({ Employee_ID: activity.Employee_ID }).exec();
            if (employee) {
                // ตัดเอาเฉพาะเวลา (HH:mm) จาก Activity_Timestamp
                const timeString = new Date(activity.Activity_Timestamp)
                    .toISOString()
                    .substr(11, 5);

                // สร้างเงื่อนไขสำหรับ Activity_Type
                let description = '';
                if (activity.Activity_Type === 'login') {
                    description = 'เข้างาน';
                } else if (activity.Activity_Type === 'log out') {
                    description = 'ออกงาน';
                }

                notificate_items.unshift({
                    name: employee.Username,
                    img: 'data:' + employee.ImageTypeEmp + ';base64,' + employee.IMG,
                    imgType: employee.ImageTypeEmp,
                    des: description,
                    time: timeString
                });
            }
        }

        // ตรวจสอบและเพิ่มการแจ้งเตือน ML หากยังไม่มี
        if (!req.session.mlNotified) {
            notificate_items.unshift({
                name: 'ML',
                img: '/img/logo_new.png',
                des: 'ผลการทำนายการสั่งซื้อล่วงหน้า',
                time: new Date().toISOString().substr(11, 5)
            });
            req.session.mlNotified = true;
        }

        // เก็บรายการแจ้งเตือนใน session
        req.session.notificate_items = notificate_items;
    } catch (error) {
        console.error('Error creating notifications:', error);
    }
}


let notificate_count = notificate_items.length;


const categoryMappings = {
    'น้ำตาล': { Category_ID: 2, Type_ID: 1 },
    'ข้าวโพด': { Category_ID: 3, Type_ID: 1 },
    'วัตถุดิบ': { Category_ID: 7, Type_ID: 2 },
    'กล้วย': { Category_ID: 4, Type_ID: 1 },
    'ถั่ว': { Category_ID: 5, Type_ID: 1 },
    'ส้มโอ': { Category_ID: 6, Type_ID: 1 },
    'น้ำปั่น': { Category_ID: 8, Type_ID: 1 },
    'มะพร้าว': { Category_ID: 1, Type_ID: 1 }

};


router.get('/home', async (req, res) => {
    const startTime = Date.now();
    try {
        await createNotifications(req);
        const weather = await getWeatherData();
        res.render('home.ejs', {
            employees_items,
            notificate_items,
            notificate_count: notificate_items.length,
            formattedDate: null,
            selectedDate: req.query.date,
            temperature: weather.temperature,
            weatherIcon: weather.icon
        });
    } catch (error) {
        console.error('Error when rendering home:', error);
        res.status(500).send('Error loading the page');
    } finally {
        console.log(`Request for /home completed in ${Date.now() - startTime}ms`);
    }
});


router.get('/totalSale', async (req, res) => {
    try {
        let selectedDate = req.query.date;
        console.log("Selected home date:", selectedDate);

        const salesData = await SalesOrder.aggregate([
            { $match: { Order_Date: selectedDate } },
            {
                $lookup: {
                    from: "products",
                    localField: "Product_ID",
                    foreignField: "Product_ID",
                    as: "productDetails"
                }
            },
            { $unwind: "$productDetails" },
            {
                $project: {
                    totalPerProduct: { $multiply: ["$Total_Amount", "$productDetails.PricePrduct"] }
                }
            },
            {
                $group: {
                    _id: null,
                    salesTotalAmount: { $sum: "$totalPerProduct" }
                }
            }
        ]).exec();

        const totalSales = salesData.length > 0 ? salesData[0].salesTotalAmount : 0;
        console.log("Sales Total Amount:", totalSales);
        res.send(salesData);

    } catch (error) {
        console.error('Error when rendering home:', error);
        res.status(500).send('Error loading the page');
    }
});

router.get('/sales-data', async (req, res) => {
    try {
        let selectedDate = req.query.date;
        console.log(selectedDate);
        const salesData = await SalesOrder.aggregate([
            { $match: { Order_Date: selectedDate } }, 
            {
                $lookup: {
                    from: 'products',
                    localField: 'Product_ID', 
                    foreignField: 'Product_ID', 
                    as: 'productDetails'
                }
            },
            {
                $unwind: '$productDetails'
            },
            {
                $project: {
                    _id: 0,
                    NameProduct: '$productDetails.NameProduct', // Assuming 'NameProduct' is the field for product name
                    Total_Amount: 1
                }
            }
        ]);
        res.send(salesData);
        console.log("salesData:", salesData);
    } catch (error) {
        console.error('Error fetching sales data:', error);
        res.status(500).send('Failed to fetch data');
    }
});
router.get('/sales-today', async (req, res) => {
    // ตั้งค่าวันที่ใหม่โดยไม่มีเวลาและแปลงเป็นรูปแบบ YYYY-MM-DD
    const now = new Date();
    const selectedDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const formattedDate = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD

    console.log("Formatted selectedDate :", formattedDate); // Outputs date in YYYY-MM-DD format

    try {
        const salesData = await SalesOrder.aggregate([
            { $match: { Order_Date: formattedDate } },
            {
                $lookup: {
                    from: "products",
                    localField: "Product_ID",
                    foreignField: "Product_ID",
                    as: "productDetails"
                }
            },
            { $unwind: "$productDetails" },
            {
                $project: {
                    totalPerProduct: { $multiply: ["$Total_Amount", "$productDetails.PricePrduct"] }
                }
            },
            {
                $group: {
                    _id: null,
                    salesTotalAmount: { $sum: "$totalPerProduct" }
                }
            }
        ]).exec();
        const totalSales = salesData.length > 0 ? salesData[0].salesTotalAmount : 0;
        console.log("Sales to day Amount:", totalSales);
        res.send(salesData);
    } catch (error) {
        console.error('Error fetching sales data:', error);
        res.status(500).send('Failed to fetch data');
    }
});
router.get('/productPopular', async (req, res) => {
    const { date } = req.query;
    const selectedDate = new Date(date);
    const formattedDate = selectedDate.toISOString().split('T')[0]; 

    console.log("Formatted selectedDate:", formattedDate); 

    try {
        const productPopularData = await SalesOrder.aggregate([
            {
                $match: { Order_Date: formattedDate }
            },
            {
                $group: {
                    _id: '$Product_ID', 
                    totalSold: { $sum: '$Total_Amount' } 
                }
            },
            {
                $sort: { totalSold: -1 } 
            },
            {
                $lookup: {
                    from: 'products', 
                    localField: '_id',
                    foreignField: 'Product_ID',
                    as: 'productDetails'
                }
            },
            {
                $unwind: {
                    path: '$productDetails',
                    preserveNullAndEmptyArrays: true 
                }
            },
            {
                $project: {
                    _id: 0,
                    NameProduct: '$productDetails.NameProduct', // Select the product name
                    totalSold: 1
                }
            },
            {
                $limit: 1 
            }
        ]);

        console.log("Product popular data:", productPopularData); // ตรวจสอบข้อมูลที่ได้รับ

        if (!productPopularData.length || !productPopularData[0].NameProduct) {
            res.send([{ NameProduct: '--', totalSold: '--' }]);
        } else {
            res.send(productPopularData);
        }
    } catch (error) {
        console.error('Error fetching popular product data:', error);
        res.status(500).send('Failed to fetch data');
    }
});
router.get('/employeeSales', async (req, res) => {
    try {
        let formattedDate = req.query.date;
        console.log("employeeSales selectedDate :", formattedDate);
        const salesData = await SalesOrder.aggregate([
            { $match: { Order_Date: formattedDate } },
            {
                $lookup: {
                    from: 'products',
                    localField: 'Product_ID',
                    foreignField: 'Product_ID',
                    as: 'productDetails'
                }
            },
            { $unwind: '$productDetails' },
            {
                $lookup: {
                    from: 'employees',
                    localField: 'Employee_ID',
                    foreignField: 'Employee_ID',
                    as: 'employeeDetails'
                }
            },
            { $unwind: '$employeeDetails' },
            {
                $group: {
                    _id: '$Employee_ID',
                    name: { $first: '$employeeDetails.Username' },
                    quantity: { $sum: '$Total_Amount' },
                    totalSales: { $sum: { $multiply: ['$Total_Amount', '$productDetails.PricePrduct'] } }
                }
            }
        ]);
        console.log("employeeSalesData:", salesData);
        res.send(salesData);
    } catch (error) {
        console.error('Error fetching employeeSales data:', error);
        res.status(500).send('Failed to fetch data');
    }
}); 
router.get('/remainingforDay', async (req, res) => {
    const { date } = req.query;  // รับวันที่จาก query string
    const selectedDate = new Date(date);
    const formattedDate = selectedDate.toISOString().split('T')[0];
    console.log("Remaining selectedDate :", formattedDate);
    try {
        const remainingData = await Count_product.aggregate([
            {
                $match: { CountDate: formattedDate }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'Product_ID',
                    foreignField: 'Product_ID',
                    as: 'productDetails'
                }
            },
            {
                $unwind: '$productDetails'
            },
            {
                $project: {
                    _id: 0,
                    productName: '$productDetails.NameProduct',
                    remainingQuantity: '$remaining',
                    countSell: '$Count_sell',
                    expireDate: '$expire'
                }
            }
        ]);
        console.log("Remaining data:", remainingData);
        res.send(remainingData);

    } catch (error) {
        console.error('Error fetching remaining products data:', error);
        res.status(500).send('Failed to fetch remaining products data');
    }
});

router.get('/productPopular5', async (req, res) => {
    try {
        let formattedDate = req.query.date;
        console.log("productPopular5 selectedDate :", formattedDate);
        const productPopularData = await SalesOrder.aggregate([
            {
                $match: {
                    Order_Date: formattedDate,
                    Total_Amount: { $gt: 1 } 
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'Product_ID',
                    foreignField: 'Product_ID',
                    as: 'productDetails'
                }
            },
            {
                $unwind: '$productDetails'
            },
            {
                $group: {
                    _id: '$Product_ID',
                    productName: { $first: '$productDetails.NameProduct' },
                    totalQuantitySold: { $sum: '$Total_Amount' }
                }
            },
            {
                $project: {
                    _id: 0,
                    productName: 1,
                    totalQuantitySold: 1
                }
            },
            {
                $sort: { totalQuantitySold: -1 }
            },
            {
                $limit: 5
            }
        ]);

        console.log("Top 5 popular products data:", productPopularData);
        res.send(productPopularData);

    } catch (error) {
        console.error('Error fetching popular products data:', error);
        res.status(500).send('Failed to fetch popular products data');
    }
});






/* product */
router.get('/stock', async (req, res) => {
    const searchTerm = req.query.searchTerm;
    const sortQuery = req.query.sort; // 'asc' or 'desc'
    const sortOrder = sortQuery === 'asc' ? -1 : 1; 
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; 

    console.log(`Search Term: ${searchTerm}`); 

    try {
        await createNotifications(req);
        
        let query = {
            NameProduct: { $ne: 'มะพร้าวปั่น' } 
        };
        if (searchTerm && searchTerm.trim()) {
            query["$and"] = [ 
                { NameProduct: { $regex: new RegExp(searchTerm, 'i') } }
               
            ];
            console.log("Running query:", JSON.stringify(query)); 
        }

        let list_products = await Product.find(query)
            .skip((page - 1) * limit)
            .limit(limit);

        const counts = await Count_product.aggregate([
            { $sort: { CountDate: -1 } }, 
            { $group: { _id: "$Product_ID", remaining: { $first: "$remaining" } } }, 
            { $sort: { remaining: sortOrder } } 
        ]);

        
        const countsMap = new Map(counts.map(count => [count._id.toString(), count.remaining]));

       
        let mergedList = list_products.map(product => {
            return {
                ...product.toObject(),
                remaining: countsMap.get(product.Product_ID.toString()) || 0 // Default to 0 if no count found
            };
        });

       
        mergedList = mergedList.sort((a, b) => sortOrder * (a.remaining - b.remaining));

        
        console.log(`Products Count Being Rendered: ${mergedList.length}`);

        
        const totalProducts = await Product.countDocuments(query);

        
        res.render('stockPage.ejs', {
            list_products: mergedList,
            list_predict_products: global.list_predict_products.length > 0 ? global.list_predict_products : global.list_predict_undata,
            formattedDate: null,
            employees_items,
            notificate_items,
            notificate_count: notificate_items.length,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit)
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching products');
    }
});
const product_exp = {
    'น้ำมะพร้าวแก้ว': 4,
    'มะพร้าวลูก': 4,
    'มะพร้าวขวด': 4,
    'พุดดิ้งมะพร้าว': 4,
    'เนื้อมะพร้าวครึ่งโล': 4,
    'น้ำนมข้าวโพด': 4,
    'ป๊อปคอร์นขนาดใหญ่': 4,
    'ป๊อปคอร์นขนาดกลาง': 4,
    'ป๊อปคอร์นขนาดเล็ก': 4
};


router.get('/Updatestock', (req, res) => {
    res.render('insert_product.ejs', { employees_items, notificate_items, notificate_count, formattedDate: null });
})
router.post('/addProduct', upload.single('productImage'), async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send('Please upload a file.');
    }
    try {
        // Convert file to Base64
        const base64String = file.buffer.toString('base64');

        const categoryName = req.body.categoryName;
        const { Category_ID, Type_ID } = categoryMappings[categoryName] || { Category_ID: 1, Type_ID: 1 };

        const lastProduct = await Product.findOne().sort('-Product_ID').exec();
        const newProductId = lastProduct && lastProduct.Product_ID ? parseInt(lastProduct.Product_ID) + 1 : 1;
        console.log(`New Product_ID: ${newProductId}`);

        const newProduct = new Product({
            Product_ID: newProductId,
            Category_ID: Category_ID,
            Type_ID: Type_ID,
            Barcode: req.body.Barcode,
            NameProduct: req.body.NameProduct,
            PricePrduct: req.body.PricePrduct,
            ImageProduct: base64String,
            ImageTypeProduct: file.mimetype,
            DetailProduct: "",
            Day_expire: req.body.Day_expire, 
        });
        console.log(newProduct);
        await newProduct.save();
        const countDate = moment().tz('Asia/Bangkok').format('YYYY-MM-DD');
        // Saving Initial Count Information
        const newCountProduct = new Count_product({
            CountsProduct_ID: newProductId,
            Employee_ID: null,
            Product_ID: newProduct.Product_ID,
            CountDate: countDate,
            To_sell: 0,
            Count_sell: 0,
            expire: 0, 
            remaining: req.body.remaining,
        });
        await newCountProduct.save();

        res.redirect('/stock'); 
    } catch (err) {
        console.error(err);
        res.status(500).send('Error processing request');
    }
});

router.get('/Import_Product', (req, res) => {
    res.render('import_product.ejs', { employees_items, notificate_items, notificate_count, formattedDate: null });
})

async function fetchProductNamesAndIDs() {
    try {
        const products = await Product.find({}, 'NameProduct Product_ID').exec();
        const productMappings = {};
        products.forEach(product => {
            productMappings[product.NameProduct] = { Product_ID: product.Product_ID };
        });
        return productMappings;
    } catch (error) {
        console.error('Error fetching products:', error);
        return {};
    }
}

router.get('/productMappings', async (req, res) => {
    try {
        const products = await Product.find({}, 'NameProduct Product_ID').exec();
        const productMappings = {};
        products.forEach(product => {
            productMappings[product.NameProduct] = { Product_ID: product.Product_ID };
        });
        res.json(productMappings);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch product mappings' });
    }
});

router.post('/import_product', async (req, res) => {
    try {
        const productNames = [];
        const countSells = [];

        for (let i = 1; i <= 9; i++) {
            if (req.body[`productName${i}`] && req.body[`Count_sell${i}`]) {
                productNames.push(req.body[`productName${i}`]);
                countSells.push(req.body[`Count_sell${i}`]);
            }
        }

        const productMappings = await fetchProductNamesAndIDs();

        const newImportProducts = [];

        for (let i = 0; i < productNames.length; i++) {
            const productName = productNames[i];
            const countSell = countSells[i];

            const product = productMappings[productName];
            if (!product) {
                return res.status(400).json({ error: `Product not found: ${productName}` });
            }

            const importDate = moment().tz('Asia/Bangkok').format('YYYY-MM-DD');
            const importTime = moment().tz('Asia/Bangkok').format('HH:mm');

            const expirationDate = product.Day_expire
                ? moment().tz('Asia/Bangkok').add(product.Day_expire, 'days').format('YYYY-MM-DD')
                : moment().tz('Asia/Bangkok').add(5, 'minutes').format('YYYY-MM-DD');
            const expirationTime = moment().tz('Asia/Bangkok').format('HH:mm');

            const newImportProduct = new import_products({
                Employee_ID: 1, // Static Employee_ID for example, replace with actual logic
                Product_ID: product.Product_ID,
                ImportDate: importDate,
                ImportTime: importTime,
                Count: countSell,
                ExpirationDate: expirationDate,
                ExpirationTime: expirationTime
            });

            newImportProducts.push(newImportProduct);
        }

        console.log('Products to be inserted:', newImportProducts);

        await import_products.insertMany(newImportProducts);

        res.redirect('/stock');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while importing the products' });
    }
});
router.delete('/staff/delete/:id', (req, res) => {
    console.log("Delete route hit with id:", req.params.id);
    Product.findByIdAndDelete(req.params.id)
        .then(() => {
            res.json({ success: true });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ success: false, message: 'Error deleting product' });
        });
});





/* staff */
router.get('/staff', async (req, res) => {
    const searchTerm = req.query.searchTerm;
    console.log(`Search Term: ${searchTerm}`);

    try {
        await createNotifications(req);

        let employees_items_find = await Employee.find({});

        
        if (searchTerm && searchTerm.trim()) {
            const searchQuery = {
                $or: [
                    { Name: { $regex: new RegExp(searchTerm, 'i') } },
                    { Username: { $regex: new RegExp(searchTerm, 'i') } }
                ]
            };
            console.log("Running query:", JSON.stringify(searchQuery)); // Debug: Log the query as a string
            employees_items_find = await Employee.find(searchQuery);
        }

       
        res.render('staff.ejs', {
            employees_items_find: employees_items_find,
            employees_items,
            notificate_items,
            notificate_count: notificate_items.length,
            formattedDate: null
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching employees');
    }
});

/* del_staff */
router.delete('/staff/delete/:id', (req, res) => {
    console.log("Search route hit with term:", req.query.term);
    Employee.findByIdAndDelete(req.params.id)
        .then(() => {
            res.json({ success: true });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ success: false, message: 'Error deleting employee' });
        });
});

/* insert_staff */
router.get('/Updatestaff', (req, res) => {
    res.render('insert_employee.ejs', { employees_items, notificate_items, notificate_count, formattedDate: null });
})
router.post('/addEmployee', upload.single('IMG'), async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send('Please upload a file.');
    }
    try {
        // แปลงไฟล์เป็น Base64
        const base64String = file.buffer.toString('base64');

        const lastEmployee = await Employee.findOne().sort('-Employee_ID').exec();
        const newEmployeeId = lastEmployee && lastEmployee.Employee_ID ? parseInt(lastEmployee.Employee_ID) + 1 : 1;
        console.log(`New Employee_ID: ${newEmployeeId}`);

        const newEmployee = new Employee({
            Employee_ID: newEmployeeId,
            Name: req.body.Name,
            Username: req.body.Username,
            Password: req.body.Password,
            Address_Staff: req.body.Address_Staff,
            Tel_Staff: req.body.Tel_Staff,
            ID_Card: req.body.ID_Card,
            IMG: base64String,
            ImageTypeEmp: file.mimetype
        });
        const savedEmployee = await newEmployee.save().catch(err => console.error(err));
        console.log(savedEmployee);
        res.redirect('/staff');
    } catch (err) {
        console.error(err);
        if (err.code === 11000) {
            res.status(400).send('Duplicate Employee_ID. Please try again.');
        } else {
            res.status(500).send('Error processing request');
        }
    }
});


router.get('/nav', (req, res) => {
    res.render('navbar.ejs', { notificate_items, notificate_count: notificate_items.length });
});

/* login */
router.get('/', (req, res) => {
    res.render('login.ejs', { error: {} });
})
router.post('/', async (req, res, next) => {
    const startTime = Date.now();
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.render('login.ejs', { error: { msg: 'Please enter both username and password' } });
    }

    try {
        const user = await Owner.findOne({ Username: username });

        if (!user) {
            return res.render('login.ejs', { error: { msg: 'Invalid credentials' } });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.render('login.ejs', { error: { msg: 'Invalid credentials' } });
        }

        res.redirect('/home');
    } catch (err) {
        next(err);
    } finally {
        console.log(`Login request completed in ${Date.now() - startTime}ms`);
    }
});



module.exports = router

