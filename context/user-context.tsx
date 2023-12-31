import React, { FC, createContext, useMemo, useState } from "react";
import { IUser } from "../models/User";
import axios from "axios";
import { ApiResponse } from "../types";

export interface IUserContext {
  user: IUser | null | undefined;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
}

export const defaultUser = {
  username: "user",
  avatarUrl: "https://toigingiuvedep.vn/wp-content/uploads/2021/07/anh-the.jpg",
  email: "phamduc@mail.com",
  firstName: "Pham",
  lastName: "Hong Duc",
  address: 1,
  category: 1,
  description:
    "<h2>CẤP BẬC:</h2><ul><li>Senior Dev</li></ul><h2>M&Ocirc; TẢ:</h2><ul><li>2020-2022: Hacker l&agrave;m việc cho FBI</li><li>2022-2023: Ph&aacute;t triển AI Skynet</li></ul>",
  level: "junior",
  experience: 1,
  role: 3,
  _id: "658e911ae33d7480c7ab0df9",
  __v: 0,
} as IUser;

export const UserContext = createContext<IUserContext>({
  user: defaultUser,
  setUser: () => {},
});

export function useUserContext() {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}

export const UserProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser>(defaultUser);

  React.useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get<ApiResponse<IUser>>(
        `/api/users/${defaultUser._id}`
      );
      const user = response.data.data;
      if (user) setUser(user);
    };
    fetchUser();
  }, []);

  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
