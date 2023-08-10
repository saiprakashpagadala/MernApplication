import userModel from "../models/userModel.js";

export const registerController = async (req, res, next) => {
  //   try {
  const { name, email, password } = req.body;
  // validate
  if (!name) {
    // approach one
    //   return res.status(400).send({
    //     success: false,
    //     message: "Please Provide Name",
    //   });
    // approach two
    next("Please Provide Name");
  }
  if (!email) {
    // approach one
    //   return res.status(400).send({
    //     success: false,
    //     message: "Please Provide Email",
    //   });
    // approach two
    next("Please Provide Email");
  }
  if (!password) {
    // approach one
    //   return res.status(400).send({
    //     success: false,
    //     message: "Please Provide Password",
    //   });
    // approach two
    next("Please Provide Password and length should be greater than 6");
  }
  // commenting for duplicate
  //   const existingUser = await userModel.findOne({ email });
  //   if (existingUser) {
  //     // approach one
  //     //   return res.status(200).send({
  //     //     success: false,
  //     //     message: "Email Already Registered Please Login",
  //     //   });
  //     // approach two
  //     next("Email Already Registered Please Login");
  //   }
  const user = await userModel.create({ name, email, password });

  // token
  const token = user.createJWT();

  res.status(201).send({
    success: true,
    message: "User Created Succesfully",
    user: {
      user: user.name,
      email: user.email,
      location: user.location,
    },
    token,
  });
  // approach three for express-async-errors behalf of try catch block
  //   } catch (error) {
  //     // approach one
  //     // console.log(error);
  //     // res.status(400).send({
  //     //   message: "Error In Register Controller",
  //     //   success: false,
  //     //   error,
  //     // });

  //     // approach two
  //     // next(error);
  //   }
};

export const loginController = async (req, res, next ) => {
  const { email, password } = req.body;

  // validation
  if (!email || !password) {
    next("please provide all fields");
  }

  // find user email
  const user = await userModel.findOne({ email })
  // this one is used for hiddind password
  .select("+password");
  if (!user) {
    next("Invalid username or password");
  }

  // compare password
  const isMatch = await user.comparePassword(password);
  if(!isMatch){
    next("Invalid username or Password");
  }

  // this is for hiding password
  user.password = undefined
  
  const token = user.createJWT()
  res.status(200).json({
    success : true,
    message:"login successful",
    user,
    token
  })
};
