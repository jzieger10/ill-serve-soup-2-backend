// Extrapolate out the helper functions into this file after server is functional

const helperFunctions = [
	{
		register: (req, res) => {
			const userInfo = req.body;

			userInfo.password = bcrypt.hashSync(userInfo.password, 12); //set higher for production

			db("users")
				.insert(userInfo)
				.then(ids => {
					res.status(201).json(ids);
				})
				.catch(err =>
					res.status(500).json({
						err,
						message:
							"There has been an error on the Register POST endpoint",
					})
				);
		},
		generateToken: user => {
			console.log("in generateToken");
			const payload = {
				username: user.username,
			};

			const secret = process.env.JWT_SECRET;

			const options = {
				expiresIn: "120m",
			};
			return jwt.sign(payload, secret, options);
		},
		authenticate: (req, res, next) => {
			const token = req.get("Authorization");

			if (token) {
				jwt.verify(token, jwtKey, (err, decoded) => {
					if (err) return res.status(401).json(err);

					req.decoded = decoded;

					next();
				});
			} else {
				return res.status(401).json({
					error:
						"No token provided, must be set on the Authorization Header",
				});
			}
		},
	},
];

module.exports = helperFunctions;
