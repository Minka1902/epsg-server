const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createUrl, deleteUrl, getUrl, fetchUrl } = require('../controllers/urls');

router.post('/url', celebrate({
    body: Joi.object().keys({
        url: Joi.string().required().uri(),
        name: Joi.string().min(6).required(),
    }),
}), createUrl);

router.get('/url/:urlId', celebrate({
    params: Joi.object().keys({
        urlId: Joi.string(),
    }),
}), getUrl);

router.get('/find/:name', celebrate({
    params: Joi.object().keys({
        name: Joi.string().min(6),
    })
}), fetchUrl);

router.delete('/url/:urlId', celebrate({
    params: Joi.object().keys({
        urlId: Joi.string().min(23).max(25),
    })
}), deleteUrl);

module.exports = router;
