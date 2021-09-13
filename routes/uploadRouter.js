const router = require('express').Router();
const { publicFileUpload } = require('../utils/fileUpload');

router.post('/upload',publicFileUpload.single('image'), function(req, res) {
    if(req.file && req.file.location){
        return res.status(201).json({
            message: 'Successfully uploaded file/Image',
            error: false,
            ImageUrl: req.file.location 
        });
    }else{
        return res.status(201).json({
            message: 'Something went Wrong',
            error: true,
            ImageUrl: "" 
        });
    }
    
});

module.exports = router;