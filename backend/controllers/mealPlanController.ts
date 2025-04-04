import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import {
  MongooseObjectIdError,
  NotFoundError,
  DatabaseError,
} from "../customErrors";
