// Generador de QR tomado de app_clein (lib/qr.ts). Pendiente: licencia o cesión escrita del autor.
/** Generador de códigos QR (modo bytes, corrección M, versiones 1–10). Sin dependencias.
 *  qrMatrix('https://…') devuelve una matriz de booleanos (true = módulo oscuro). */
const ECC_M=[10,16,26,18,24,16,18,22,22,26];      // palabras de corrección por bloque, versiones 1..10
const BLOCKS_M=[1,1,1,2,2,4,4,4,5,5];             // bloques, versiones 1..10
const rawModules=(v:number)=>{let r=(16*v+128)*v+64;if(v>=2){const a=Math.floor(v/7)+2;r-=(25*a-10)*a-55;if(v>=7)r-=36}return r};
const dataWords=(v:number)=>Math.floor(rawModules(v)/8)-ECC_M[v-1]*BLOCKS_M[v-1];
const gfMul=(x:number,y:number)=>{let z=0;for(let i=7;i>=0;i--){z=(z<<1)^((z>>>7)*0x11d);z^=((y>>>i)&1)*x}return z};
const rsDivisor=(deg:number)=>{const r:number[]=new Array(deg).fill(0);r[deg-1]=1;let root=1;for(let i=0;i<deg;i++){for(let j=0;j<r.length;j++){r[j]=gfMul(r[j],root);if(j+1<r.length)r[j]^=r[j+1]}root=gfMul(root,2)}return r};
const rsRemainder=(data:number[],div:number[])=>{const r:number[]=div.map(()=>0);for(const b of data){const f=b^(r.shift() as number);r.push(0);div.forEach((c,i)=>{r[i]^=gfMul(c,f)})}return r};
const bit=(x:number,i:number)=>((x>>>i)&1)!==0;
function utf8(s:string):number[]{const out:number[]=[];const enc=unescape(encodeURIComponent(s));for(let i=0;i<enc.length;i++)out.push(enc.charCodeAt(i));return out}

