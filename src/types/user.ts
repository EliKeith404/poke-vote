export interface IUser {
  id: string;
  name: string;
  image: string;
  assignedCategory: string;
}

export interface IUserProps {
  user: IUser;
}
