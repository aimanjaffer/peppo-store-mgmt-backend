const isAdmin = (req, res, next) => {
  try {
    if(!req.user.role || req.user.role !== 'admin')
        return res.status(403).send("Insufficient Privileges");
  } catch (err) {
      return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = isAdmin;