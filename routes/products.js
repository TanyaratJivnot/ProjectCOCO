const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product.js');

router.get('/', (req, res ,next)=>{
    Product.find((err, products) => {
        if (err) return next(err);
        res.json(products);
    })
})
/* const products = [
    {
        "Product_ID": 1,
        "Category_ID": 1,
        "Type_ID": 1,
        "Barcode":'7461451038049',
        "NameProduct":'น้ำมะพร้าวแก้ว',
        "PricePrduct":35,
        "DetailProduct":''
    },
    {
        "Product_ID": 2,
        "Category_ID": 1,
        "Type_ID": 1,
        "Barcode":'3246953769580',
        "NameProduct":'มะพร้าวลูก',
        "PricePrduct":35,
        "DetailProduct":''
    },
    {
        "Product_ID": 3,
        "Category_ID": 1,
        "Type_ID": 1,
        "Barcode":'1474408316120',
        "NameProduct":'มะพร้าวขวด',
        "PricePrduct":35,
        "DetailProduct":''
    },
    {
        "Product_ID": 4,
        "Category_ID": 1,
        "Type_ID": 1,
        "Barcode":'6052941328644',
        "NameProduct":'พุดดิ้งมะพร้าว',
        "PricePrduct":35,
        "DetailProduct":''
    },
    {
        "Product_ID": 5,
        "Category_ID": 1,
        "Type_ID": 1,
        "Barcode":'1104785877755',
        "NameProduct":'วุ้นมะพร้าว',
        "PricePrduct":35,
        "DetailProduct":''
    },
    {
        "Product_ID": 6,
        "Category_ID": 1,
        "Type_ID": 1,
        "Barcode":'0892708400476',
        "NameProduct":'เนื้อมะพร้าวครึ่งโล',
        "PricePrduct":60,
        "DetailProduct":''
    },
    {
        "Product_ID": 7,
        "Category_ID": 1,
        "Type_ID": 1,
        "Barcode":'3613295276720',
        "NameProduct":'ไอติมมะพร้าว',
        "PricePrduct":35,
        "DetailProduct":''
    },
    {
        "Product_ID": 8,
        "Category_ID": 2,
        "Type_ID": 1,
        "Barcode":'6340977908150',
        "NameProduct":'น้ำตาลมะพร้าว',
        "PricePrduct":55,
        "DetailProduct":''
    },
    {
        "Product_ID": 9,
        "Category_ID": 2,
        "Type_ID": 1,
        "Barcode":'4536372785823',
        "NameProduct":'น้ำตาลโตนด',
        "PricePrduct":60,
        "DetailProduct":''
    },
    {
        "Product_ID": 10,
        "Category_ID": 3,
        "Type_ID": 1,
        "Barcode":'7982494190809',
        "NameProduct":'น้ำนมข้าวโพด',
        "PricePrduct":30,
        "DetailProduct":''
    },
    {
        "Product_ID": 11,
        "Category_ID": 4,
        "Type_ID": 1,
        "Barcode":'1932927274891',
        "NameProduct":'กล้วยอบ',
        "PricePrduct":35,
        "DetailProduct":''
    },
    {
        "Product_ID": 12,
        "Category_ID": 5,
        "Type_ID": 1,
        "Barcode":'8124791435982',
        "NameProduct":'ถั่วเหลืองอบเกลือ',
        "PricePrduct":25,
        "DetailProduct":''
    },
    {
        "Product_ID": 13,
        "Category_ID": 5,
        "Type_ID": 1,
        "Barcode":'7461451038049',
        "NameProduct":'ถั่วต้มลายเสือ',
        "PricePrduct":25,
        "DetailProduct":''
    },
    {
        "Product_ID": 14,
        "Category_ID": 3,
        "Type_ID": 1,
        "Barcode":'5936140646372',
        "NameProduct":'ป๊อปคอร์นขนาดใหญ่',
        "PricePrduct":35,
        "DetailProduct":''
    },
    {
        "Product_ID": 15,
        "Category_ID": 3,
        "Type_ID": 1,
        "Barcode":'5853061733246',
        "NameProduct":'ป๊อปคอร์นขนาดกลาง',
        "PricePrduct":25,
        "DetailProduct":''
    },
    {
        "Product_ID": 16,
        "Category_ID": 3,
        "Type_ID": 1,
        "Barcode":'0795093581347',
        "NameProduct":'ป๊อปคอร์นขนาดเล็ก',
        "PricePrduct":20,
        "DetailProduct":''
    },
    {
        "Product_ID": 17,
        "Category_ID": 6,
        "Type_ID": 1,
        "Barcode":'2815957377998',
        "NameProduct":'ส้มโอ',
        "PricePrduct":150,
        "DetailProduct":''
    },
    {
        "Product_ID": 18,
        "Category_ID": 6,
        "Type_ID": 1,
        "Barcode":'0408749283800',
        "NameProduct":'ส้มโอ',
        "PricePrduct":140,
        "DetailProduct":''
    },
    {
        "Product_ID": 19,
        "Category_ID": 6,
        "Type_ID": 1,
        "Barcode":'7121181104036',
        "NameProduct":'ส้มโอ',
        "PricePrduct":130,
        "DetailProduct":''
    },
    {
        "Product_ID": 20,
        "Category_ID": 6,
        "Type_ID": 1,
        "Barcode":'6761430703172',
        "NameProduct":'ส้มโอ',
        "PricePrduct":120,
        "DetailProduct":''
    },
    {
        "Product_ID": 21,
        "Category_ID": 6,
        "Type_ID": 1,
        "Barcode":'2103912346017',
        "NameProduct":'ส้มโอ',
        "PricePrduct":100,
        "DetailProduct":''
    },
    {
        "Product_ID": 22,
        "Category_ID": 6,
        "Type_ID": 1,
        "Barcode":'6377672902590',
        "NameProduct":'ส้มโอแบบแพ็คขนาดใหญ่',
        "PricePrduct":100,
        "DetailProduct":''
    },
    {
        "Product_ID": 23,
        "Category_ID": 6,
        "Type_ID": 1,
        "Barcode":'0685181962590',
        "NameProduct":'ส้มโอแบบแพ็คขนาดกลาง',
        "PricePrduct":70,
        "DetailProduct":''
    },
    {
        "Product_ID": 24,
        "Category_ID": 6,
        "Type_ID": 1,
        "Barcode":'5752368462843',
        "NameProduct":'ส้มโอแบบแพ็คขนาดเล็ก',
        "PricePrduct":60,
        "DetailProduct":''
    },
    {
        "Product_ID": 25,
        "Category_ID": 8,
        "Type_ID": 1,
        "Barcode":'4256728209463',
        "NameProduct":'มะพร้าวปั่น',
        "PricePrduct":39,
        "DetailProduct":''
    },
    {
        "Product_ID": 26,
        "Category_ID": 8,
        "Type_ID": 2,
        "Barcode":'',
        "NameProduct":'นมผสม',
        "PricePrduct":56,
        "DetailProduct":'นมข้ม1กป(388g)+นมสด1กป(405g)'
    },
    {
        "Product_ID": 27,
        "Category_ID": 8,
        "Type_ID": 2,
        "Barcode":'',
        "NameProduct":'น้ำเชื่อม',
        "PricePrduct":40,
        "DetailProduct":'น้ำเชื่อม800ml'
    },
    {
        "Product_ID": 28,
        "Category_ID": 8,
        "Type_ID": 2,
        "Barcode":'',
        "NameProduct":'แก้ว',
        "PricePrduct":70,
        "DetailProduct":''
    },
    {
        "Product_ID": 29,
        "Category_ID": 7,
        "Type_ID": 2,
        "Barcode":'',
        "NameProduct":'หลอดปลายแหลม',
        "PricePrduct":21,
        "DetailProduct":''
    },
    {
        "Product_ID": 30,
        "Category_ID": 7,
        "Type_ID": 2,
        "Barcode":'',
        "NameProduct":'หลอดธรรมดา',
        "PricePrduct":20,
        "DetailProduct":''
    },
    {
        "Product_ID": 31,
        "Category_ID": 8,
        "Type_ID": 2,
        "Barcode":'',
        "NameProduct":'ถุงใส่แก้วน้ําปั่น เดี่ยว มีหูหิ้ว',
        "PricePrduct":35,
        "DetailProduct":''
    },

]; */
/* async function importProducts() {
    try {
        for (const productData of products) {
            const { Product_ID, ...rest } = productData;
            await Product.updateOne({ Product_ID }, { $set: rest }, { upsert: true });
            console.log(`Product ${productData.NameProduct} added or updated successfully!`);
        }
    } catch (error) {
        console.log('Error adding data', error);
    }
}
importProducts()  */


module.exports = router;