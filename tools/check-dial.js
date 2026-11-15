#!/usr/bin/env node
/* pH Dial checks: runs the DIAL-LOGIC block of index.html in Node and compares every amino acid,
   stop and apply pairing with a group-by-group model written independently here.
   Usage: node tools/check-dial.js */
const fs=require('fs'),vm=require('vm'),path=require('path');
const src=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const i=src.indexOf('const AA = {'),j=src.indexOf('};',i)+2;
const a=src.indexOf('/*DIAL-LOGIC-START'),b=src.indexOf('/*DIAL-LOGIC-END*/');
const ctx={Math,Object,Array,String,JSON,console};vm.createContext(ctx);
vm.runInContext(src.slice(i,j)+'\n'+src.slice(a,b)+'\nthis.AA=AA;this.dialSpec=dialSpec;this.dialNet=dialNet;this.dialStops=dialStops;this.dialGroups=dialGroups;this.DIAL_EXPLAIN=DIAL_EXPLAIN;',ctx);
/* independent model. Ionizable groups: α-NH3+/NH2, α-COOH/COO−, plus Asp/Glu side-chain COOH and Lys/Arg side-chain N.
   strong acid: every group protonated. strong base: every group deprotonated. pH 7.4: NH3+, COO−, Asp/Glu −, Lys/Arg +.
   pI (neutral and acidic only): net 0, with Asp/Glu side chain protonated. */
const SIDE={'aspartic acid':'acid','glutamic acid':'acid',lysine:'base',arginine:'base'};
function ref(name,stop){const s=SIDE[name];let q=0;
 if(stop==='acid')q=1+(s==='base'?1:0);
 else if(stop==='base')q=-1-(s==='acid'?1:0);
 else if(stop==='zwit')q=s==='acid'?-1:s==='base'?1:0;
 else if(stop==='pi'){if(s==='base')throw new Error('no pI stop for basic');q=0;}
 return q;}
/* game's own form charges (formCharge) must agree too */
const fcA=src.indexOf('function formCharge(');const fcSrc=src.slice(fcA,src.indexOf('\n',src.indexOf("if (f === 'base')",fcA))+1);
const fc=new Function('AA','aaCharge',fcSrc+';return formCharge;')(ctx.AA,n=>(ctx.AA[n][1]==='acidic'?-1:ctx.AA[n][1]==='basic'?1:0));
let fails=0,checks=0;const ok=(c,m)=>{checks++;if(!c){fails++;if(fails<30)console.log('FAIL',m)}};
const sg=q=>q>0?'+'+q:q<0?'−'+Math.abs(q):'0';
const names=Object.keys(ctx.AA);ok(!names.includes('histidine'),'histidine is in the list: its charge at 7.4 is outside this model');
let n=0;
for(const name of names){const stops=ctx.dialStops(name);
 ok(stops[0]==='acid'&&stops[stops.length-1]==='base'&&stops.includes('zwit'),name+': stops');
 ok((SIDE[name]==='base')===!stops.includes('pi'),name+': pI stop only for neutral and acidic');
 for(const st of stops){const net=ctx.dialNet(name,st);ok(net===ref(name,st),name+' '+st+': '+net+' vs '+ref(name,st));
  const gameForm=st==='pi'&&ctx.AA[name][1]!=='acidic'?'zwit':st;ok(fc(name,gameForm)===net,name+' '+st+': disagrees with the drawing\'s formCharge');
  const g=ctx.dialGroups(name,st);ok(g.length===(SIDE[name]?3:2),name+': group count');
  ok(g.every(x=>(x[1]>0)===/⁺|\(\+\)/.test(x[0])&&(x[1]<0)===/⁻/.test(x[0])),name+' '+st+': group label sign disagrees with its charge');}
 for(const target of stops.filter(s=>s!=='zwit'))for(let r=0;r<40;r++){const s=ctx.dialSpec(name,target);n++;
  ok(s.q0===ref(name,'zwit')&&s.q1===ref(name,target)&&s.predict.answer===sg(s.q1),name+'→'+target+': prediction key');
  ok(s.other!==name&&ctx.dialStops(s.other).includes(target),name+'→'+target+': apply amino acid '+s.other+' has no such stop');
  ok(s.apply.answer===sg(ref(s.other,target)),name+'→'+target+': apply key');
  ok(s.opts.includes(s.predict.answer)&&s.opts.includes(s.apply.answer),name+': answers among the options');
  const ex=s.explain;ok(ex.options.some(o=>o.key===ex.answer)&&ex.options.filter(o=>o.key!==ex.answer).every(o=>ex.why[o.key]),name+'→'+target+': explain feedback');
  ok(!/pK|NaN|undefined|the pi\b|its pi\b/.test(JSON.stringify(s)),name+': pKa or junk text (course rule: no pKa numbers)');}}
console.log(checks+' checks on '+names.length+' amino acids, '+n+' dial questions: '+(fails?fails+' FAILED':'all passed'));process.exit(fails?1:0);
