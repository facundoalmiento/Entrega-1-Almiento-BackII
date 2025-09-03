import passport from "passport";
export const requireAuth = passport.authenticate("current", { session: false });
