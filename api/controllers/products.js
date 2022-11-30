  const Product = require("../models/products")
  const mongoose = require("mongoose");


  exports.products_get_all = (req, res, next) => {
      Product.find()
          // .select(" name country company")
          .exec()
          .then(docs => {
              const resObj = {
                  count: docs.length,
                  description: "Get All Product",
                  products: docs.map(docs => {
                      return {
                          name: docs.name,
                          price: docs.price,
                          company: docs.company,
                          country: docs.country,
                          productDate: docs.productDate,
                          productImage: docs.productImage,
                          _id: docs._id,
                          request: {
                              type: "GET",
                              url: "localhost:2000/products/" + docs._id
                          }
                      }
                  })
              }
              res.status(200).json(resObj)
          })
          .catch(err => {
              console.log(err);
              res.status(500).json({
                  error: err
              })
          })
  }

  exports.products_create_product = (req, res, next) => {

      const product = new Product({
          _id: new mongoose.Types.ObjectId(),
          name: req.body.name,
          price: req.body.price,
          company: req.body.company,
          country: req.body.country,
          productDate: req.body.productDate,
          productImage: req.file.path
      });
      product.save()
          .then(result => {
              console.log(result);
              res.status(201).json({
                  message: " Created Product successfully",
                  createdProduct: {
                      name: result.name,
                      price: result.price,
                      company: result.company,
                      country: result.country,
                      productDate: result.productDate,
                      _id: result._id
                  },
                  request: {
                      type: "GET",
                      url: "localhost:2000/products/" + result._id
                  }
              })
          })
          .catch(err => {
              console.log(err);
              res.status(500).json({
                  error: err
              });
          })

  }

  exports.products_get_product = (req, res, next) => {
      const id = req.params.productId
      Product.findById(id)
          .exec()
          .then(doc => {
              console.log("From database", doc);
              if (doc) {
                  res.status(200).json({
                      productDate: doc.productDate,
                      product: doc,
                      request: {
                          type: "GET",
                          description: "Get Single Product",
                          url: "localhost:2000/products/"
                      }
                  })
              } else {
                  res.status(404).json({
                      Message: "The provided ID is not valid..."
                  })
              }
          })
          .catch(err => {
              console.log(err);
              res.status(500).json({
                  error: err
              })
          })
  }

  exports.products_update_product = (req, res, next) => {
      const id = req.params.productId;
      const updateOps = {};
      for (const ops of req.body) {
          updateOps[ops.propName] = ops.name;
          updateOps[ops.propPrice] = ops.price;
          updateOps[ops.propCompany] = ops.company;
          updateOps[ops.propCountry] = ops.country;
          updateOps[ops.propProductDate] = ops.productDate
          updateOps[ops.propProductImage] = ops.productImage;
      }
      Product.updateOne({
              _id: id
          }, {
              $set: updateOps
          })
          .exec()
          .then(result => {
              console.log(result);
              res.status(200).json({
                  message: "Product Updated",
                  productDate: {
                      type: Date,
                      default: new Date().toISOString()
                  },
                  request: {
                      type: "GET",
                      description: "A product was updated",
                      url: "localhost:2000/products/" + id
                  }
              })
          })
          .catch(err => {
              console.log(err);
              res.status(500).json({
                  error: err
              });
          })
  }

  exports.products_delete_product = (req, res) => {
      const id = req.params.productId;
      Product.remove({
              _id: id
          })
          .exec()
          .then(result => {
              res.status(200).json({
                  description: "One Product Successfully Deleted!!!",
                  request: {
                      type: "DELETE",
                      url: "localhost:2000/products/" + id
                  }
              })
          })
          .catch(err => {
              console.log(err);
              res.status(500).json({
                  error: err
              })
          })
  }