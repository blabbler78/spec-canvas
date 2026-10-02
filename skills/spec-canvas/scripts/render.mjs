import { createHash } from 'node:crypto';
export const hash = data => createHash('sha256').update(data).digest('hex');
export const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const text = (s, name, max = 160) => { if (typeof s !== 'string' || !s.trim() || s.length > max) throw new Error(`${name} must be nonempty text, at most ${max} characters`); return s; };
const number = (n, name, min, max) => { if (!Number.isFinite(n) || n < min || n > max) throw new Error(`${name} must be between ${min} and ${max}`); return n; };
export function validate(data) {
  if (!data || Array.isArray(data) || typeof data !== 'object') throw new Error('diagram must be an object');
  text(data.title, 'title');
  if (!['flow','state','sequence','architecture','dependency'].includes(data.view)) throw new Error('unsupported view');
  if (data.theme !== undefined && !['light','dark'].includes(data.theme)) throw new Error('theme must be light or dark');
  if (data.description !== undefined) text(data.description, 'description', 400);
  if (data.view === 'sequence') {
    if (!Array.isArray(data.lanes) || data.lanes.length < 2 || data.lanes.length > 12) throw new Error('sequence needs 2–12 lanes');
    const ids = new Set();
    for (const lane of data.lanes) { text(lane.id,'lane id',64);text(lane.label,'lane label',30);if(ids.has(lane.id)) throw new Error('duplicate lane id'); ids.add(lane.id); }
    if (!Array.isArray(data.messages) || data.messages.length < 1 || data.messages.length > 60) throw new Error('sequence needs 1–60 messages');
    for (const m of data.messages) {if(!ids.has(m.from)||!ids.has(m.to))throw new Error('unknown message lane');text(m.label,'message label',80);if(m.return!==undefined&&typeof m.return!=='boolean')throw new Error('return must be boolean');}
  } else {
    number(data.width ?? 1000, 'width', 400, 4000); number(data.height ?? 600,'height',200,4000);
    if (!Array.isArray(data.nodes) || data.nodes.length < 1 || data.nodes.length > 80) throw new Error('graph needs 1–80 nodes');
    const ids = new Set();
    for(const n of data.nodes){text(n.id,'node id',64);text(n.label,'node label',70);if(ids.has(n.id))throw new Error('duplicate node id');ids.add(n.id);number(n.x,'node x',10,(data.width??1000)-230);number(n.y,'node y',90,(data.height??600)-90);}
    if (!Array.isArray(data.edges) || data.edges.length > 160) throw new Error('graph needs an edges array, at most 160');
    for(const e of data.edges){if(!ids.has(e.from)||!ids.has(e.to))throw new Error('unknown edge node');if(e.label!==undefined)text(e.label,'edge label',80);if(e.dashed!==undefined&&typeof e.dashed!=='boolean')throw new Error('dashed must be boolean');}
  }
  return data;
}
function wrap(s, limit){const words=s.split(/\s+/).flatMap(w=>w.match(new RegExp(`.{1,${limit}}`,'gu'))??[]);const out=[];let line='';for(const w of words){if(line&&(line+' '+w).length>limit){out.push(line);line=w;}else line+=(line?' ':'')+w;}if(line)out.push(line);return out;}
export function render(data) {
  validate(data);
  const dark=data.theme==='dark';const p=dark?{bg:'#111827',fg:'#f1f5f9',muted:'#aebed0',stroke:'#8dbbd5',surface:'#1e293b',line:'#50647b'}:{bg:'#ffffff',fg:'#173042',muted:'#526878',stroke:'#075985',surface:'#f1f7fb',line:'#b5c9d6'};
  const sequence=data.view==='sequence';const w=sequence?Math.max(1000,data.lanes.length*240):data.width??1000;const h=sequence?220+data.messages.length*90:data.height??600;
  const pieces=[];const add=s=>pieces.push(s);
  const rect=(x,y,ww,hh,fill=p.surface)=>`<rect x="${x}" y="${y}" width="${ww}" height="${hh}" rx="6" fill="${fill}" stroke="${p.line}"/>`;
  const txt=(x,y,s,size=17,anchor='start')=>`<text x="${x}" y="${y}" fill="${p.fg}" font-size="${size}" text-anchor="${anchor}">${escape(s)}</text>`;
  const label=(x,y,s,limit=30)=>wrap(s,limit).map((line,i)=>txt(x,y+i*21,line,16,'middle')).join('');
  const edgeLabel=(x,y,s,limit=28)=>wrap(s,limit).map((line,i)=>`<rect x="${x-line.length*4.4-5}" y="${y+i*21-16}" width="${line.length*8.8+10}" height="21" fill="${p.bg}"/>`+txt(x,y+i*21,line,16,'middle')).join('');
  const path=(d,dashed=false)=>`<path d="${d}" fill="none" stroke="${p.stroke}" stroke-width="2"${dashed?' stroke-dasharray="7 5"':''} marker-end="url(#arrow)"/>`;
  add(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title desc"><title id="title">${escape(data.title)}</title><desc id="desc">${escape(data.description??data.view+' diagram')}</desc><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10Z" fill="${p.stroke}"/></marker></defs><style>text{font-family:system-ui,sans-serif}</style><rect width="${w}" height="${h}" fill="${p.bg}"/>`);
  add(txt(28,42,data.title,26));add(txt(28,70,data.view.toUpperCase(),13));
  if(sequence){const positions=new Map();data.lanes.forEach((lane,i)=>{const x=120+i*(w-240)/(data.lanes.length-1);positions.set(lane.id,x);add(rect(x-100,95,200,54));add(txt(x,128,lane.label,17,'middle'));add(`<path d="M${x} 150V${h-25}" stroke="${p.line}" stroke-dasharray="5 6"/>`);});data.messages.forEach((m,i)=>{const x1=positions.get(m.from),x2=positions.get(m.to),y=215+i*90;if(x1===x2){add(path(`M${x1} ${y}h65v30h-65`,m.return));add(edgeLabel(x1+(x1>w-260?-135:135),y-15,`${i+1}. ${m.label}`,25));}else{add(path(`M${x1} ${y}H${x2}`,m.return));add(label((x1+x2)/2,y-30,`${i+1}. ${m.label}`,Math.max(20,Math.floor(Math.abs(x2-x1)/8))));}});
  }else{
    const nodes=new Map(data.nodes.map(n=>[n.id,n]));
    for(const e of data.edges){const a=nodes.get(e.from),b=nodes.get(e.to);const ax=a.x+110,ay=a.y+35,bx=b.x+110,by=b.y+35;let d,lx,ly;
      if(a===b){d=`M${a.x+160} ${a.y}v-30h-100v30`;lx=ax;ly=a.y-42;}
      else if(Math.abs(bx-ax)>=Math.abs(by-ay)){const x1=ax+(bx>ax?110:-110),x2=bx+(bx>ax?-110:110);d=`M${x1} ${ay}L${x2} ${by}`;lx=(x1+x2)/2;ly=(ay+by)/2-13;}
      else{const y1=ay+(by>ay?35:-35),y2=by+(by>ay?-35:35);d=`M${ax} ${y1}L${bx} ${y2}`;lx=(ax+bx)/2+75;ly=(y1+y2)/2;}
      add(path(d,e.dashed));if(e.label)add(edgeLabel(lx,ly,e.label,28));
    }
    for(const n of data.nodes){add(rect(n.x,n.y,220,70));const ls=wrap(n.label,25);add(label(n.x+110,n.y+37-(ls.length-1)*10,n.label,25));}
  }
  add('</svg>');const svg=pieces.join('\n');
  const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(data.title)}</title><style>:root{color-scheme:${dark?'dark':'light'}}html,body{background:${p.bg};color:${p.fg}}body{margin:0;padding:28px;font:16px/1.6 system-ui,sans-serif}main{max-width:${w}px;margin:auto}.diagram{overflow:auto}svg{display:block;width:100%;height:auto;min-width:700px;background:${p.bg}}p{max-width:90ch;color:${p.muted}}a{color:${p.stroke}}</style></head><body><main><div class="diagram">${svg}</div><p>${escape(data.description??'Generated from supplied diagram data. Diagram content is not runtime evidence.')}</p></main></body></html>`;
  return {svg,html};
}
