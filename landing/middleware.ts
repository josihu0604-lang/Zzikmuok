import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
const BUCKET=new Map<string,{c:number,r:number}>(); const LIMIT=10, WINDOW=10_000;
export function middleware(req:NextRequest){
  if(req.nextUrl.pathname.startsWith('/api/')){
    const ip=req.ip??'127.0.0.1', now=Date.now(); const e=BUCKET.get(ip);
    if(!e||now>e.r) BUCKET.set(ip,{c:1,r:now+WINDOW});
    else { e.c++; if(e.c>LIMIT)
      return new NextResponse(JSON.stringify({error:'Too many requests'}),{status:429,headers:{'content-type':'application/json'}});
    }
  }
  return NextResponse.next();
}
export const config={ matcher:['/((?!_next|.*\\..*).*)'] };
