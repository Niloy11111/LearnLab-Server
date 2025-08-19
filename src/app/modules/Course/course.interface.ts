import { Document } from "mongoose";

export interface ICoordinates {
  type: string;
  coordinates: number[];
}
export interface ILocation {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates: ICoordinates;
}

export interface IProduct extends Document {
  title: string;
  slug: string;
  description: string;
  price: number;
  thumbnail: string;
  isActive: boolean;
  isDeleted: boolean;
  averageRating?: number;
  ratingCount?: number;
  numberOfReviews?: number;
  createdAt?: Date;
  updatedAt?: Date;
  reviews?: Record<string, any> | [];
}
