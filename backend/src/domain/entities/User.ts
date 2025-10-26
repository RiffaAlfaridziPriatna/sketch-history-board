import { v4 as uuidv4 } from 'uuid';

export interface UserProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private constructor(private props: UserProps) {}

  static create(): User {
    const now = new Date();
    const id = uuidv4();
    
    return new User({
      id,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistence(props: UserProps): User {
    return new User(props);
  }

  get id(): string {
    return this.props.id;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  updateTimestamp(): void {
    this.props.updatedAt = new Date();
  }

  toPersistence(): UserProps {
    return { ...this.props };
  }
}
