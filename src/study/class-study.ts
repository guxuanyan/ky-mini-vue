

export class animal {

  private gender = 2

  constructor(public name: string, public sex: number) {
    console.log('实例化');
  }
  __run(){
    // 执行函数
    return this.name
  }


}



