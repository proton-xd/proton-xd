// deno-lint-ignore-file
import { Result } from "./result.ts";
import { AsyncException } from '../async_exception.ts';
import { Option } from "../mod.ts";


export class AsyncResult<T,E> extends Promise<Result<T,E>> {
  constructor(res: Promise<Result<T,E>>) {
    super(resolve=> resolve(res));
  }

  /**
   * Returns `Err` if the value is `Err`,otherwise returns {@linkcode optb}.
   * 
   * Arguments passed to {@linkcode and} are eagerly evaluated; if you are passing the result of a function call, it is recommended to use {@linkcode andThen}.
   * 
   * # Example
   * ```ts
   * const x=Ok(0);
   * const y=Ok(69)
   * $assertEq(x.and(y),Ok(69));
   * ```
   */
  public and(optb: Result<T,E>) {
    return new AsyncResult(this.then(res=> res.and(optb)));
  }

  /**
   * Returns `Err` if the option is `Err`, otherwise calls {@linkcode f} with the wrapped value and returns the result.
   * 
   * Some languages call this operation `flatmap`.
   * 
   * # Example
   * ```ts
   * const xd=Ok("xd");
   * $assertEq(xd.andThen(x=> Ok("69")),Ok("69"));
   * ```
   */
  public andThen(f: (xd: T)=> Result<T,E>) {
    return new AsyncResult(this.then(res=> res.andThen(f)));
  }

  /**
   * Returns the {@linkcode Result} if it contains a value,otherwise returns {@linkcode optb}.
   * 
   * # Example
   * ```ts
   * const xd=Err("im an Err");
   * $assertEq(xd.or(Ok(69)),Ok(69));
   * ```
   */
  public or(optb: Result<T,E>) {
    return new AsyncResult(this.then(res=> res.or(optb)));
  }

  /**
   * Returns the {@linkcode Result} if it contains a value, otherwise calls {@linkcode f} and returns the result.
   * 
   * # Example
   * ```ts
   * const xd=Err("im an Err..xd");
   * $assertEq(xd.orElse(()=> Ok(69)),Ok(69));
   * ```
   */
  public orElse(f: (err: E)=> Result<T,E>) {
    return new AsyncResult(this.then(res=> res.orElse(f)));
  }

  public async err() {
    return (await this).err();
  }

  public async ok() {
    return (await this).ok();
  }

  /**
   * Returns the contained `Ok` value.
   * 
   * # Panics
   * Panics if the value is a `Err` with a custom panic message provided by {@linkcode msg}.
   * 
   * # Example
   * ```ts
   * const xd=Ok(69);
   * console.log(xd.expect("xd is an Err"));
   * ```
   */
  public async expect(msg: string) {
    return (await this).expect(msg);
  }

  /**
   * Returns the contained `Err` value.
   * 
   * # Panics
   * Panics if the value is a `Ok` with a custom {@linkcode callback}.
   * 
   * # Example
   * ```ts
   * const xd=Ok(69);
   * xd.expectNone(()=> $panic("xd is Ok"));
   * ```
   */
  public async expectErr(callback: (s: T)=> never) {
    return (await this).expectErr(callback);
  }

  /**
   * Returns whether the object contains a `Ok` value.
   */
  public async contains() {
    return (await this).contains();
  }

  /**
   * Returns whether the object contains a `Err` value.
   */
  public async containsErr() {
    return (await this).containsErr();
  }

  /**
   * Inserts the given `Ok` value in the current {@linkcode Result}
   * # Example
   * ```ts
   * const xd=Err("Err");
   * $assertEq(xd.insert(69),Ok(69));
   * ```
   */
  public async insert(ok: T) {
    (await this).insert(ok)
  }

  /**
   * Returns the contained `Ok` value or Inserts the given `Ok` value in the current {@linkcode Result} and returns it
   * # Example
   * ```ts
   * const xd=Err("Err");
   * $assertEq(xd.getOrInsert(69),Ok(69));
   * ```
   */
  public async getOrInsert(ok: T) {
    return (await this).getOrInsert(ok);
  }

  /**
   * Returns the contained `Ok` value.
   * 
   * Because this function may panic, its use is generally discouraged. Instead, prefer to use pattern matching and handle the None case explicitly, or call {@linkcode unwrapOr}, {@linkcode unwrapOrElse}.
   * # Panics
   * Panics if the self value equals `Err`.
   * # Example
   * ```ts
   * const xd=Ok(69);
   * $assertEq(xd.unwrap(),69);
   * ```
   */
  public async unwrap() {
    return (await this).unwrap();
  }

  /**
   * Returns the contained `Ok` value or a provided default {@linkcode optb}.
   * 
   * Arguments passed to {@linkcode unwrapOr} are eagerly evaluated.
   * 
   * If you are passing the result of a function call, it is recommended to use {@linkcode unwrapOrElse}.
   * 
   * # Example
   * ```ts
   * const xd=Err("Err");
   * $assertEq(xd.unwrapOr(69),Ok(69));
   * ```
   */
  public async unwrapOr(optb: T) {
    return (await this).unwrapOr(optb);
  }

  /**
   * Returns the contained `Ok` value or if the value is `Err` calls {@linkcode f} and returns the result.
   * # Example
   * ```ts
   * const xd=Err("Err");
   * $assertEq(xd.unwrapOrElse(()=> Ok(69)),Ok(69));
   * ```
   */
  public async unwrapOrElse(f: (err: E) => T) {
    return (await this).unwrapOrElse(f);
  }

  /**
   * Returns the contained value without checking it.
   * 
   * #### It may lead the code to undefined behavior.
   */
  public async unwrapUnchecked() {
    return (await this).unwrapUnchecked();
  }
}

