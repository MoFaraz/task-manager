export class User {
    id: string;
    email: string;
    password: string;
    username: string;
    role: Role;
    createdDate: Date;
    lastModifiedDate: Date;
  }
  
enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN',
} 