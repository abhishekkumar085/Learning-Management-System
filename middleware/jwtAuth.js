import jwt from 'jsonwebtoken';

const jwtAuth = (req, res, next) => {
  const token = (req.cookies && req.cookies.token) || null;
  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Authorization failed!!',
    });
  }

  try {
    const payload = jwt.verify(token, process.env.SECRET);
    req.user = { id: payload.id, email: payload.email };
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: 'Not Authorized!!',
    });
  }

  next();
};

export default jwtAuth;
