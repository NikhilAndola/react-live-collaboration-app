export interface UserSocketMap {
  [key: string]: string;
}

export interface Client {
  socketId: string;
  username: string;
}
