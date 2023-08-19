import { Option,None } from "../mod.ts";
import { Vec } from "../mod.ts";


export type Enumerate<T>=Iterable<[index: number,item: T]>;



export abstract class Iter<T> implements Iterable<T> {
  abstract next(): T;
  abstract [Symbol.iterator](): Iterator<T>;
   
  public forEach(f: (value: T,index: number,iter: this)=> void) {
    let i=0;
    for(const iterator of this) {
      f(iterator,i++,this);
    }
  }

  public toArray() {
    return [...this];
  }
  
  public *enumerate(): Enumerate<T> {
    let i=0;
    for(const iterator of this) yield [i++,iterator];
  }
  
  public reduce(f: (prev: T,current: T,index: number)=> Option<T>|T): Option<T> {
    let folded: Option<T>=None(null);
    let i=0;

    for(const iterator of this) {
      const fold=f(folded.or(iterator),this.next(),++i);
      folded=fold instanceof Option?fold:new Option(fold);
    }
    
    return folded;
  }

  public filter(fn: (element: T,index: number)=> boolean) {
    const filtered=new Vec;

    for(const [index,element] of this.enumerate()) {
      if(!fn(element,index)) continue;
      filtered.push(element);
    }

    return filtered;
  }

  public map<O>(fn: (element: T,index: number)=> O) {
    const map=new Vec;

    for(const [index,element] of this.enumerate()) {
      map.push(fn(element,index));
    }
    
    return map;
  }
  
  public toVec() {
    return new Vec(...this);
  }
}
