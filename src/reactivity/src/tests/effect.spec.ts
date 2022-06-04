import { reactive } from "../reactive";
import { effect, stop } from "../effect";

describe('effect', () => {
    it("effect hellw path", () => {
        const user = reactive({ age: 10 })
        let nextAge
        effect(() => {
            nextAge = user.age + 1
        })
        expect(nextAge).toBe(11)
        // update
        user.age++
        expect(nextAge).toBe(12)
    })
    it("return runner. get runner return content", () => {
        const user = reactive({
            age: 10
        })
        let age;
        const runner = effect(() => {
            age = user.age + 1
            return "age：" + age
        })
        user.age++
        expect(age).toBe(12)
        // 调用拿到 effect  fn 的返回值
        expect(runner()).toBe("age：12")
    })
    it("scheduler", () => {
        const user = reactive({
            age: 10
        })
        let age;
        const scheduler = jest.fn(() => {
            age = runner()
        })
        const runner = effect(() => {
            age = user.age + 1
            return 200
        },
            { scheduler }
        )
        expect(age).toBe(11)
        // 更新的时候执行 scheduler
        user.age = 22
        expect(scheduler).toBeCalledTimes(1)
        expect(age).toBe(200)
    })
    it("stop", () => {
        let dummy;
        const obj = reactive({ prop: 1 });
        const runner = effect(() => {
            dummy = obj.prop;
        });
        obj.prop = 2;
        expect(dummy).toBe(2);
        stop(runner);

        obj.prop = 3;
        expect(dummy).toBe(2);


        // stopped effect should still be manually callable
        runner();
        expect(dummy).toBe(3);
    });

    it("onStop", () => {
        const obj = reactive({
            foo: 1,
        });
        const onStop = jest.fn();
        let dummy;
        const runner = effect(
            () => {
                dummy = obj.foo;
            },
            {
                onStop,
            }
        );

        stop(runner);
        expect(onStop).toBeCalledTimes(1);
    });
})