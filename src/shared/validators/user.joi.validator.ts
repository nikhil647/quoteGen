import Joi from "joi";
import { ErrorMessages } from "../enums/messages/error-messages.enum";

export const createUserSignInValidationSchema = Joi.object({
  password: Joi.string() /*.pattern(new RegExp('...'))*/
    .required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2, // the minimum number of domain segments (e.g. x.y.z has 3 segments)
      tlds: { allow: ["com", "net"] }, // allowed domains
    })
    .required(),
});

export const createUserValidationSchema = Joi.object({
  password: Joi.string() /*.pattern(new RegExp('...'))*/
    .required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2, // the minimum number of domain segments (e.g. x.y.z has 3 segments)
      tlds: { allow: ["com", "net"] }, // allowed domains
    })
    .required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  repeat_password: Joi.string() /*.pattern(new RegExp('...'))*/
    .required(),
});

// Update User is similar to Create User, but the fields are optional
export const updateUserValidationSchema = Joi.object({
  password: Joi.string() /*.pattern(new RegExp('...'))*/
    .required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .optional(),
});

export const changePasswordValidationSchema = Joi.object({
  old_password: Joi.string().required(),
  new_password: Joi.string().required(),
  repeat_password: Joi.any()
    .valid(Joi.ref("new_password"))
    .required()
    .messages({
      "any.only": ErrorMessages.PasswordMismatchFail,
    }),
});

// MongoDB Object_ID Validator
export const getUserIdValidationSchema = Joi.object({
  id: Joi.string().hex().length(24), // mongodb id length
});
