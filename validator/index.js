exports.userSignupValidator = (req, res, next) => {
  req.check("name", "É necessário digitar o nome").notEmpty();
  req
    .check("email", "Email deve ter de 4 à 80 caracteres")
    .matches(/.+\@.+\..+/)
    .withMessage("Email deve conter @")
    .isLength({
      min: 4,
      max: 80,
    });
  req.check("password", "É necessário digitar a senha").notEmpty();
  req
    .check("password")
    .isLength({ min: 6 })
    .withMessage("Senha deve conter pelomenos 6 caracteres")
    .matches(/\d/)
    .withMessage("Senha deve conter um número");
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  next();
};
