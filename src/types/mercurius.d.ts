import { AuthContext } from "../context/auth.context";

declare module "mercurius" {
  interface MercuriusContext extends AuthContext { }
}



