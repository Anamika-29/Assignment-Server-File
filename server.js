let express = require("express");
let app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, OUT, PATCH, DELETE, HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});
const port = process.env.PORT||2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));

let {shops} = require("./data.js");
let {products} = require("./data.js");
let {purchases} = require("./data.js");
app.get("/test",function (req, res){
    res.send("Test Response");
})


app.get("/shops", function(req,res){
  
    let arr1 = shops;
  


    res.send(arr1);
})


app.post("/shops" , function(req,res){
    let body = req.body;
    let maxId = shops.reduce(
        (acc,curr)=>(curr.shopId>=acc ? curr.shopId : acc),0
);
let newId = maxId+1;
let newShop = {shopId:newId,...body};
shops.push(newShop);
res.send(newShop);

});

app.get("/products", function(req,res){
   
    let arr1 = products;

    res.send(arr1);
});

app.post("/products" , function(req,res){
    let body = req.body;
    let maxId = products.reduce(
        (acc,curr)=>(curr.productId>=acc ? curr.productId : acc),0
);
let newId = maxId+1;
let newProduct = {productId:newId,...body};
products.push(newProduct);
res.send(newProduct);

});



app.put("/products/:id" , function(req,res){
    let id = +req.params.id;
    let body = req.body;
    let index = products.findIndex(st=>st.productId===id);
    console.log(index);
    if(index>=0){
        products[index] = {productId: id,
        productName: products[index].productName,...body};
    
res.send(body);
}
else{
    res.status(404).send("No Product found");
}

});

app.get("/purchases", function(req,res){
    let shop = req.query.shop;
    if(shop){
         shop = +req.query.shop.substring(2,3);
    }
      let product = req.query.product;
    let sort = req.query.sort;
   
    let arr1 = purchases;
    if(shop){
        arr1 = arr1.filter(st=>st.shopId===shop); 
    }

    if(product)
  {
    product= product.split(',');
    let productArr = [];
      for(let i = 0; i<product.length;i++){
        productArr.push(parseInt(product[i].substring(2,3)));
      }
     arr1= arr1.filter(obj=>
        productArr.find(obj1=> obj1===obj.productid)
   );
    arr1= arr1;
  }

    
    if(sort==="QtyAsc"){
        arr1.sort((p1,p2)=>p1.quantity-p2.quantity);
    }
            if(sort==="QtyDesc"){
                arr1.sort((p1,p2)=>p2.quantity-p1.quantity);
            }
            if(sort==="ValueAsc"){
                arr1.sort((p1,p2)=>p1.quantity*p1.price-p2.quantity*p2.price);
            }
            if(sort==="ValueDesc"){
                arr1.sort((p1,p2)=>p2.quantity*p2.price-p1.quantity*p1.price);
            }

    res.send(arr1);
});

app.get("/purchases/shops/:id", function(req,res){
    let id = +req.params.id;
    let arr1 = purchases.filter(ele=>ele.shopId===id);

    res.send(arr1);
});

app.get("/product/:id", function(req,res){
    let id = +req.params.id;
    let arr1 = products.find(ele=>ele.productId===id);

    res.send(arr1);
});


app.get("/purchases/products/:id", function(req,res){
    let id = +req.params.id;
    let arr1 = purchases.filter(ele=>ele.productid===id);

    res.send(arr1);
});



app.post("/purchases" , function(req,res){
    let body = req.body;
    let maxId = purchases.reduce(
        (acc,curr)=>(curr.purchaseId>=acc ? curr.purchaseId : acc),0
);
let newId = maxId+1;
let newPurchase = {purchaseId:newId,...body};
purchases.push(newPurchase);
res.send(newPurchase);

});
app.get("/totalPurchase/shop/:id", function(req,res){
    let id = +req.params.id;
    let arr1 = purchases.filter(ele=>ele.shopId===id);
    let arr2 = arr1.reduce((acc,curr)=>acc.find(val=>val===curr.productid) ? acc : [...acc,curr.productid],[])

    let arr3 = arr2.map(ele=>{
        let arr = arr1.filter(ele2=>ele2.productid===ele);
        let json = {productId:ele,totalPurchase:arr.reduce((acc,curr)=>acc+curr.quantity,0)}
        return json;
    })

    res.send(arr3);
});


app.get("/totalPurchase/product/:id", function(req,res){
    let id = +req.params.id;
    let arr1 = purchases.filter(ele=>ele.productid===id);
    let arr2 = arr1.reduce((acc,curr)=>acc.find(val=>val===curr.shopId) ? acc : [...acc,curr.shopId],[])

    let arr3 = arr2.map(ele=>{
        let arr = arr1.filter(ele2=>ele2.shopId===ele);
        let json = {shopId:ele,totalPurchase:arr.reduce((acc,curr)=>acc+curr.quantity,0)}
        return json;
    })

    res.send(arr3);
});
