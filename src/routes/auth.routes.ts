import { login, register } from "@controllers/auth.controller.js";
import { router } from "./router.js";

router.post("/register", register)
router.post("/login", login)

export default router
