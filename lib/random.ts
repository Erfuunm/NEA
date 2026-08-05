export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function randomSigned(scale: number): number {
  return (Math.random() - 0.5) * scale;
}

export function randomAngle(): number {
  return Math.random() * Math.PI * 2;
}

export function randomUnit(): number {
  return Math.random();
}
