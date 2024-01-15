import to from "await-to-js";

import { IUser } from "../../databases/mongodb/model/user.model";
import UserModel from "../../databases/mongodb/schema/user.schema";
import {
  MongooseErrorCodes,
  MongooseErrors,
} from "../../shared/enums/db/mongodb-errors.enum";
import { ErrorMessages } from "../../shared/enums/messages/error-messages.enum";
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from "../../shared/exceptions/http.exceptions";
import { UserResponseDTO } from "../../shared/models/DTO/userDTO";
import { IMongooseError } from "../../shared/models/extensions/errors.extension";
const bcrypt = require("bcrypt");

// POST /api/mongoose/users
export const createNewUser = async (
  userData: IUser,
): Promise<UserResponseDTO> => {
  const newUser = new UserModel();
  newUser.username = userData.username;
  newUser.email = userData.email;

  const myPlaintextPassword = userData.password;
  const hash = bcrypt.hashSync(myPlaintextPassword, 10);
  newUser.password = hash;
  const [error] = await to(newUser.save());
  if (error && MongooseErrors.MongoServerError) {
    const mongooseError = error as IMongooseError;
    // check if there is a duplicate entry
    if (mongooseError.code === MongooseErrorCodes.UniqueConstraintFail) {
      throw new ConflictException(ErrorMessages.DuplicateEntryFail);
    } else {
      throw new InternalServerErrorException(ErrorMessages.CreateFail);
    }
  }

  const userDTO = UserResponseDTO.toResponse(newUser);
  return userDTO;
};

// GET /api/mongoose/users
export const retrieveUsers = async (): Promise<UserResponseDTO[]> => {
  const [error, users] = await to(UserModel.find({}));

  if (error) {
    throw new InternalServerErrorException(ErrorMessages.GetFail);
  }

  if (!users?.length) {
    return [];
  }

  const usersDTO = users.map((user) => UserResponseDTO.toResponse(user));
  return usersDTO;
};

// GET /api/mongoose/users/:id
export const retrieveUserById = async (
  id: string,
): Promise<UserResponseDTO> => {
  const [error, existingUser] = await to(UserModel.findById(id));

  if (!existingUser) {
    throw new NotFoundException(`User with id: ${id} was not found!`);
  }

  if (error) {
    throw new InternalServerErrorException(ErrorMessages.GetFail);
  }

  const userDTO = UserResponseDTO.toResponse(existingUser);
  return userDTO;
};

// PATCH /api/mongoose/users/:id
export const updateUser = async (
  id: string,
  userData: Partial<IUser>,
): Promise<UserResponseDTO> => {
  const [error, updatedUser] = await to(
    UserModel.findOneAndUpdate(
      { _id: id },
      { $set: { ...userData } },
      { new: true },
    ),
  );

  if (!updatedUser) {
    throw new NotFoundException(`User with id: ${id} was not found!`);
  }

  if (error) {
    throw new InternalServerErrorException(ErrorMessages.UpdateFail);
  }

  const userDTO = UserResponseDTO.toResponse(updatedUser);
  return userDTO;
};

// PATCH /api/mongoose/users/change-password/:id
export const updateUserPassword = async (
  id: string,
  newPassword: string,
): Promise<UserResponseDTO> => {
  const [error, updatedUser] = await to(
    UserModel.findOneAndUpdate(
      { _id: id },
      { $set: { password: newPassword } },
      { new: true },
    ),
  );

  if (!updatedUser) {
    throw new NotFoundException(`User with id: ${id} was not found!`);
  }

  if (error) {
    throw new InternalServerErrorException(ErrorMessages.UpdateFail);
  }

  const userDTO = UserResponseDTO.toResponse(updatedUser);
  return userDTO;
};

// DELETE /api/mongoose/users:id
export const deleteUser = async (id: string): Promise<void> => {
  const [error, existingUser] = await to(UserModel.findById(id));

  if (!existingUser) {
    throw new NotFoundException(`User with id: ${id} was not found!`);
  }

  if (error) {
    throw new InternalServerErrorException(ErrorMessages.DeleteFail);
  }

  await UserModel.findOneAndRemove({ _id: id });
};

export const isUserEmaildPresent = async (email: string): Promise<boolean> => {
  const [error, users] = await to(UserModel.find({ email }));

  if (error) {
    throw new InternalServerErrorException(ErrorMessages.GetFail);
  }

  if (!users?.length) {
    return false;
  }
  return true;
};

export const isEmailAndPasswordMatching = async (
  email: string,
  password: string,
): Promise<boolean> => {
  console.log("email 00", email);
  const [error, user] = await to(UserModel.find({ email }));

  if (error) {
    throw new InternalServerErrorException(ErrorMessages.GetFail);
  }
  if (!user?.length) {
    throw new InternalServerErrorException(ErrorMessages.UserNotFound);
  }

  console.log("user", user);
  console.log("password", password);

  bcrypt.compare(password, user[0].password, function (err: any, result: any) {
    console.log("err -->", err);
    console.log("result -->", result);

    return result == true;
  });

  return true;
};
