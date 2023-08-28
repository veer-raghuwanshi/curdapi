const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const config = require('../config');
const jwt = require('jsonwebtoken');

const router = express.Router();

// router.post('/register', async (req, res) => {
//     try {
//       const {name, email, password,mobile,city,address,gender } = req.body;

//       const existingUser = await User.findOne({ email,mobile });
//       if (existingUser) {
//         return res.status(400).json({ email,mobile, message: 'User already exists' });
//       }

//       var userCount = await User.countDocuments(); 
//       const hashedPassword = await bcrypt.hash(password, 10);

//       const newUser = new User({
//         _id: userCount + 1, // Set the custom numeric ID
//         name,
//         email,
//         password: hashedPassword,
//         mobile ,
//         city,
//         address,
//         gender

//       });

//       await newUser.save();

//       res.status(201).json({message: 'User Registered Successfully', name,email, password, mobile,city,address,gender, userId: newUser._id});
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'An error occurred' });
//     }
//   });






router.post('/register', async (req, res) => {
  try {
      const { name, email, password, mobile, city, address, gender } = req.body;
    const existingEmailUser = await User.findOne({ email });
    const existingMobileUser = await User.findOne({ mobile });

    if (existingEmailUser && existingMobileUser) {
      return res.status(400).json({ email, mobile, message: 'Email and mobile number are already registered' });
    } else if (existingEmailUser) {
      return res.status(400).json({ email, message: 'Email is already registered' });
    } else if (existingMobileUser) {
      return res.status(400).json({ mobile, message: 'Mobile number is already registered' });
    }
     

      const lastUser = await User.findOne().sort({ _id: -1 }); // Get the document with the highest _id
      const newId = lastUser ? lastUser._id + 1 : 1; // Generate a new _id

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
          _id: newId,
          name,
          email,
          password: hashedPassword,
          mobile,
          city,
          address,
          gender
      });

      await newUser.save();

      res.status(201).json({ message: 'User Registered Successfully', ...newUser._doc });
      console.log(newUser ," User Registered Successfully ")
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
  }
});


  
  
  

 

router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    console.log('Identifier:', identifier);

    const user = await User.findOne({
      $or: [{ email: identifier }, { mobile: identifier }],
    });
    console.log('User:', user);

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', passwordMatch);

    if (!passwordMatch) {
      console.log('Incorrect password');
      return res.status(401).json({ message: 'Authentication failed: Incorrect credentials' });
    }

    const token = jwt.sign({ identifier, userId: user._id }, config.secretKey, { expiresIn: '1h' });

    // Set the token as an HttpOnly cookie in the response
    var cookie =  res.cookie('token', token, {
      httpOnly: true, // Prevent JavaScript access to the cookie
      maxAge: 60 * 60 * 1000, // Cookie expiration time: 1 hour
      path: '/', // Set the cookie for the root path
    });
//console.log("cookie",cookie)
    res.status(200).json({ email: user.email, password: user.password,token, message: 'Successfully logged in' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});



 
  



  router.get('/users', async (req, res) => {
    try {
        const numericId = parseInt(req.params.id);

      const users = await User.find({}); // Exclude the password field from the response
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'An error occurred' });
    }
  });
////


// ...

router.post('/update/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, mobile, city, address, gender } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user's information
    user.name = name || user.name;
    user.mobile = mobile || user.mobile;
    user.city = city || user.city;
    user.address = address || user.address;
    user.gender = gender || user.gender;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});





////


router.delete('/delete/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user by ID and remove
    const deletedUser = await User.findByIdAndRemove(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});



///

  router.get('/users/:id', async (req, res) => {
    try {
      const numericId = parseInt(req.params.id);
  
      const user = await User.findOne({ _id: numericId });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
    }
  });
  
  router.post('/logout', (req, res) => {
    req.session.destroy((error) => {
      if (error) {
        console.error('Error destroying session:', error);
        return res.status(500).json({ message: 'An error occurred' });
      }
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.status(200).json({ message: 'Logout successful' });
    });
  });


  router.get('/check-auth', (req, res) => {
    if (req.session.userId) {
      // If userId exists in session, user is authenticated
      res.status(200).json({ isAuthenticated: true });
    } else {
      res.status(200).json({ isAuthenticated: false });
    }
  });


  module.exports = router;
  
