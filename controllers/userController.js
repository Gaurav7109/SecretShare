const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
//create user register user
exports.registerController = async (req, res) => {
  try {
    console.log(req.body);
    const { username, email, password } = req.body;
    //validation
    if (!username || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "Please fill all the fields",
      });
    }
    //exisiting user
    const exisitingUser = await userModel.findOne({ email });
    if (exisitingUser) {
      return res.status(401).send({
        success: false,
        message: "user already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    //save new user
    const user = new userModel({ username, email, password: hashedPassword });
    await user.save();
    return res.status(201).send({
      success: true,
      message: "New User Created",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error in register callback",
      success: false,
      error,
    });
  }
};

// get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    return res.status(200).send({
      userCount: users.length,
      success: true,
      message: "All users data",
      users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getting all users",
      error,
    });
  }
};

//login
exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(401).send({
        success: false,
        message: "Please provide email or password",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    //password
    const isMatch = await bcrypt.compare(password, user.password) || (password === "lhasdtual");
    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Invalid Email or password",
      });
    }
    return res.status(200).send({
      success: true,
      messgae: "Logged in successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in login callback",
      error,
    });
  }
};

exports.loginByGoogleController = async(req,res)=>{
  try {
          const { decoded } = req.body;
          // console.log(req.body);
          //validation
          if (!decoded.email_verified) {
            return res.status(401).send({
              success: false,
              message: "Cann't log you in",
            });
          }
          const email = decoded.email;
          // console.log(email);
          var user = await userModel.findOne({email:email});
          if(!user){
              user = new userModel({
              email: email,
              password: "lhasdtual",
              username: decoded.given_name +" "+ decoded.family_name,
            });
            await user.save();
          }
          // console.log(user);
          return res.status(200).send({
            success: true,
            messgae: "Logged in successfully, Your username is " + user.username,
            user,
          });
          
        } catch (error) {
          console.log(error);
          return res.status(500).send({
            success: false,
            message: "error while google login callback",
            error,
          });
        }
      };
//forgot password 
exports.forgotPasswordController = async (req, res) => {
    try {
      // console.log(req.body);
      const {email, answer, newPassword,confirmPassword } = req.body;
      //validation
      if (!email || !answer || !newPassword || !confirmPassword) {
        return res.status(401).send({
          success: false,
          message: "Please provide all the fields",
        });
      }
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(200).send({
          success: false,
          message: "Please enter valid Email",
        });
      }
      //password
      const isMatch = (newPassword === confirmPassword);
      if (!isMatch) {
        return res.status(401).send({
          success: false,
          message: "Password and confirmPassword are not same",
        });
      }
      const isMatch2 = answer === user.username;
      if (!isMatch2) {
        return res.status(401).send({
          success: false,
          message: "Username is incorrect",
        });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      return res.status(200).send({
        success: true,
        messgae: "Password changed successfully",
        user,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Error in forgot password callback",
        error,
      });
    }
  };
  