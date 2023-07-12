import { Ok,Err,Result } from "../io/result.ts";


export async function fetchApi(inp: string|URL|Request,init?: RequestInit): Promise<Result<Response,Err>> {
  try {
    const res=await fetch(inp,init);
    if(!res.ok) throw res;
    return Ok(res);
  } catch(err) {
    return Err(err);
  }
}
