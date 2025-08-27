const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');
require ('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET
const TOKEN_EXPIRATION = '15m';
const REFRESH_EXPIRATION = 7*24*60*60*1000;

async function hashPassword(password){
    const saltRounds = 15;
        return await bcrypt.hash(password, saltRounds);
};

async function comparePassword(password, hashedPassword){
    return await bcrypt.compare(password, hashedPassword);
};

function generateToken(user){
    return jwt.sign(
        {id: user.id, email:user.email, role:user.role},
        JWT_SECRET,
        {expiresIn: TOKEN_EXPIRATION}
    );
};

function createAuthCookie(res, token){
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'strict',
        maxAge: REFRESH_EXPIRATION,
        path: '/'
    });
};

function verifyAndRefreshToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const newToken = generateToken(decoded);

    return { valid: true, user: decoded, newToken };
  } catch (err) {
    return { valid: false, user: null, newToken: null };
  }
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  createAuthCookie,
  verifyAndRefreshToken,
};