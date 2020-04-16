const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Customer = mongoose.model('Customer');

router.get('/', (req, res) => {
	res.render("customer/addOrEdit", {
	viewTitle : "Insert Customer" 
	});
});

router.post('/', (req, res) => {
	insertRecort(req, res);
});

function insertRecort(req, res){
	var customer = new Customer();
	customer.name = req.body.name;
	customer.email = req.body.email;
	customer.mobile = req.body.mobile;
	customer.address = req.body.address;
	customer.pincode = req.body.pincode;
	customer.save((err, doc) => {
		if(!err)
			res.redirect('customer/list');
		else{
			if (err.name == 'ValidationError') {
				handleValidationError(err, req.body);
				res.render("customer/addOrEdit", {
					viewTitle : "Insert Customer",
					customer: req.body
				});
			}
			else
				console.log('Err during record insertion : ' + err);
		}
	});
}

router.get('/list', (req, res) => {
	Customer.find({}).lean().exec(function(err, docs) {
		if(!err){
			res.render("customer/list", {
				list: docs
			});
		} else {
			console.log('Error in retrieving customer list : ' + err);
		}
		
	});
});

function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'name':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

module.exports = router;