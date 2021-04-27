function errHandler(err, req, res, next){
    if(err.name === 'SequelizeValidationError'){
        let errors = err.errors.map(e => {
            return e.message;
        })
        res.status(400).json({errors});
    } else if (err.code === 400 || err.code === 404 || err.code === 401){
        let errors = err.message;
        res.status(err.code).json({errors})
    } else {
        res.status(500).json({errors: 'failed reach server to read data'})
    }
}

module.exports = errHandler