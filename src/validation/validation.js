export const validate = (scheme, sorov) => {
    return async (req, res, next) => {
        const {error} = scheme.validate(req[sorov], { abortEarly: true });
        if(error){
            return res.status(422).json({message: error.details[0].message});
        };
        next();
    };
};
 