const Employee = require("./employee");
const Order = require("./order");
const StoreTiming = require("./storeTiming");
const StoreProduct = require("./storeProduct");
const Product = require('./product');
const Brand = require('./brand');
const Category = require('./category');
const Customer = require('./customer');
const OrderItem = require('./orderItem');
const Store = require("./store");
const DeliveryAgent = require("./deliveryAgent");

function associate(){
    Brand.hasMany(Product);
    Product.belongsTo(Brand);
    Category.hasMany(Product);
    Product.belongsTo(Category);
    Customer.hasMany(Order);
    Order.belongsTo(Customer);
    Order.hasMany(OrderItem);
    OrderItem.belongsTo(Order);
    Product.hasMany(OrderItem);
    OrderItem.belongsTo(Product);
    Product.hasMany(StoreProduct);
    StoreProduct.belongsTo(Product);
    Store.hasMany(Employee);
    Employee.belongsTo(Store);
    Store.hasMany(Order);
    Order.belongsTo(Store);
    Store.hasMany(StoreTiming);
    StoreTiming.belongsTo(Store);
    Store.hasMany(StoreProduct);
    StoreProduct.belongsTo(Store);
    DeliveryAgent.hasMany(Order);
    Order.belongsTo(DeliveryAgent);
}
module.exports = associate;