export function qrMatrix(text:string):boolean[][]{
  const bytes=utf8(text);let ver=1;
  for(;ver<=10;ver++){const cc=ver<10?8:16;if(4+cc+8*bytes.length<=dataWords(ver)*8)break}
  if(ver>10)throw new Error('Texto demasiado largo para el QR');
  // 1) datos
  const bits:number[]=[];const put=(v:number,n:number)=>{for(let i=n-1;i>=0;i--)bits.push((v>>>i)&1)};
  put(4,4);put(bytes.length,ver<10?8:16);bytes.forEach(b=>put(b,8));
  const cap=dataWords(ver)*8;put(0,Math.min(4,cap-bits.length));while(bits.length%8)bits.push(0);
  const data:number[]=[];for(let i=0;i<bits.length;i+=8){let v=0;for(let j=0;j<8;j++)v=(v<<1)|bits[i+j];data.push(v)}
  for(let pad=0xec;data.length<dataWords(ver);pad^=0xec^0x11)data.push(pad);
  // 2) corrección de errores e intercalado
  const nb=BLOCKS_M[ver-1],eccLen=ECC_M[ver-1],raw=Math.floor(rawModules(ver)/8),nShort=nb-raw%nb,shortLen=Math.floor(raw/nb);
  const div=rsDivisor(eccLen),blocks:number[][]=[];
  for(let i=0,k=0;i<nb;i++){const dat=data.slice(k,k+shortLen-eccLen+(i<nShort?0:1));k+=dat.length;const ecc=rsRemainder(dat,div);if(i<nShort)dat.push(0);blocks.push(dat.concat(ecc))}
  const all:number[]=[];for(let i=0;i<blocks[0].length;i++)for(let j=0;j<blocks.length;j++)if(i!==shortLen-eccLen||j>=nShort)all.push(blocks[j][i]);
  // 3) matriz
  const size=ver*4+17;
  const mod:boolean[][]=Array.from({length:size},()=>new Array(size).fill(false));
  const fn:boolean[][]=Array.from({length:size},()=>new Array(size).fill(false));
  const setF=(x:number,y:number,v:boolean)=>{mod[y][x]=v;fn[y][x]=true};
  for(let i=0;i<size;i++){setF(6,i,i%2===0);setF(i,6,i%2===0)}
  const finder=(cx:number,cy:number)=>{for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){const d=Math.max(Math.abs(dx),Math.abs(dy)),x=cx+dx,y=cy+dy;if(x>=0&&x<size&&y>=0&&y<size)setF(x,y,d!==2&&d!==4)}};
  finder(3,3);finder(size-4,3);finder(3,size-4);
  const na=ver===1?0:Math.floor(ver/7)+2,pos:number[]=[];
  if(na){const step=Math.ceil((ver*4+4)/(na*2-2))*2;pos.push(6);for(let p=size-7;pos.length<na;p-=step)pos.splice(1,0,p)}
  pos.forEach((cx,i)=>pos.forEach((cy,j)=>{if((i===0&&j===0)||(i===0&&j===na-1)||(i===na-1&&j===0))return;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)setF(cx+dx,cy+dy,Math.max(Math.abs(dx),Math.abs(dy))!==1)}));
  const formatBits=(mask:number)=>{const d=mask;let r=d;for(let i=0;i<10;i++)r=(r<<1)^((r>>>9)*0x537);const b=((d<<10)|r)^0x5412;
    for(let i=0;i<=5;i++)setF(8,i,bit(b,i));setF(8,7,bit(b,6));setF(8,8,bit(b,7));setF(7,8,bit(b,8));for(let i=9;i<15;i++)setF(14-i,8,bit(b,i));
    for(let i=0;i<8;i++)setF(size-1-i,8,bit(b,i));for(let i=8;i<15;i++)setF(8,size-15+i,bit(b,i));setF(8,size-8,true)};
  formatBits(0);
  if(ver>=7){let r=ver;for(let i=0;i<12;i++)r=(r<<1)^((r>>>11)*0x1f25);const b=(ver<<12)|r;for(let i=0;i<18;i++){const c=bit(b,i),a=size-11+i%3,d=Math.floor(i/3);setF(a,d,c);setF(d,a,c)}}
  // colocar datos en zigzag
  let k=0;for(let right=size-1;right>=1;right-=2){if(right===6)right=5;for(let vert=0;vert<size;vert++)for(let j=0;j<2;j++){const x=right-j,up=((right+1)&2)===0,y=up?size-1-vert:vert;if(!fn[y][x]&&k<all.length*8){mod[y][x]=bit(all[k>>>3],7-(k&7));k++}}}
  const apply=(m:number)=>{for(let y=0;y<size;y++)for(let x=0;x<size;x++){if(fn[y][x])continue;let inv;
    switch(m){case 0:inv=(x+y)%2===0;break;case 1:inv=y%2===0;break;case 2:inv=x%3===0;break;case 3:inv=(x+y)%3===0;break;case 4:inv=(Math.floor(x/3)+Math.floor(y/2))%2===0;break;case 5:inv=x*y%2+x*y%3===0;break;case 6:inv=(x*y%2+x*y%3)%2===0;break;default:inv=((x+y)%2+x*y%3)%2===0}
    if(inv)mod[y][x]=!mod[y][x]}};
  const penalty=()=>{let p=0;
    for(let t=0;t<2;t++){for(let a=0;a<size;a++){let run=1;for(let b=1;b<size;b++){const cur=t?mod[b][a]:mod[a][b],prev=t?mod[b-1][a]:mod[a][b-1];if(cur===prev){run++;if(run===5)p+=3;else if(run>5)p++}else run=1}
      for(let b=0;b+10<size;b++){const w:boolean[]=[];for(let q=0;q<11;q++)w.push(t?mod[b+q][a]:mod[a][b+q]);const s=w.map(v=>v?'1':'0').join('');if(s==='10111010000'||s==='00001011101')p+=40}}}
    for(let y=0;y<size-1;y++)for(let x=0;x<size-1;x++){const c=mod[y][x];if(c===mod[y][x+1]&&c===mod[y+1][x]&&c===mod[y+1][x+1])p+=3}
    let dark=0;for(const row of mod)for(const v of row)if(v)dark++;p+=Math.floor(Math.abs(dark*20-size*size*10)/(size*size))*10;return p};
  let best=0,bestP=Infinity;
  for(let m=0;m<8;m++){apply(m);formatBits(m);const p=penalty();if(p<bestP){bestP=p;best=m}apply(m)}
  apply(best);formatBits(best);
  return mod;
}
/** Dibuja la matriz como SVG (cuadrícula con zona de silencio de 4 módulos). */
export function qrSvg(text:string,px=220):string{
  const m=qrMatrix(text),n=m.length,q=4,total=n+q*2;let d='';
  for(let y=0;y<n;y++){let x=0;while(x<n){if(m[y][x]){let w=1;while(x+w<n&&m[y][x+w])w++;d+=`M${x+q} ${y+q}h${w}v1h-${w}z`;x+=w}else x++}}
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="${px}" height="${px}" shape-rendering="crispEdges" role="img" aria-label="Código QR"><rect width="${total}" height="${total}" fill="#fff"/><path d="${d}" fill="#0F1B33"/></svg>`;
}
