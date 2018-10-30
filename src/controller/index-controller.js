'use strict';

exports.getIndex = (req, res, next) => {
	try {
		res.status(200).send({
			title: "API OK",
			version: "0.0.1"
		})
	} catch(e) {
		res.status(400).send(e)
	}
};