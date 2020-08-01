const passport = require('passport');
const axios = require('axios');
const { get } = require('lodash');
const { Strategy: FacebookStrategy } = require('passport-facebook');

const config = require("../../../config/index");

passport.use(new FacebookStrategy({
    clientID: config.facebookClientId,
    clientSecret: config.facebookClientSecret,
    callbackURL: "/auth/facebook/callback"
},
    async function (accessToken, refreshToken, profile, cb) {
        const { data, status } = await axios({
            url: `${config.apiUrl}/api/auth/sign-provider`,
            method: "post",
            data: {
                name: profile.displayName,
                email: get(profile, 'emails.0.value', `${profile.id}@facebook.com`),
                password: profile.id,
                apiKeyToken: config.apiKeyToken
            }
        });

        if (!data || status !== 200) {
            return cb(boom.unauthorized(), false);
        }

        return cb(null, data);
    }
));