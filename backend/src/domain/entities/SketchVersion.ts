export interface SketchVersionProps {
  id: string;
  userId: string;
  name: string;
  thumbnail: string;
  data: string;
  createdAt: Date;
  updatedAt: Date;
}

export class SketchVersion {
  private constructor(private props: SketchVersionProps) {}

  static create(props: Omit<SketchVersionProps, 'id' | 'createdAt' | 'updatedAt'>): SketchVersion {
    const now = new Date();
    return new SketchVersion({
      ...props,
      id: `sketch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistence(props: SketchVersionProps): SketchVersion {
    return new SketchVersion(props);
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get name(): string {
    return this.props.name;
  }

  get thumbnail(): string {
    return this.props.thumbnail;
  }

  get data(): string {
    return this.props.data;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  updateName(name: string): void {
    this.props.name = name;
    this.props.updatedAt = new Date();
  }

  updateData(data: string, thumbnail: string): void {
    this.props.data = data;
    this.props.thumbnail = thumbnail;
    this.props.updatedAt = new Date();
  }

  update(updateData: Partial<{
    name: string;
    thumbnail: string;
    data: string;
  }>): void {
    if (updateData.name !== undefined) {
      this.props.name = updateData.name;
    }
    if (updateData.thumbnail !== undefined) {
      this.props.thumbnail = updateData.thumbnail;
    }
    if (updateData.data !== undefined) {
      this.props.data = updateData.data;
    }
    this.props.updatedAt = new Date();
  }

  toPersistence(): SketchVersionProps {
    return { ...this.props };
  }
}
