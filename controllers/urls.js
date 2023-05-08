const { handleError } = require('../errors/ErrorHandler');
const Url = require('../models/url');

// gets object data in the body and creates it
// TODO POST /url
// ? req.body = { url, name }
module.exports.createUrl = (req, res, next) => {
    const { url, name } = req.body;

    Url.create({ url, name })
        .then((data) => {
            if (data) {
                res.send(data._id);
            }
        })
        .catch((err) => {
            if (err.message.indexOf('duplicate key error collection') !== -1) {
                Url.findOne({ name })
                    .then((data) => {
                        if (data) {
                            Url.findByIdAndRemove(data.id)
                                .orFail()
                                .then((data) => {
                                    if (data) {
                                        Url.create({ url, name })
                                            .then((data) => {
                                                if (data) {
                                                    res.send(data._id);
                                                }
                                            })
                                            .catch((err) => {
                                                if (err) {
                                                    console.log(err);
                                                }
                                            });
                                    }
                                })
                                .catch((err) => {
                                    handleError(err, req, res);
                                });
                        }

                    })
                    .catch((err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
            } else {
                handleError(err, req, res);
            }
        });
};

// get's an object ID in the params and deletes it
// TODO DELETE /url/:urlId
// ? req.params = {objectId: "object ID"}
module.exports.deleteUrl = (req, res, next) => {
    Url.findByIdAndRemove(req.params.urlId)
        .orFail()
        .then((data) => {
            if (data) {
                return res.send({ success: 'Object deleted successfully!' });
            }
        })
        .catch((err) => {
            handleError(err, req, res);
        });
};

// returns object by ID
// TODO GET /url/:urlId
// ? req.params = { urlId }
module.exports.getUrl = (req, res) => {
    if (req.params.urlId) {
        Url.findById(req.params.urlId)
            .then((data) => {
                if (data) {
                    return res.send({ url: data.url, name: data.name, id: data.id });
                }
            })
            .catch((err) => {
                handleError(err, req, res);
            });
    }
};

// returns object by name
// TODO GET /find/:name
// ? req.params = { name }
module.exports.fetchUrl = (req, res) => {
    const { name } = req.params;
    if (name) {
        Url.findOne({ name })
            .then((data) => {
                if (data) {
                    return res.send(data);
                }
            })
            .catch((err) => {
                if (err) {
                    console.log(err);
                }
            });
    }
}
