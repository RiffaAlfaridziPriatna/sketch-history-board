export class SketchId {
  private constructor(private value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('SketchId cannot be empty');
    }
  }

  static create(value: string): SketchId {
    return new SketchId(value);
  }

  static generate(): SketchId {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return new SketchId(`sketch_${timestamp}_${random}`);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: SketchId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
