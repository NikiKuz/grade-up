import { router } from "@routes/router.js";
import authRoutes from '@routes/auth.routes.js'

router.use("/auth", authRoutes)

export default router
