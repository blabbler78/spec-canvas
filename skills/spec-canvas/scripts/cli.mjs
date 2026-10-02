#!/usr/bin/env node
import { cp, mkdir, readFile, writeFile, lstat, realpath } from 'node:fs/promises';
import { resolve, relative, dirname, join, isAbsolute, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline/promises';
import { render, hash } from './render.mjs';
const skill=resolve(dirname(fileURLToPath(import.meta.url)),'..');
async function exists(p){try{await lstat(p);return true;}catch(e){if(e.code==='ENOENT')return false;throw e;}}
function assertInside(root,target){const rel=relative(root,target);if(!rel||rel==='..'||rel.startsWith('..'+(process.platform==='win32'?'\\':'/'))||isAbsolute(rel))throw new Error('path must stay inside project');}
export async function safePath(root, name){
  if(typeof name!=='string'||!name.trim()||isAbsolute(name))throw new Error('use a relative project path');
  root=await realpath(root);const target=resolve(root,name),rel=relative(root,target);assertInside(root,target);
  let part=root;for(const component of rel.split(/[\\/]/)){part=join(part,component);if(await exists(part)){const stat=await lstat(part);if(stat.isSymbolicLink())throw new Error('symlink paths are not supported');}}
  return target;
}
async function safeInstallPath(root,name){
  if(typeof name!=='string'||!name.trim()||isAbsolute(name))throw new Error('use a relative project path');
  root=await realpath(root);const target=resolve(root,name);assertInside(root,target);
  const parts=relative(root,target).split(/[\\/]/);let part=root;
  for(let i=0;i<parts.length;i++){
    const next=join(part,parts[i]);
    if(!await exists(next)){part=join(part,...parts.slice(i));break;}
    const stat=await lstat(next);
    if(stat.isSymbolicLink()){part=await realpath(next);assertInside(root,part);}
    else{if(i<parts.length-1&&!stat.isDirectory())throw new Error('installation path crosses a non-directory');part=next;}
  }
  assertInside(root,part);return part;
}
export function parseAgentChoice(value){
  const choice=String(value??'').trim().toLowerCase();
  const agents={"":'both','1':'both','both':'both','2':'claude','claude':'claude','3':'codex','codex':'codex'};
  if(!(choice in agents))throw new Error('choose 1, 2, or 3 (both, claude, or codex)');
  return agents[choice];
}
async function askAgent(rl){
  const prompt='\nWhere should Spec Canvas be installed?\n  1. Both Claude Code and Codex (recommended)\n  2. Claude Code only\n  3. Codex only\nChoose 1, 2, or 3 [1]: ';
  for(;;){try{return parseAgentChoice(await rl.question(prompt));}catch(error){console.error(error.message);}}
}
export function parse(argv){const [command='help',...rest]=argv;const opts={};for(let i=0;i<rest.length;i++){const arg=rest[i];if(!arg.startsWith('--'))throw new Error(`unexpected argument ${arg}`);const key=arg.slice(2);if(['yes','force'].includes(key)){opts[key]=true;}else{if(!rest[i+1]||rest[i+1].startsWith('--'))throw new Error(`missing value for ${arg}`);opts[key]=rest[++i];}}return{command,opts};}
async function writeNew(files,force){for(const [f]of files){if(await exists(f)&&!force)throw new Error(`file exists: ${f}; use --force only for generated files`);}for(const[f,data]of files){await mkdir(dirname(f),{recursive:true});await writeFile(f,data);}}
export async function init(root, opts={}){
  let agent=opts.agent,out=opts.out??'.ai/specs';
  if(!opts.yes&&process.stdin.isTTY&&(!agent||opts.out===undefined)){const rl=createInterface({input:process.stdin,output:process.stdout});try{if(!agent)agent=await askAgent(rl);if(opts.out===undefined)out=(await rl.question(`Documentation directory? [${out}] `)).trim()||out;}finally{rl.close();}}
  agent??='both';if(!['claude','codex','both'].includes(agent))throw new Error('agent must be claude, codex or both');
  const output=await safePath(root,out);const targets=agent==='both'?['.claude/skills/spec-canvas','.agents/skills/spec-canvas']:agent==='claude'?['.claude/skills/spec-canvas']:['.agents/skills/spec-canvas'];
  const config=await safePath(root,'.spec-canvas.json'),template=await safePath(root,'.spec-canvas/templates/spec.md');
  const folders=[...new Set(await Promise.all(targets.map(t=>safeInstallPath(root,t))))];
  for(const p of [config,template,...folders])if(await exists(p))throw new Error(`installation target already exists: ${p}; no files changed`);
  await mkdir(output,{recursive:true});for(const f of folders){await mkdir(dirname(f),{recursive:true});await cp(skill,f,{recursive:true});}
  await writeNew([[template,await readFile(join(skill,'assets/spec.md'),'utf8')],[config,JSON.stringify({version:1,outputDirectory:out,documentTemplate:'.spec-canvas/templates/spec.md',theme:'light',language:'en'},null,2)+'\n']],false);
  console.log(`Installed for ${agent}. Documents: ${out}. Use /spec-canvas in Claude Code or $spec-canvas in Codex. Restart or reload skill discovery if needed.`);
}
export async function renderFile(root,opts){
  if(!opts.input||!opts.output)throw new Error('render needs --input and --output');
  if(extname(opts.output)!=='.html')throw new Error('output must end in .html');
  const input=await safePath(root,opts.input),output=await safePath(root,opts.output),svg=await safePath(root,relative(root,output.slice(0,-5)+'.svg')),meta=await safePath(root,relative(root,output.slice(0,-5)+'.meta.json'));
  const raw=await readFile(input,'utf8');const data=JSON.parse(raw);if(opts.theme)data.theme=opts.theme;
  const result=render(data);const metadata={version:1,renderer:'spec-canvas 0.1.2',input:relative(root,input).split('\\').join('/'),inputSha256:hash(raw),theme:data.theme??'light',view:data.view,artifacts:{[relative(root,output).split('\\').join('/')]:hash(result.html),[relative(root,svg).split('\\').join('/')]:hash(result.svg)},runtimeVerified:false};
  await writeNew([[output,result.html],[svg,result.svg],[meta,JSON.stringify(metadata,null,2)+'\n']],opts.force);console.log(`Wrote ${opts.output}, SVG and metadata. Content comes from input, not code analysis.`);
}
export async function check(root,opts){if(!opts.meta)throw new Error('check needs --meta');const m=JSON.parse(await readFile(await safePath(root,opts.meta),'utf8'));if(m.version!==1||typeof m.input!=='string'||!m.artifacts||Object.keys(m.artifacts).length!==2)throw new Error('invalid metadata');if(hash(await readFile(await safePath(root,m.input)))!==m.inputSha256)throw new Error('diagram input changed; rerender');for(const[f,h]of Object.entries(m.artifacts)){if(hash(await readFile(await safePath(root,f)))!==h)throw new Error(`artifact changed: ${f}`);}console.log('PASS input and artifact hashes. This check does not verify source behavior or visual quality.');}
export async function scaffold(root,opts){if(!opts.title||!opts.output)throw new Error('scaffold needs --title and --output');let config={};const c=await safePath(root,'.spec-canvas.json');if(await exists(c))config=JSON.parse(await readFile(c,'utf8'));const template=opts.template??config.documentTemplate;const raw=template?await readFile(await safePath(root,template),'utf8'):await readFile(join(skill,'assets/spec.md'),'utf8');const title=opts.title.replace(/[\r\n]/g,' ');await writeNew([[await safePath(root,opts.output),raw.replace(/{{(title|date)}}/g,(_,key)=>key==='title'?title:new Date().toISOString().slice(0,10))]],opts.force);console.log('Created document scaffold. The agent must fill evidence and remove unused sections.');}
export async function main(argv=process.argv.slice(2)){
  const {command,opts}=parse(argv);const allowed={help:[],init:['project','agent','out','yes'],render:['project','input','output','theme','force'],check:['project','meta'],scaffold:['project','title','output','template','force'],doctor:['project']};
  if(!(command in allowed))throw new Error(`unknown command ${command}`);for(const key of Object.keys(opts))if(!allowed[command].includes(key))throw new Error(`unknown option --${key}`);
  const root=await realpath(resolve(opts.project??process.cwd()));
  if(command==='help'){console.log('Spec Canvas 0.1.2\ninit [--agent claude|codex|both] [--out .ai/specs] [--yes]\nrender --input graph.json --output graph.html [--theme light|dark] [--force]\ncheck --meta graph.meta.json\nscaffold --title "Name" --output .ai/specs/name.md [--template path.md]\ndoctor\nAll commands accept --project path. Manual skill use needs no Node.js.');return;}
  if(command==='init')return init(root,opts);if(command==='render')return renderFile(root,opts);if(command==='check')return check(root,opts);if(command==='scaffold')return scaffold(root,opts);
  console.log(`Node ${process.version}; no third-party CLI dependencies.\nProject: ${root}\nConfig: ${await exists(join(root,'.spec-canvas.json'))?'present':'not installed'}\nAn existing agent performs generation; browser export is optional and not bundled.`);
}
if(process.argv[1]&&await realpath(process.argv[1]).catch(()=>undefined)===fileURLToPath(import.meta.url))main().catch(e=>{console.error(`spec-canvas: ${e.message}`);process.exitCode=1;});
