const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const CustomError = require("../errors");
const { User } = require("../models");
const authController = require("../controllers/auth.controller");

jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../models");

describe("Auth Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe("register", () => {
    it("should create a new user and return 201 status", async () => {
      // Mock User.create to resolve with a dummy user
      User.create.mockResolvedValue({
        id: 1,
        role: "user",
        email: "test@example.com",
      });

      // Set req.body with necessary data
      req.body = {
        role: "user",
        email: "test@example.com",
        password: "password",
      };

      // Invoke register function with mocked req, res, and next
      await authController.register(req, res, next);

      // Assert the expected behavior
      expect(User.create).toHaveBeenCalledWith({
        role: "user",
        email: "test@example.com",
        password: "password",
      });
      expect(res.status).toHaveBeenCalledWith(httpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        role: "user",
        email: "test@example.com",
      });
    });

    it("should handle errors and call next", async () => {
      // Mock User.create to reject with an error
      const errorMessage = "Some error message";
      const error = new Error(errorMessage);
      User.create.mockRejectedValue(error);

      // Set req.body with necessary data
      req.body = {
        role: "user",
        email: "test@example.com",
        password: "password",
      };

      // Invoke register function with mocked req, res, and next
      await authController.register(req, res, next);

      // Assert the expected error handling behavior
      expect(next).toHaveBeenCalledWith(error);
    });

    // Add more test scenarios for register function if needed
  });

  describe("login", () => {
    it("should handle successful login and return token and user info", async () => {
      const hashedPassword = "$2b$10$hashedPassword"; // Replace with an actual hashed password

      // Mock User.scope and User.findOne to resolve with a dummy user
      User.scope.mockReturnThis();
      User.findOne.mockResolvedValue({
        id: 1,
        email: "test@example.com",
        password: hashedPassword,
      });

      // Mock bcrypt.compare to resolve with true
      bcrypt.compare.mockResolvedValue(true);

      // Mock jwt.sign to return a token
      jwt.sign.mockReturnValue("token");

      // Set req.body with necessary data
      req.body = { email: "test@example.com", password: "password" };

      // Invoke login function with mocked req, res, and next
      await authController.login(req, res, next);

      // Assert the expected behavior
      expect(User.scope).toHaveBeenCalledWith("withPassword");
      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith("password", hashedPassword);
    });

    it("should handle invalid credentials", async () => {
      // Mock User.scope and User.findOne to resolve with null (user not found)
      User.scope.mockReturnThis();
      User.findOne.mockResolvedValue(null);

      // Set req.body with necessary data
      req.body = { email: "test@example.com", password: "password" };

      // Invoke login function with mocked req, res, and next
      await authController.login(req, res, next);

      // Assert the expected behavior
      expect(next).toHaveBeenCalledWith(
        new CustomError("Invalid credentials", httpStatus.UNAUTHORIZED)
      );
    });

    it("should handle password mismatch", async () => {
      const hashedPassword = "$2b$10$hashedPassword"; // Replace with an actual hashed password

      // Mock User.scope and User.findOne to resolve with a dummy user
      User.scope.mockReturnThis();
      User.findOne.mockResolvedValue({
        id: 1,
        email: "test@example.com",
        password: hashedPassword,
      });

      // Mock bcrypt.compare to resolve with false (password mismatch)
      bcrypt.compare.mockResolvedValue(false);

      // Set req.body with necessary data
      req.body = { email: "test@example.com", password: "password" };

      // Invoke login function with mocked req, res, and next
      await authController.login(req, res, next);

      // Assert the expected behavior
      expect(next).toHaveBeenCalledWith(
        new CustomError("Invalid credentials", httpStatus.UNAUTHORIZED)
      );
    });

    it("should handle errors and call next", async () => {
      // Mock User.scope and User.findOne to reject with an error
      const errorMessage = "Some error message";
      const error = new Error(errorMessage);
      User.scope.mockReturnThis();
      User.findOne.mockRejectedValue(error);

      // Set req.body with necessary data
      req.body = { email: "test@example.com", password: "password" };

      // Invoke login function with mocked req, res, and next
      await authController.login(req, res, next);

      // Assert the expected behavior
      expect(next).toHaveBeenCalledWith(error);
    });

    // Add more test scenarios for login function if needed
  });

  // Add more describe blocks and test scenarios for other functionalities in auth.controller if present
});
