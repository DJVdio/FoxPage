// Pure unit-conversion logic, extracted from the component so it is unit-testable.

export type Unit = {
  id: string;
  label: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
};

export type Category = { id: string; name: string; units: Unit[] };

export function factor(f: number) {
  return { toBase: (v: number) => v * f, fromBase: (v: number) => v / f };
}

export const CATEGORIES: Category[] = [
  {
    id: "length",
    name: "长度 · LENGTH",
    units: [
      { id: "m", label: "米 m", ...factor(1) },
      { id: "km", label: "千米 km", ...factor(1000) },
      { id: "cm", label: "厘米 cm", ...factor(0.01) },
      { id: "mm", label: "毫米 mm", ...factor(0.001) },
      { id: "mi", label: "英里 mi", ...factor(1609.344) },
      { id: "ft", label: "英尺 ft", ...factor(0.3048) },
      { id: "in", label: "英寸 in", ...factor(0.0254) },
      { id: "yd", label: "码 yd", ...factor(0.9144) },
    ],
  },
  {
    id: "weight",
    name: "重量 · MASS",
    units: [
      { id: "g", label: "克 g", ...factor(1) },
      { id: "kg", label: "千克 kg", ...factor(1000) },
      { id: "mg", label: "毫克 mg", ...factor(0.001) },
      { id: "lb", label: "磅 lb", ...factor(453.59237) },
      { id: "oz", label: "盎司 oz", ...factor(28.349523) },
      { id: "t", label: "吨 t", ...factor(1_000_000) },
    ],
  },
  {
    id: "data",
    name: "数据 · DATA",
    units: [
      { id: "B", label: "字节 B", ...factor(1) },
      { id: "KB", label: "KB", ...factor(1024) },
      { id: "MB", label: "MB", ...factor(1024 ** 2) },
      { id: "GB", label: "GB", ...factor(1024 ** 3) },
      { id: "TB", label: "TB", ...factor(1024 ** 4) },
      { id: "bit", label: "位 bit", ...factor(0.125) },
    ],
  },
  {
    id: "temp",
    name: "温度 · TEMPERATURE",
    units: [
      { id: "C", label: "摄氏 °C", toBase: (v) => v, fromBase: (v) => v },
      { id: "F", label: "华氏 °F", toBase: (v) => ((v - 32) * 5) / 9, fromBase: (c) => (c * 9) / 5 + 32 },
      { id: "K", label: "开尔文 K", toBase: (v) => v - 273.15, fromBase: (c) => c + 273.15 },
    ],
  },
];

export function convert(from: Unit, to: Unit, value: number): number {
  return to.fromBase(from.toBase(value));
}

export function fmt(n: number): string {
  if (!Number.isFinite(n)) return "—";
  if (n === 0) return "0";
  const abs = Math.abs(n);
  const s = abs >= 1e15 || abs < 1e-6 ? n.toExponential(6) : n.toPrecision(10);
  return parseFloat(s).toString();
}
