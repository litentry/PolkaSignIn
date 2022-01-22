import { AuthUser } from "./authUser";

export interface IAuthService {
    validateUser(username, password): Promise<AuthUser>;
}