import { isReactive, isReadonly, readonly } from "../reactive";

describe("readonly", () => {
  it("happly Path", () => {});
  it("在修改的时候，抛出警告", () => {
    console.warn = jest.fn();
    const user = readonly({
      age: 18,
    });
    user.age = 20;
    expect(console.warn).toBeCalled();
  });

  it("isReadonly", () => {
    const user = readonly({
      age: 18,
    });
    const primeval = {
      age: 1,
    };

    expect(isReadonly(user)).toBe(true);
    expect(isReadonly(primeval)).toBe(false);
    expect(isReactive(user)).toBe(false);
  });
});
