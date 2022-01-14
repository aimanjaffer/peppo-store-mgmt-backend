const isAdminOrManager = (req, res, next) => {
  if(req.user.role && (req.user.role === 'admin' || req.user.role === 'manager' ))
    return next();
  else
    return res.status(403).send("Insufficient Privileges");
};

module.exports = isAdminOrManager;