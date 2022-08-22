import { isReadonly, shallowReadonly } from "../reactive";

describe("shallowReadonly", () => {
  test("", () => {
    const v = shallowReadonly({
      n: {
        v: 132,
      },
    });

    expect(isReadonly(v)).toBe(true);
    expect(isReadonly(v.n)).toBe(false);
  });

  it("在修改的时候，抛出警告", () => {
    console.warn = jest.fn();
    const user = shallowReadonly({
      age: 18,
    });
    user.age = 20;
    expect(console.warn).toBeCalled();
  });
});
