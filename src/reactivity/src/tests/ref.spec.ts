import { effect } from "../effect";
import { reactive } from "../reactive";
import { isRef, ref, unRef, proxyRefs } from "../ref";

describe("实现ref功能", () => {
  it("happy path", () => {
    const observed = ref(1);
    expect(observed.value).toBe(1);
  });

  it("should be reactive", () => {
    const a = ref(1);
    let dummy;
    let calls = 0;
    effect(() => {
      calls++;
      dummy = a.value;
    });
    expect(calls).toBe(1);
    expect(dummy).toBe(1);
    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);
    // same value should not trigger
    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);
  });

  it("isRef", () => {
    const observed = ref(2);
    const reactiveObserved = reactive({ a: 1 });
    expect(isRef(observed)).toBe(true);
    expect(isRef(1)).toBe(false);
    expect(isRef(reactiveObserved)).toBe(false);
  });

  it("unRef", () => {
    const observed = ref(1);
    expect(unRef(observed)).toBe(1);
    expect(unRef(1)).toBe(1);
  });

  it("proxyRefs", () => {
    const user = {
      age: ref(10),
      name: "xiaohong",
    };
    const proxyUser = proxyRefs(user);
    expect(user.age.value).toBe(10);
    expect(proxyUser.age).toBe(10);
    expect(proxyUser.name).toBe("xiaohong");

    (proxyUser as any).age = 20;
    expect(proxyUser.age).toBe(20);
    expect(user.age.value).toBe(20);

    proxyUser.age = ref(10);
    expect(proxyUser.age).toBe(10);
    expect(user.age.value).toBe(10);
  });
});
