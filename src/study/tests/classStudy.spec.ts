
import { animal } from '../class-study'

describe('学习ts类', ()=>{

  it('实例化时公共参数', ()=>{
    const dog = new animal('小明', 15)
    expect(dog.__run()).toBe('小明')
  })
  // it('private property', ()=>{
  //   const dog = new animal('小明', 15)
  // })
})