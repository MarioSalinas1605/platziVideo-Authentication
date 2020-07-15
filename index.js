const express = require('express');
const passport = require('passport');
const boom = require('@hapi/boom');
const cookieParser = require('cookie-parser');
const axios = require('axios');

const config = require('./config/index');

const app = express();

app.use(express.json());
app.use(cookieParser());

require('./utils/auth/strategies/basic');

app.post("/auth/sign-in", async (req, res, next) => {
    passport.authenticate("basic", (error, data) => {
        try {
            if (error || !data) {
                next(boom.unauthorized());
            }

            req.login(data, { session: false }, async error => {
                if (error) {
                    next(error);
                }

                const { token, ...user } = data;

                res.cookie('token', token, {
                    httpOnly: !config.dev,
                    secure: !config.dev
                });

                res.status(200).json(user)
            });
        } catch (error) {
            next(error);
        }
    })(req, res, next)
});

app.post("/auth/sign-up", async (req, res, next) => {
    const { body: user } = req;
    try {
        await axios({
            url: `${config.apiUrl}/api/auth/sign-up`,
            method: 'post',
            data: user
        })

        res.status(200).json({
            message: 'User created'
        })
    } catch (error) {
        next(error)
    }
});

app.get("/movies", async (req, res, next) => {

});

app.post("/user-movies", async (req, res, next) => {

});

app.delete("/user-movies/:userMovieId", async (req, res, next) => {

});

app.listen(config.port, () => {
    console.log(`Listening http://localhost:${config.port}`);
})