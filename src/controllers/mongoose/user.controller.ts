import { Router, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import * as userService from "../../services/user/user.service";
import { SuccessMessages } from "../../shared/enums/messages/success-messages.enum";
import { ErrorMessages } from "../../shared/enums/messages/error-messages.enum";
import { IUser } from "../../databases/mongodb/model/user.model";
import {
  changePasswordValidator,
  createUserSignInValidator,
  createUserValidator,
  getUserByIdValidator,
  updateUserValidator,
} from "../../shared/middlewares/user-validator.middleware";
const jwt = require("jsonwebtoken");

const SECRET = process.env.YOUR_SECRET_KEY || "secret";
const controller = Router();

controller
  // POST /api/mongoose/users
  .post(
    "/",
    createUserValidator,
    asyncHandler(async (req: Request, res: Response) => {
      const newUser = await userService.createNewUser(req.body);
      res.status(201).send(newUser);
    }),
  )

  // /api/mongoose/users/isSignIn
  .get(
    "/is-sign-in",
    asyncHandler(async (req: Request, res: Response) => {
      const token = req.cookies.access_token;
      const user = jwt.verify(token, SECRET);
      if (!user) {
        res.send(ErrorMessages.UserNotFound);
      }
      const oldUser = await userService.retrieveUserById(user.id);
      res.send(oldUser);
    }),
  )
  .get(
    "/signout",
    asyncHandler(async (req: Request, res: Response) => {
      res
        .clearCookie("access_token")
        .status(200)
        .send({ message: SuccessMessages.SignOutSuccess });
    }),
  )
  // GET /api/mongoose/users
  .get(
    "/",
    asyncHandler(async (req: Request, res: Response) => {
      console.log("Cmaee????");
      const users = await userService.retrieveUsers();
      res.send(users);
    }),
  )

  // GET /api/mongoose/users/:id
  .get(
    "/:id",
    getUserByIdValidator,
    asyncHandler(async (req: Request, res: Response) => {
      console.log("pathhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
      const existingUser = await userService.retrieveUserById(req.params.id);
      res.send(existingUser);
    }),
  )

  // PATCH /api/mongoose/users/:id
  .patch(
    "/:id",
    getUserByIdValidator,
    // updateUserValidator, Check User is logged in and modifying himself.
    asyncHandler(async (req: Request, res: Response) => {
      const updatedUser = await userService.updateUser(req.params.id, req.body);
      res.send(updatedUser);
    }),
  )

  // PATCH /api/mongoose/users/change-password/:id
  .patch(
    "/change-password/:id",
    getUserByIdValidator,
    changePasswordValidator,
    asyncHandler(async (req: Request, res: Response) => {
      const updatedUser = await userService.updateUserPassword(
        req.params.id,
        req.body.new_password,
      );
      res.send(updatedUser);
    }),
  )

  // DELETE /api/mongoose/users:id
  .delete(
    "/:id",
    getUserByIdValidator,
    asyncHandler(async (req: Request, res: Response) => {
      await userService.deleteUser(req.params.id);
      res.send({ message: SuccessMessages.UserRemoveSuccess });
    }),
  )

  // /api/mongoose/users/signup
  .post(
    "/signup",
    createUserValidator,
    asyncHandler(async (req: Request, res: Response) => {
      // Check User email Id Present Or Not.
      const isPresent: boolean = await userService.isUserEmaildPresent(
        req.body.email,
      );

      if (isPresent) {
        res.status(400).send(ErrorMessages.SignUpFailDuplicateEmail);
      }

      // If not create User
      const newUser = await userService.createNewUser(req.body);

      const token = jwt.sign({ id: newUser.id }, SECRET);

      res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        })
        .status(201)
        .send(newUser);
    }),
  )

  .post(
    "/signin",
    createUserSignInValidator,
    asyncHandler(async (req: Request, res: Response) => {
      // Check User email Id Present Or Not.
      const user: {
        password: string;
        _id: string;
        username: string;
        email: string;
      } = await userService.isEmailAndPasswordMatching(
        req.body.email,
        req.body.password,
      );

      const token = jwt.sign({ id: user._id }, SECRET);

      res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        })
        .status(201)
        .send(user);
    }),
  )

  .post(
    "/forgot-password",
    asyncHandler(async (req: Request, res: Response) => {
      const response = await userService.forgotPassword(req.body.email);
      res.send(response);
    }),
  );

export default controller;
