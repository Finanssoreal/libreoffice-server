const checkToken = (req, res, next) => {
  const token = req.headers["Authorization"] ?? null
  const validToken = "mysecrettoken"

  if (token !== validToken) {
    return res.status(403).json({ message: "Invalid token" })
  }

  // Token is valid, move to the next middleware/route handler
  next()
}

export default checkToken
