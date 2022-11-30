const mongoose = require("mongoose");
const Order = require("../models/orders");
const Product = require("../models/products");


exports.orders_get_all = (req, res, next) => {
    Order.find()
        .populate("product", "name")
        .exec()
        .then(docs => {
            const Obj = {
                count: docs.length,
                description: "Get All Orders",
                orders: docs.map(docs => {
                    return {
                        _id: docs._id,
                        product: docs.product,
                        quantity: docs.quantity,
                        request: {
                            type: "GET",
                            url: "localhost:2000/orders/" + docs._id
                        }
                    }
                })
            }
            res.status(200).json(Obj)
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

exports.orders_create_order = (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: " Product not found!!!"
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save()
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Order Was Successfully Stored!!!",
                CreatedOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: "GET",
                    url: "localhost:2000/orders/" + result._id
                }

            });
        })

        .catch(err => {
            res.status(500).json({
                message: "Product not found",
                error: err
            })
        })
}

exports.orders_get_order = (req, res, next) => {
    Order.findById(req.params.orderId)
        .populate("product")
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: "Order not found!!"
                })
            }
            res.status(200).json({
                order: order,
                message: "Get A Single Order",
                request: {
                    type: "GET",
                    url: "localhost:2000/orders/" + order._id
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.orders_remove_order = (req, res, next) => {
    const id = req.params.orderId
    Order.remove({
            _id: id
        })
        .exec()
        .then(result => res.status(200).json({
            description: "SORRY!!! One Order was Deleted!!!",
            request: {
                type: "POST",
                url: "localhost:2000/orders/" + id
            },
            body: {
                productId: "ID",
                quantity: "Number"
            }
        }))
        .catch(err => res.status(500).json({
            error: err
        }))

}