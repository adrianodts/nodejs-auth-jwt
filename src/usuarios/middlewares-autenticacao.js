const passport = require('passport');
const jwt = require('jsonwebtoken');
const { InvalidArgumentError } = require('../erros');

module.exports = {
    local: (req, res, next) => {
        passport.authenticate(
        'local',  // estrategia 
        { session: false }, // não usa sessão
        (error, usuario, info) => { // função callback customizada
            if (error && error.name === 'InvalidArgumentError') {
                res.status(401).json({ error: error.message })
            }

            if (error) {
                res.status(500).json({ error: error.message })
            }

            if (!usuario) {
                res.status(401).json()
            }

            req.user = usuario
            return next()    
        })(req, res, next)
    },
    bearer: (req, res, next) => {
        passport.authenticate(
        'bearer',  // estrategia 
        { session: false }, // não usa sessão
        (error, usuario, info) => { // função callback customizada
            if (error && error.name === 'JsonWebTokenError') {
                res.status(401).json({ error: error.message })
            }

            if (error && error.name === 'TokenExpiredError') {
                res.status(401).json({ error: error.message, expiradoEm: error.expiredAt })
            }

            if (error) {
                res.status(500).json({ error: error.message })
            }
            
            if (!usuario) {
                res.status(401).json()
            }
            req.token = info.token // vem da estrategia bearer  
            req.user = usuario
            return next()    
        })(req, res, next)
    }
}