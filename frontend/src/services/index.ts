import userService from "./userService"
import authService from "./authService"
import questradeService from "./questradeService"
import finnhubService from "./finnhubService"

export default {
    users: userService,
    auth: authService,
    questrade: questradeService,
    finnhub: finnhubService,
}