/**
 * ShapeFlags
 * | 比较
 * & 查
 */

export const enum ShapeFlags {
  ELEMENT = 1,
  STATEFUL_COMPONENT = 1 << 1,
  TEXT_CHLIDREN = 1 << 2,
  ARRAY_CHLIDREN = 1 << 3,
  SLOTS_CHILDREN = 1 << 4,
}
