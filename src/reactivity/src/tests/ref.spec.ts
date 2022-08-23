import { effect } from "../effect";
import { ref } from "../ref";

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


});
