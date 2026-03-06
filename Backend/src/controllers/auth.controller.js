const userModel = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

/** 
* @route registerUserController
* @description register a new-user
* @access public 
*/
const registerUserController = async (req, res) => {

    const { username, email, password } = req.body

    if(!username || !email || !password){
        return res.status(400).json({
            message: "Please prvide username, email and password"
        })
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [ {username}, {email} ]
    })

    if(isUserAlreadyExists){
        return res.status(400).json({
            message: `Account akready exists with ${email} or ${username}`
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username, email, password: hash
    })

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1d' }
    )

    res.cookie('token', token)

    res.status(201).json({
        message: "User Registered Successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        }
    })


}

/**
 * @route loginUserController
 * @description login a user
 * @access Public 
 */
const loginUserController = async (req, res) => {

    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if(!user){
        return res.status(400).json({
            message: "Invalid Email or Password"
        })
    }

    const isPasswordvalid = await bcrypt.compare(password, user.password)

    if(!isPasswordvalid){
        return res.status(400).json({
            message: "Invalid Email or Password"
        })
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1d' }
    )   

    res.cookie('token', token)

    res.status(200).json({
        message: "User Login Successfully",
        user: {
            _id: user._id,
            username: user.username,
            email: user.email
        }
    })

}

module.exports = {
    registerUserController,
    loginUserController
}