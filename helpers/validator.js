import Joi from "@hapi/joi";

const validator = {
  validateBody: (schema) => (req, res, next) => {
    const result = schema.validate(req.body);
    if (result.error) {
      return res.status(400).json({
        status: 400,
        error: result.error.message,
      });
    }

    req.body = result.value;
    return next();
  },

  schemas: {
    revokeTokenSchema: Joi.object().keys({
      token: Joi.string().empty(""),
    }),

    validateResetTokenSchema: Joi.object().keys({
      token: Joi.string().required(),
    }),

    paymentSchema: Joi.object().keys({
      amount: Joi.number().positive().greater(1).precision(2).required(),
    }),

    authSchema: Joi.object().keys({
      firstName: Joi.string()
        .regex(/^[a-zA-Z]*$/)
        .required()
        .trim()
        .lowercase()
        .error(new Error("First Name is required")),
      lastName: Joi.string()
        .regex(/^[a-zA-Z]*$/)
        .required()
        .trim()
        .lowercase()
        .error(new Error("Last Name is required")),
      phoneNumber: Joi.string()
        .regex(/^(\+?91|0)?[6789]\d{9}$/)
        .required()
        .error(new Error("Phone Number is required")),
      email: Joi.string()
        .email()
        .required()
        .trim()
        .lowercase()
        .error(new Error("A valid email address is required")),
      password: Joi.string()
        .required()
        .error(new Error("Password is required")),
    }),

    loanSchema: Joi.object().keys({
      description: Joi.string()
        .required()
        .trim()
        .lowercase()
        .error(new Error("Description is required")),
      amount: Joi.number()
        .required()
        .error(new Error("A Loan amount  is required")),
      installements: Joi.number()
        .integer()
        .max(12)
        .min(1)
        .required()
        .error(new Error("A installements is required")),
      guarantor1: Joi.string()
        .guid()
        .required()
        .error(new Error("A guarantor1 is required")),
      guarantor2: Joi.string()
        .guid()
        .required()
        .error(new Error("A guarantor2 is required")),
    }),

    bankDetailSchema: Joi.object().keys({
      account_number: Joi.string()
        .regex(/^[0-9]*$/)
        .required()
        .min(10)
        .max(10)
        .error(new Error("Account Number is Invalid")),
      bank_code: Joi.string()
        .regex(/^[0-9]*$/)
        .required()
        .min(3)
        .max(3)
        .error(new Error("Bank Code is Invalid")),
      bvn: Joi.string()
        .regex(/^[0-9]*$/)
        .min(11)
        .error(new Error("BVN is Invalid")),
      type: Joi.string().error(new Error("BVN is Invalid")),
    }),

    authLoginSchema: Joi.object().keys({
      email: Joi.string()
        .regex(/\S+@\S+\.\S+/)
        .required()
        .trim()
        .lowercase()
        .error(new Error("A valid email address is required")),
      password: Joi.string()
        .required()
        .error(new Error("Password is required")),
    }),

    fundAccountSchema: Joi.object().keys({
      amount: Joi.number().required().error(new Error("Please enter amount")),
      cvv: Joi.number()
        .integer()
        .max(999)
        .required()
        .error(new Error("Enter a valid CVV")),
      number: Joi.string()
        .regex(/^[0-9]*$/)
        .required()
        .error(new Error("Enter a valid card number string")),
      expiry_month: Joi.number()
        .integer()
        .min(1)
        .max(12)
        .required()
        .error(new Error("Enter an expiry month")),
      expiry_year: Joi.number()
        .integer()
        .max(2099)
        .required()
        .error(new Error("Enter an expiry year")),
    }),

    transferSchema: Joi.object().keys({
      amount: Joi.number().required().error(new Error("Please enter amount")),
      accountNumber: Joi.number()
        .integer()
        .required()
        .error(new Error("Enter a valid account number")),
    }),
  },
};

export default validator;
