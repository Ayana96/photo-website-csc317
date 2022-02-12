const e = require("express");

const checkUsername = (username) => {
    /*
        ^ --> start of the string
        \D --> anything NOT a digit [^0-9]
        \w --> anything that is a alphanumeric character [a-zA-Z0-9]
        {2,} ==> 2 or more character w/ NO UPPER LIMIT
    */

    //let usernameChecker = /^\D\w{2,}$/;

    let letters = /^([a-zA-Z])/;
    return letters.test(username);
}

const checkPassword = (password) => {
    let special = /(?=.*[a-z])(?=.*[@$!%*#?&])[A-Za-z\d@(/*-+!#$^&*)]{8,}$/;
    return special.test(password);
}

const checkEmail = (email) => {
    let format = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return format.test(email);
}

const registerValidation = (req, res, next) => {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let confirmpassword = req.body.confirmpassword;
    if(!checkUsername(username)){
        req.flash('error', "Enter your username with a letter character");
        req.session.save(err => {
            res.render("registration");
        });
    }else if(username.length <= 3){
        req.flash('error', "Username must be 3 or more alphanumeric characters");
        req.session.save(err => {
            res.render("registration");
        });
    }else if(!checkEmail(email)){
        req.flash('error', "You have entered an invalid email address");
        req.session.save(err => {
            res.render("registration");
        });
    }else if(!checkPassword(password)){
        req.flash('error', "Password must contain at least 8 characters, including uppercase, number, and special characters ( / * - + ! @ # $ ^ & * )");
        req.session.save(err => {
            res.render("registration");
        });
    }
    else if(confirmpassword != password){
        req.flash('error', "Passwords don't match");
        req.session.save(err => {
            res.render("registration");
        });
    }
    else{
        next();
    }
}

const loginValidation = (req, res, next) => {
    
}

module.exports = {registerValidation, loginValidation}