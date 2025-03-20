const checkToken = (req, res, next) => {
  const authHeader = req.headers["authorization"] ?? null
  const validToken = process.env.TOKEN_SECRET

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res
      .status(403)
      .json({ message: "No token provided or Invalid format" })
  }
  const token = authHeader.split(" ")[1]
  if (token !== validToken) {
    return res.status(403).json({ message: "Invalid token" })
  }

  next()
}

export default checkToken
