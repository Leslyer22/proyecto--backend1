import bcrypt from "bcrypt";

export const createHash = (password) => {

    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));

};


export const validatePass = (password, hash) => {

    return bcrypt.compareSync(password, hash);
};


