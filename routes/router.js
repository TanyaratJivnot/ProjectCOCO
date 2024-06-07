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



const id_product = {
    'น้ำมะพร้าวแก้ว': { Product_ID: 1 },
    'มะพร้าวลูก': { Product_ID: 2 },
    'มะพร้าวขวด': { Product_ID: 3 },
    'พุดดิ้งมะพร้าว': { Product_ID: 4 },
    'เนื้อมะพร้าวครึ่งโล': { Product_ID: 6 },
    'น้ำนมข้าวโพด': { Product_ID: 10 },
    'ป๊อปคอร์นขนาดใหญ่': { Product_ID: 14 },
    'ป๊อปคอร์นขนาดกลาง': { Product_ID: 15 },
    'ป๊อปคอร์นขนาดเล็ก': { Product_ID: 16 }
};
/* const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/img'))  // ตำแหน่งเก็บไฟล์
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)  // ตั้งชื่อไฟล์ใหม่เพื่อหลีกเลี่ยงชื่อซ้ำ
    }
}); */
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

        // Aggregate sales data for the selected date
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
        // Render the home page
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
            { $match: { Order_Date: selectedDate } }, // Match the orders by selected date
            {
                $lookup: {
                    from: 'products',
                    localField: 'Product_ID', // Field in SalesOrder
                    foreignField: 'Product_ID', // Field in Product
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
    const formattedDate = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD

    console.log("Formatted selectedDate:", formattedDate); // Outputs date in YYYY-MM-DD format

    try {
        const productPopularData = await SalesOrder.aggregate([
            {
                $match: { Order_Date: formattedDate } // Ensure dates are compared correctly
            },
            {
                $group: {
                    _id: '$Product_ID', // Group by Product ID
                    totalSold: { $sum: '$Total_Amount' } // Sum total amount for each product
                }
            },
            {
                $sort: { totalSold: -1 } // Sort by totalSold in descending order
            },
            {
                $lookup: {
                    from: 'products', // Assuming your products collection is named 'products'
                    localField: '_id',
                    foreignField: 'Product_ID',
                    as: 'productDetails'
                }
            },
            {
                $unwind: {
                    path: '$productDetails',
                    preserveNullAndEmptyArrays: true // Preserve documents even if 'productDetails' is missing
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
                $limit: 1 // Limit to the top 1 most sold product
            }
        ]);

        console.log("Product popular data:", productPopularData); // ตรวจสอบข้อมูลที่ได้รับ

        // Check if data is empty or null, and handle accordingly
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
    /*  const now = new Date();
     const selectedDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
     //const formattedDate = selectedDate.toISOString().split('T')[0];
     const formattedDate = "2023-02-08"; //test
     console.log("employeeSales selectedDate :", formattedDate); */
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
                    Total_Amount: { $gt: 1 } // Only include items with a quantity greater than 1
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
    const sortOrder = sortQuery === 'asc' ? -1 : 1; // 1 for ascending, -1 for descending
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // Number of products per page

    console.log(`Search Term: ${searchTerm}`); // Debug: Log the search term

    try {
        await createNotifications(req);
        // Build a query object based on the search term and excluding 'น้ำมะพร้าวปั่น'
        let query = {
            NameProduct: { $ne: 'มะพร้าวปั่น' } // Exclude 'น้ำมะพร้าวปั่น'
        };
        if (searchTerm && searchTerm.trim()) {
            query["$and"] = [ // Use $and to combine conditions
                { NameProduct: { $regex: new RegExp(searchTerm, 'i') } }
                // Add more fields if you want to search by other criteria
            ];
            console.log("Running query:", JSON.stringify(query)); // Debug: Log the query
        }

        // Fetch products based on the query
        let list_products = await Product.find(query)
            .skip((page - 1) * limit)
            .limit(limit);

        // Fetch the latest count for each product with sorting
        const counts = await Count_product.aggregate([
            { $sort: { CountDate: -1 } }, // Sort by CountDate descending
            { $group: { _id: "$Product_ID", remaining: { $first: "$remaining" } } }, // Group by Product_ID and take the first (latest) remaining count
            { $sort: { remaining: sortOrder } } // Sort by remaining count based on sortOrder
        ]);

        // Convert counts to a map for easy lookup
        const countsMap = new Map(counts.map(count => [count._id.toString(), count.remaining]));

        // Merge product and count data with sorting
        let mergedList = list_products.map(product => {
            return {
                ...product.toObject(),
                remaining: countsMap.get(product.Product_ID.toString()) || 0 // Default to 0 if no count found
            };
        });

        // Sort the merged list based on remaining count
        mergedList = mergedList.sort((a, b) => sortOrder * (a.remaining - b.remaining));

        // Log the count of products being sent to the template
        console.log(`Products Count Being Rendered: ${mergedList.length}`);

        // Fetch the total count of products for pagination
        const totalProducts = await Product.countDocuments(query);

        // Render the page with the merged list
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

/* API สินค้าหมดอายุ */
router.get('/api-flutter-expril', async (req, res) => {
    try {
        // Fetch all imported products
        const importedProducts = await import_products.find({});

        const expiredProducts = importedProducts.map(product => {
            const importDate = moment(product.ImportDate, 'YYYY-MM-DD');
            const expirationDays = product_exp[product.Product_ID] || 4; // Default to 4 days if not found
            const importDateExpire = importDate.clone().add(expirationDays, 'days').format('YYYY-MM-DD');

            return {
                Product_ID: product.Product_ID,
                ImportDate: product.ImportDate,
                ImportDateExpire: importDateExpire,
                Count: product.Count
            };
        }).filter(product => {
            const currentDate = moment().format('YYYY-MM-DD');
            return product.ImportDateExpire === currentDate;
        });

        res.json(expiredProducts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.get('/Updatestock', (req, res) => {
    res.render('insert_product.ejs', { employees_items, notificate_items, notificate_count, formattedDate: null });
})
router.post('/addProduct', upload.single('productImage'), async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send('Please upload a file.');
    }
    try {
        // แปลงไฟล์เป็น Base64
        const base64String = file.buffer.toString('base64');

        const categoryName = req.body.categoryName;
        const { Category_ID, Type_ID } = categoryMappings[categoryName] || { Category_ID: 1, Type_ID: 1 };

        // Generating a New Product_ID
        const lastProduct = await Product.findOne().sort('-Product_ID').exec();
        const newProductId = lastProduct && lastProduct.Product_ID ? parseInt(lastProduct.Product_ID) + 1 : 1;
        console.log(`New Product_ID: ${newProductId}`);

        // Saving Product Information
        const newProduct = new Product({
            Product_ID: newProductId,
            Category_ID: Category_ID,
            Type_ID: Type_ID,
            Barcode: req.body.Barcode,
            NameProduct: req.body.NameProduct,
            PricePrduct: req.body.PricePrduct,
            ImageProduct: base64String,
            ImageTypeProduct: file.mimetype,
            DetailProduct: ""
        });
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
            expire: '0',
            remaining: req.body.remaining
        });
        await newCountProduct.save();

        // Redirect or send a response
        res.redirect('/stock'); // Redirect to a success page or another appropriate route
    } catch (err) {
        console.error(err);
        res.status(500).send('Error processing request');
    }
});

router.get('/Import_Product', (req, res) => {
    res.render('import_product.ejs', { employees_items, notificate_items, notificate_count, formattedDate: null });
})

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

        // ใช้ moment-timezone เพื่อกำหนดวันที่ในรูปแบบ 'YYYY-MM-DD'
        const importDate = moment().tz('Asia/Bangkok').format('YYYY-MM-DD');

        const newImportProducts = [];

        for (let i = 0; i < productNames.length; i++) {
            const productName = productNames[i];
            const countSell = countSells[i];

            // หา Product_ID จากชื่อสินค้า
            const product = id_product[productName];
            if (!product) {
                return res.status(400).json({ error: `Product not found: ${productName}` });
            }

            // สร้างรายการสินค้านำเข้าใหม่
            const newImportProduct = new import_products({
                Employee_ID: 1, // กำหนดค่า Employee_ID เป็น 1
                Product_ID: product.Product_ID,
                ImportDate: importDate,
                Count: countSell
            });

            newImportProducts.push(newImportProduct);
        }

        // พิมพ์ข้อมูลเพื่อการตรวจสอบ
        console.log('Products to be inserted:', newImportProducts);

        // บันทึกลงฐานข้อมูลพร้อมกัน
        await import_products.insertMany(newImportProducts);

        // Redirect ไปที่ /stock หลังจากบันทึกเสร็จ
        res.redirect('/stock');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while importing the products' });
    }
});






/* staff */
router.get('/staff', async (req, res) => {
    const searchTerm = req.query.searchTerm;
    console.log(`Search Term: ${searchTerm}`); // Debug: Log the search term

    try {
        await createNotifications(req);
        // Fetch all employees by default
        let employees_items_find = await Employee.find({});

        // If there's a search term and it's not empty, filter the employees
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

        // Log the count of employees being sent to the template
        console.log(`Employees Count Being Rendered: ${employees_items_find.length}`);

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

