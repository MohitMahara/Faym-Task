import authService from "../services/auth.service.js";

class AuthController {

    async registerUser(req, res, next) {
        try {

            const user = await authService.registerUser(req.body);

            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: user
            });

        } catch (error) {
            next(error);
        }
    }

}

export default new AuthController();