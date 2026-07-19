import User from "../models/user.model.js";
import Wallet from "../models/wallet.model.js";

class AuthService {

    async registerUser(payload) {

        const user = await User.create({
            name: payload.name,
            email: payload.email
        });

        await Wallet.create({
            userId: user._id
        });

        return user;
    }

}

export default new AuthService();