var express = require('express');
var router = express.Router();
const v1routes = require('./v1');

router.use('/v1/employees', v1routes.employeeRoute);
router.use('/v1/stores', v1routes.storeRoute);
router.use('/v1/products', v1routes.productRoute);
router.use('/v1/brands', v1routes.brandRoute);
router.use('/v1/categories', v1routes.categoryRoute);
router.use('/v1/customers', v1routes.customerRoute);
router.use('/v1/orderitem', v1routes.orderItemRoute);
router.use('/v1/orders', v1routes.orderRoute);

module.exports = router;