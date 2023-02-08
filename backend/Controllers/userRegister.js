exports.register = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    if (!(firstname && lastname && email && password))
      return res.status(401).send("All fields are required");

    const existing = await User.findOne({ email });
    if (existing) {
      res.send("User already exists");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstname,
      lastname,
      email,
      password: encryptedPassword,
    });

    const secret = process.env.JWT_SECRET;

    const token = jwt.sign(
      {
        id: user._id,
        email,
      },
      secret,
      {
        expiresIn: "1h",
      }
    );
    user.password = undefined;
    user.token = token;
    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
  }
};
