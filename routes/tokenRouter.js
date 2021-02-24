const express = require('express');
const tokenRouter = express.Router();



/**
 * refresh token
 */

tokenRouter
    .post('/refresh', async (req, res, next) => {
        
    });



module.exports = tokenRouter;