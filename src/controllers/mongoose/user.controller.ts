import { Router, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import * as userService from "../../services/user/user.service";
import { SuccessMessages } from "../../shared/enums/messages/success-messages.enum";
import { ErrorMessages } from "../../shared/enums/messages/error-messages.enum";
import {
  changePasswordValidator,
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
    })
  )

  // GET /api/mongoose/users
  .get(
    "/",
    asyncHandler(async (req: Request, res: Response) => {
      const users = await userService.retrieveUsers();
      res.send(users);
    })
  )

  // GET /api/mongoose/users/:id
  .get(
    "/:id",
    getUserByIdValidator,
    asyncHandler(async (req: Request, res: Response) => {
      const existingUser = await userService.retrieveUserById(req.params.id);
      res.send(existingUser);
    })
  )

  // PATCH /api/mongoose/users/:id
  .patch(
    "/:id",
    getUserByIdValidator,
    updateUserValidator,
    asyncHandler(async (req: Request, res: Response) => {
      const updatedUser = await userService.updateUser(req.params.id, req.body);
      res.send(updatedUser);
    })
  )

  // PATCH /api/mongoose/users/change-password/:id
  .patch(
    "/change-password/:id",
    getUserByIdValidator,
    changePasswordValidator,
    asyncHandler(async (req: Request, res: Response) => {
      const updatedUser = await userService.updateUserPassword(
        req.params.id,
        req.body.new_password
      );
      res.send(updatedUser);
    })
  )

  // DELETE /api/mongoose/users:id
  .delete(
    "/:id",
    getUserByIdValidator,
    asyncHandler(async (req: Request, res: Response) => {
      await userService.deleteUser(req.params.id);
      res.send({ message: SuccessMessages.UserRemoveSuccess });
    })
  )

  // /api/mongoose/users/signup
  .post(
    "/signup",
    createUserValidator,
    asyncHandler(async (req: Request, res: Response) => {
      // Check User email Id Present Or Not.
      const isPresent: boolean = await userService.isUserEmaildPresent(
        req.body.email
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
    })
  );
export default controller;