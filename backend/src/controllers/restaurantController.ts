import { Request, Response, NextFunction } from 'express';
import { RestaurantModel } from '../models/Restaurant';
import { AppError } from '../middleware/errorHandler';
import { RestaurantCreateInput, RestaurantUpdateInput } from '../types/restaurant';

// Create restaurant
export const createRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const input = req.body as RestaurantCreateInput;
    input.ownerId = req.user?.id as number;

    const restaurant = await RestaurantModel.create(input);

    res.status(201).json({
      status: 'success',
      data: { restaurant },
    });
  } catch (error) {
    next(error);
  }
};

// Get restaurant by ID
export const getRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const restaurant = await RestaurantModel.findById(parseInt(id));

    if (!restaurant) {
      return next(new AppError('Restaurant not found', 404));
    }

    res.json({
      status: 'success',
      data: { restaurant },
    });
  } catch (error) {
    next(error);
  }
};

// Get all restaurants with optional filters
export const getAllRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cuisine, priceRange, minRating } = req.query;

    const filters = {
      cuisine: cuisine as string,
      priceRange: priceRange as string,
      minRating: minRating ? parseFloat(minRating as string) : undefined,
    };

    const restaurants = await RestaurantModel.findAll(filters);

    res.json({
      status: 'success',
      data: { restaurants },
    });
  } catch (error) {
    next(error);
  }
};

// Get restaurants by owner
export const getRestaurantsByOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { ownerId } = req.params;
    const restaurants = await RestaurantModel.findByOwnerId(parseInt(ownerId));

    res.json({
      status: 'success',
      data: { restaurants },
    });
  } catch (error) {
    next(error);
  }
};

// Update restaurant
export const updateRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const input = req.body as RestaurantUpdateInput;

    const restaurant = await RestaurantModel.update(parseInt(id), input);

    if (!restaurant) {
      return next(new AppError('Restaurant not found', 404));
    }

    res.json({
      status: 'success',
      data: { restaurant },
    });
  } catch (error) {
    next(error);
  }
};

// Delete restaurant
export const deleteRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const deleted = await RestaurantModel.delete(parseInt(id));

    if (!deleted) {
      return next(new AppError('Restaurant not found', 404));
    }

    res.json({
      status: 'success',
      message: 'Restaurant deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}; 