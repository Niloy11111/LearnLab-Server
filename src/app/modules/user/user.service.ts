import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import AppError from "../../errors/appError";
import { AuthService } from "../auth/auth.service";
import Customer from "../customer/customer.model";
import { IUser, UserRole } from "./user.interface";
import User from "./user.model";

// Function to register user
const registerUser = async (userData: IUser) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if ([UserRole.ADMIN].includes(userData.role)) {
      throw new AppError(
        StatusCodes.NOT_ACCEPTABLE,
        "Invalid role. Only User is allowed."
      );
    }

    // Check if the user already exists by email
    const existingUser = await User.findOne({ email: userData.email }).session(
      session
    );
    if (existingUser) {
      throw new AppError(
        StatusCodes.NOT_ACCEPTABLE,
        "Email is already registered"
      );
    }

    // Create the user
    const user = new User(userData);
    const createdUser = await user.save({ session });

    const profile = new Customer({
      user: createdUser._id,
    });

    await profile.save({ session });

    await session.commitTransaction();

    return {
      result: await AuthService.loginUser({
        email: createdUser.email,
        password: userData.password,
        clientInfo: userData.clientInfo,
      }),
      userData: createdUser,
    };
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    throw error;
  } finally {
    session.endSession();
  }
};

export const UserServices = {
  registerUser,
};
