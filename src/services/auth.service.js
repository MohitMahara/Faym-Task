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

        const safeUser = {
            name : user.name,
            email : user.email
        }

        return safeUser;
    }

}

export default new AuthService();