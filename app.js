const $ = id => document.getElementById(id);
let deferredPrompt=null;
let logoData=''; let headerData='';

window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;$('installBtn').hidden=false;});
$('installBtn').addEventListener('click',async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$('installBtn').hidden=true;});
if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));

function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function num(id){return Number($(id).value||0)}
function txt(id){return $(id).value.trim()}
function money(n){return new Intl.NumberFormat('en-US',{maximumFractionDigits:0}).format(Number(n||0))}
function thb(n,fx){return Number(n||0)*Number(fx||0)}
function nowLabel(){return new Intl.DateTimeFormat('en-GB',{day:'2-digit',month:'short',year:'numeric'}).format(new Date()).toUpperCase()}
function ageBand(label,fallback){return label||fallback}
function fileToData(file){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file);});}
$('logoUpload').addEventListener('change',async e=>{if(e.target.files[0]){logoData=await fileToData(e.target.files[0]);renderPreview();}});
$('headerUpload').addEventListener('change',async e=>{if(e.target.files[0]){headerData=await fileToData(e.target.files[0]);renderPreview();}});

function getData(){
  const fx=num('fx');
  const q=n=>({
    title:txt(`q${n}title`),death:num(`q${n}death`),deathAge:num(`q${n}deathAge`),tpd:num(`q${n}tpd`),tpdAge:num(`q${n}tpdAge`),premEnd:num(`q${n}premEnd`),
    prem1:num(`q${n}prem1`),band1:txt(`q${n}band1`),prem2:num(`q${n}prem2`),band2:txt(`q${n}band2`)
  });
  return {nationality:txt('nationality'),gender:txt('gender'),age:num('age'),product:txt('product'),currency:txt('currency')||'SGD',fx,objective:txt('objective'),overview:txt('overview'),q1:q(1),q2:q(2),logoData,headerData,date:nowLabel()};
}

function brandMark(d){
  if(d.logoData) return `<img src="${d.logoData}" style="width:95px;height:60px;object-fit:contain">`;
  return `<div style="width:76px;height:54px;border:3px solid white;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900">✓</div>`;
}
function headerImage(d){
  if(d.headerData) return `<img src="${d.headerData}" style="width:100%;height:100%;object-fit:cover">`;
  return `<div style="width:100%;height:100%;background:linear-gradient(135deg,#fff4f5,#f8d9df);display:flex;align-items:center;justify-content:center;color:#c8102e;font-weight:800;font-size:22px">FINANCIAL PROTECTION FOR YOUR LOVED ONES</div>`;
}
function benefitCell(title,body,icon){return `<div style="display:flex;gap:10px;align-items:flex-start;padding:12px 14px"><div style="font-size:28px;color:#c8102e;width:38px">${icon}</div><div><div style="font-weight:800;color:#c8102e;font-size:13px">${title}</div><div style="font-size:11.5px;line-height:1.35;margin-top:4px">${body}</div></div></div>`}
function premiumBlock(q,d){
 const b1=`<b>${d.currency} ${money(q.prem1)}</b><br><span style="color:#c8102e;font-weight:800">≈ THB ${money(thb(q.prem1,d.fx))}</span>`;
 if(!q.prem2) return b1;
 return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><div>${esc(q.band1)}:<br>${b1}</div><div>${esc(q.band2)}:<br><b>${d.currency} ${money(q.prem2)}</b><br><span style="color:#c8102e;font-weight:800">≈ THB ${money(thb(q.prem2,d.fx))}</span></div></div>`;
}
function paymentText(q,d){
 if(q.prem2) return `Annual premium ${d.currency} ${money(q.prem1)} for ${esc(q.band1)}, then ${d.currency} ${money(q.prem2)} for ${esc(q.band2)}.`;
 return `Level annual premium payable until age ${q.premEnd}.`;
}
function thbPremiumBlock(q,d){
 if(!q.prem2) return `<div style="font-size:19px;font-weight:900;color:#c8102e">≈ THB ${money(thb(q.prem1,d.fx))}<br><span style="font-size:13px">per year</span></div>`;
 return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;color:#c8102e;font-weight:900"><div style="font-size:16px">≈ THB ${money(thb(q.prem1,d.fx))}<br><span style="font-size:11px">per year<br>${esc(q.band1)}</span></div><div style="font-size:16px">≈ THB ${money(thb(q.prem2,d.fx))}<br><span style="font-size:11px">per year<br>${esc(q.band2)}</span></div></div>`;
}

function proposalHTML(d){
return `<div xmlns="http://www.w3.org/1999/xhtml" style="width:794px;height:1123px;background:#fff;font-family:Arial,'Noto Sans Thai',sans-serif;color:#202428;overflow:hidden">
  <div style="height:126px;display:grid;grid-template-columns:220px 1fr 225px;position:relative">
    <div style="background:#c8102e;clip-path:polygon(0 0,100% 0,80% 100%,0 100%);padding:24px 24px;color:white">${brandMark(d)}</div>
    <div style="padding:22px 15px"><div style="font-size:31px;font-weight:900;color:#c8102e;line-height:1">INSURANCE PROPOSAL</div><div style="font-size:20px;font-weight:800;color:#39434d;margin-top:8px">${esc(d.product)}</div><div style="font-size:12px;font-style:italic;color:#58636d;margin-top:3px">Financial Protection for Your Loved Ones</div></div>
    <div style="overflow:hidden;border-bottom-left-radius:50px">${headerImage(d)}</div>
  </div>
  <div style="margin:0 22px 14px;border:1px solid #e1e4e7;border-radius:12px;box-shadow:0 3px 10px #0001;display:grid;grid-template-columns:1.05fr 1.25fr 1fr 1.25fr;min-height:104px">
    <div style="padding:15px;border-right:1px solid #ddd"><b style="color:#c8102e;font-size:11px">CLIENT PROFILE</b><div style="font-size:11.5px;line-height:1.55;margin-top:7px">${esc(d.nationality)} National<br>${esc(d.gender)}, Age ${d.age}</div></div>
    <div style="padding:15px;border-right:1px solid #ddd"><b style="color:#c8102e;font-size:11px">OBJECTIVE</b><div style="font-size:10.5px;line-height:1.45;margin-top:7px">${esc(d.objective)}</div></div>
    <div style="padding:15px;border-right:1px solid #ddd"><b style="color:#c8102e;font-size:11px">COVERAGE CURRENCY</b><div style="font-size:11.5px;margin-top:10px">${esc(d.currency)} (Singapore Dollar)</div></div>
    <div style="padding:15px"><b style="color:#c8102e;font-size:10.5px">EXCHANGE RATE (AS OF ${esc(d.date)})</b><div style="font-size:12px;margin-top:8px">1 SGD = ${d.fx.toFixed(2)} THB</div><div style="font-size:9px;font-style:italic;margin-top:7px">For illustration purposes only</div></div>
  </div>
  <div style="padding:0 27px">
    <div style="font-size:17px;font-weight:900;color:#c8102e;margin:4px 0 7px">▣ PLAN OVERVIEW</div>
    <div style="font-size:11.5px;line-height:1.4;margin-bottom:11px">${esc(d.overview)}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;background:#fff1f3;border-radius:12px;margin-bottom:12px">
      ${benefitCell('FINANCIAL PROTECTION','Provides a lump sum payout to your loved ones in the event of death or total permanent disability.','♥')}
      ${benefitCell('AFFORDABLE & FLEXIBLE','Choose the coverage term that best suits your needs and budget.','◆')}
      ${benefitCell('PEACE OF MIND','Focus on living your life today knowing your family is protected for tomorrow.','●')}
    </div>
    <div style="font-size:17px;font-weight:900;color:#c8102e;margin:5px 0 8px">⚖ QUOTATION COMPARISON</div>
    <table style="width:100%;border-collapse:collapse;font-size:10.6px;table-layout:fixed"><colgroup><col style="width:29%"><col style="width:35.5%"><col style="width:35.5%"></colgroup>
      <tr style="background:#c8102e;color:#fff"><th style="padding:10px;border:1px solid #e6a8b5">PLAN OPTION</th><th style="padding:10px;border:1px solid #e6a8b5">1) ${esc(d.q1.title).toUpperCase()}</th><th style="padding:10px;border:1px solid #e6a8b5">2) ${esc(d.q2.title).toUpperCase()}</th></tr>
      ${row('Death Benefit (Sum Assured)',`${d.currency} <b>${money(d.q1.death)}</b><br><span class="r">≈ THB ${money(thb(d.q1.death,d.fx))}</span>`,`${d.currency} <b>${money(d.q2.death)}</b><br><span class="r">≈ THB ${money(thb(d.q2.death,d.fx))}</span>`)}
      ${row('Total Permanent Disability (TPD)',`${d.currency} <b>${money(d.q1.tpd)}</b><br><span class="r">≈ THB ${money(thb(d.q1.tpd,d.fx))}</span><br>Coverage until age ${d.q1.tpdAge}`,`${d.currency} <b>${money(d.q2.tpd)}</b><br><span class="r">≈ THB ${money(thb(d.q2.tpd,d.fx))}</span><br>Coverage until age ${d.q2.tpdAge}`)}
      ${row('Coverage Term (Death Benefit)',`Until age ${d.q1.deathAge}`,`Until age ${d.q2.deathAge}`)}
      ${row('Coverage Term (TPD Benefit)',`Until age ${d.q1.tpdAge}`,`Until age ${d.q2.tpdAge}`)}
      ${row('Premium Payment Term',`Payable until age ${d.q1.premEnd}`,`Payable until age ${d.q2.premEnd}`)}
      ${row('Annual Premium',premiumBlock(d.q1,d),premiumBlock(d.q2,d),true)}
      ${row('Premium Payment',paymentText(d.q1,d),paymentText(d.q2,d))}
      ${row(`<span style="color:#c8102e;font-weight:900">Annual Premium in THB<br><small>(1 SGD = ${d.fx.toFixed(2)} THB)</small></span>`,thbPremiumBlock(d.q1,d),thbPremiumBlock(d.q2,d),true,'#fff0f2')}
    </table>
    <div style="font-size:16px;font-weight:900;color:#c8102e;margin:10px 0 7px">☆ WHY CHOOSE ${esc(d.product).toUpperCase()}?</div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);background:#fff3f4;border-radius:12px;padding:9px 6px;margin-bottom:9px">
      ${smallWhy('High Coverage','Affordable premium for sizable protection.')}${smallWhy('Flexible Terms','Choose a duration aligned with your life stage.')}${smallWhy('Simple & Straightforward','Clear benefits and easy-to-understand structure.')}${smallWhy('Love & Responsibility','Help keep your loved ones financially secure.')}
    </div>
    <div style="display:grid;grid-template-columns:1.7fr .8fr;background:#fff3f4;border-radius:12px;padding:10px 14px;font-size:8.3px;line-height:1.45">
      <div><b style="color:#c8102e">IMPORTANT NOTES</b><br>• Summary for illustration purposes only. Refer to the official policy contract and product documents.<br>• Benefits are subject to policy terms, definitions, exclusions and claim requirements.<br>• THB figures are illustrative conversions and may fluctuate with exchange rates.</div>
      <div style="border-left:1px solid #e3aab4;padding-left:15px;font-size:10.5px;font-weight:700;text-align:center;display:flex;align-items:center">Protect today. Plan confidently for tomorrow.</div>
    </div>
  </div>
  <div style="position:absolute;top:1081px;width:794px;height:42px;background:#c8102e;color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800">Secure today. Protect tomorrow. Give your loved ones the gift of financial security.</div>
  <style>.r{color:#c8102e;font-weight:800}</style>
</div>`;
}
function row(label,a,b,bold=false,bg='#fff'){
 return `<tr style="background:${bg}"><td style="border:1px solid #dedede;padding:7px 8px;font-weight:${bold?800:700}">${label}</td><td style="border:1px solid #dedede;padding:7px 8px;text-align:center;line-height:1.35">${a}</td><td style="border:1px solid #dedede;padding:7px 8px;text-align:center;line-height:1.35">${b}</td></tr>`;
}
function smallWhy(t,b){return `<div style="padding:3px 9px;border-right:1px solid #e4b3bd"><div style="font-size:10px;color:#c8102e;font-weight:900">${t}</div><div style="font-size:8.8px;line-height:1.3;margin-top:3px">${b}</div></div>`}

function renderPreview(){const d=getData();$('proposalPreview').innerHTML=`<div class="proposal-page">${proposalHTML(d)}</div>`;}
$('previewBtn').onclick=renderPreview;

function svgWrap(html,w=794,h=1123){
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><foreignObject width="100%" height="100%">${html}</foreignObject></svg>`;
}
async function htmlToCanvas(html,w=794,h=1123,scale=2,bg='#ffffff'){
 const svg=svgWrap(html,w,h); const blob=new Blob([svg],{type:'image/svg+xml;charset=utf-8'}); const url=URL.createObjectURL(blob);
 try{
   const img=new Image(); await new Promise((res,rej)=>{img.onload=res;img.onerror=rej;img.src=url});
   const c=document.createElement('canvas');c.width=w*scale;c.height=h*scale;const ctx=c.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,c.width,c.height);ctx.scale(scale,scale);ctx.drawImage(img,0,0,w,h);return c;
 }finally{URL.revokeObjectURL(url)}
}
function downloadBlob(blob,name){const a=document.createElement('a');const u=URL.createObjectURL(blob);a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000)}
function showToast(msg){const t=$('toast');t.textContent=msg;t.hidden=false;setTimeout(()=>t.hidden=true,2600)}

$('pngBtn').onclick=async()=>{try{showToast('Generating PNG…');const d=getData();const c=await htmlToCanvas(proposalHTML(d));c.toBlob(b=>downloadBlob(b,`proposal_${d.product.replace(/\W+/g,'_')}.png`),'image/png');}catch(e){alert('PNG generation failed: '+e.message)}};

function pdfPageHTML(d,page){
 const head=`<div style="height:74px;background:#c8102e;color:#fff;padding:16px 28px;display:flex;justify-content:space-between;align-items:center"><div><div style="font-size:22px;font-weight:900">INSURANCE PROPOSAL</div><div style="font-size:13px">${esc(d.product)}</div></div><div style="font-size:10px;text-align:right">${esc(d.nationality)} National · ${esc(d.gender)} · Age ${d.age}<br>1 SGD = ${d.fx.toFixed(2)} THB</div></div>`;
 const foot=`<div style="position:absolute;bottom:0;left:0;right:0;height:36px;border-top:1px solid #ddd;padding:10px 28px;font-size:8px;color:#687078">${esc(d.product)} · Client Proposal <span style="float:right">Page ${page}</span></div>`;
 if(page===1) return `<div xmlns="http://www.w3.org/1999/xhtml" style="width:794px;height:1123px;background:#fff;font-family:Arial,'Noto Sans Thai',sans-serif;color:#222;position:relative">${head}<div style="padding:28px"><div style="font-size:26px;font-weight:900;color:#c8102e">Protection Summary</div><div style="margin-top:15px;background:#fff0f2;border-radius:14px;padding:20px;text-align:center"><div style="font-size:12px;color:#777">CORE LIFE PROTECTION</div><div style="font-size:32px;font-weight:900;color:#9d0b25">SGD ${money(Math.max(d.q1.death,d.q2.death))}</div><div style="font-size:14px">≈ THB ${money(thb(Math.max(d.q1.death,d.q2.death),d.fx))}</div></div><div style="margin-top:22px">${pdfComparisonTable(d)}</div><div style="margin-top:22px;font-size:14px;font-weight:900;color:#c8102e">Client Objective</div><div style="font-size:11px;line-height:1.55;margin-top:6px">${esc(d.objective)}</div></div>${foot}</div>`;
 if(page===2) return `<div xmlns="http://www.w3.org/1999/xhtml" style="width:794px;height:1123px;background:#fff;font-family:Arial,'Noto Sans Thai',sans-serif;color:#222;position:relative">${head}<div style="padding:28px"><div style="font-size:26px;font-weight:900;color:#c8102e">Understanding the Options</div>${optionSection('Option 1',d.q1,d)}${optionSection('Option 2',d.q2,d)}<div style="font-size:18px;font-weight:900;color:#c8102e;margin-top:24px">Currency Illustration</div><div style="font-size:11px;line-height:1.5;margin-top:8px">THB equivalents are shown for easier understanding using SGD 1 = THB ${d.fx.toFixed(2)}. Actual amounts can differ due to exchange-rate movements and bank or payment-provider charges.</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:20px">${metric('Protection',`THB ${money(thb(Math.max(d.q1.death,d.q2.death),d.fx))}`)}${metric('Option 1 premium',`THB ${money(thb(d.q1.prem1,d.fx))}/yr`)}${metric('Option 2 premium',`THB ${money(thb(d.q2.prem1,d.fx))}/yr`)}</div></div>${foot}</div>`;
 return `<div xmlns="http://www.w3.org/1999/xhtml" style="width:794px;height:1123px;background:#fff;font-family:Arial,'Noto Sans Thai',sans-serif;color:#222;position:relative">${head}<div style="padding:28px"><div style="font-size:26px;font-weight:900;color:#c8102e">Important Considerations</div><div style="margin-top:18px;font-size:12px;line-height:1.7">• This proposal is a summary for discussion and illustration purposes.<br><br>• Official policy documents, underwriting decisions, definitions, exclusions and contractual terms take precedence.<br><br>• Total Permanent Disability benefits are subject to the policy’s contractual definition and claim conditions.<br><br>• THB figures are illustrative currency conversions and are not guaranteed.<br><br>• Review the official product documents before deciding which coverage term is appropriate.</div><div style="margin-top:45px;background:#c8102e;color:white;border-radius:16px;padding:26px;text-align:center"><div style="font-size:22px;font-weight:900">${esc(d.product)}</div><div style="font-size:13px;line-height:1.5;margin-top:9px">Choose the coverage horizon that best matches the client’s protection needs and premium preference.</div></div></div>${foot}</div>`;
}
function pdfComparisonTable(d){return `<table style="width:100%;border-collapse:collapse;font-size:10px"><tr style="background:#c8102e;color:#fff"><th style="padding:9px">Item</th><th>${esc(d.q1.title)}</th><th>${esc(d.q2.title)}</th></tr>${row('Death Benefit',`SGD ${money(d.q1.death)}<br>THB ${money(thb(d.q1.death,d.fx))}`,`SGD ${money(d.q2.death)}<br>THB ${money(thb(d.q2.death,d.fx))}`)}${row('TPD Benefit',`SGD ${money(d.q1.tpd)} to age ${d.q1.tpdAge}`,`SGD ${money(d.q2.tpd)} to age ${d.q2.tpdAge}`)}${row('Death Coverage',`To age ${d.q1.deathAge}`,`To age ${d.q2.deathAge}`)}${row('Annual Premium',premiumBlock(d.q1,d),premiumBlock(d.q2,d))}</table>`}
function optionSection(t,q,d){return `<div style="margin-top:20px;border:1px solid #ead4d9;border-radius:12px;padding:16px"><div style="font-size:17px;font-weight:900;color:#c8102e">${t} — ${esc(q.title)}</div><div style="font-size:11px;line-height:1.65;margin-top:8px">Death Benefit: <b>SGD ${money(q.death)}</b> (≈ THB ${money(thb(q.death,d.fx))}) until age ${q.deathAge}.<br>TPD Benefit: <b>SGD ${money(q.tpd)}</b> (≈ THB ${money(thb(q.tpd,d.fx))}) until age ${q.tpdAge}.<br>Premium: ${paymentText(q,d)}</div></div>`}
function metric(t,v){return `<div style="background:#fff0f2;border-radius:12px;padding:16px;text-align:center"><div style="font-size:10px;color:#777">${t}</div><div style="font-size:17px;font-weight:900;color:#9d0b25;margin-top:7px">${v}</div></div>`}

function dataURLToBytes(url){const b=atob(url.split(',')[1]);const a=new Uint8Array(b.length);for(let i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return a}
function concat(arrs){let n=arrs.reduce((a,b)=>a+b.length,0),o=new Uint8Array(n),p=0;for(const a of arrs){o.set(a,p);p+=a.length}return o}
function enc(s){return new TextEncoder().encode(s)}
function buildPdf(jpegs,widths,heights){
 const pageW=595.28,pageH=841.89,N=jpegs.length; const objCount=2+N*3; const objs=new Array(objCount+1);
 objs[1]=enc('<< /Type /Catalog /Pages 2 0 R >>');
 const pageRefs=[];
 for(let i=0;i<N;i++){const pageObj=3+i*3, contentObj=4+i*3, imageObj=5+i*3;pageRefs.push(`${pageObj} 0 R`);
   objs[pageObj]=enc(`<< /Type /Page /Parent 2 0 R /Resources << /XObject << /Im${i+1} ${imageObj} 0 R >> >> /MediaBox [0 0 ${pageW} ${pageH}] /Contents ${contentObj} 0 R >>`);
   const cs=`q ${pageW} 0 0 ${pageH} 0 0 cm /Im${i+1} Do Q`;objs[contentObj]=enc(`<< /Length ${cs.length} >>\nstream\n${cs}\nendstream`);
   const jpg=jpegs[i]; const head=enc(`<< /Type /XObject /Subtype /Image /Width ${widths[i]} /Height ${heights[i]} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`); const tail=enc('\nendstream'); objs[imageObj]=concat([head,jpg,tail]);
 }
 objs[2]=enc(`<< /Type /Pages /Kids [${pageRefs.join(' ')}] /Count ${N} >>`);
 const parts=[enc('%PDF-1.4\n%âãÏÓ\n')], offsets=[0]; let pos=parts[0].length;
 for(let i=1;i<=objCount;i++){offsets[i]=pos;const p=concat([enc(`${i} 0 obj\n`),objs[i],enc('\nendobj\n')]);parts.push(p);pos+=p.length;}
 const xrefPos=pos; let x=`xref\n0 ${objCount+1}\n0000000000 65535 f \n`;for(let i=1;i<=objCount;i++)x+=String(offsets[i]).padStart(10,'0')+' 00000 n \n';
 const trailer=`trailer\n<< /Size ${objCount+1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;parts.push(enc(x+trailer));return concat(parts)
}
$('pdfBtn').onclick=async()=>{try{showToast('Generating 3-page PDF…');const d=getData(),j=[],w=[],h=[];for(let p=1;p<=3;p++){const c=await htmlToCanvas(pdfPageHTML(d,p),794,1123,1.6);const data=c.toDataURL('image/jpeg',0.9);j.push(dataURLToBytes(data));w.push(c.width);h.push(c.height)}const pdf=buildPdf(j,w,h);downloadBlob(new Blob([pdf],{type:'application/pdf'}),`proposal_${d.product.replace(/\W+/g,'_')}.pdf`);}catch(e){alert('PDF generation failed: '+e.message)}};

$('saveBtn').onclick=()=>{const d=getData();downloadBlob(new Blob([JSON.stringify(d,null,2)],{type:'application/json'}),`proposal_data_${d.product.replace(/\W+/g,'_')}.json`)};
$('loadJson').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;try{const d=JSON.parse(await f.text());loadData(d);renderPreview();showToast('Proposal data loaded');}catch(err){alert('Could not load JSON: '+err.message)}});
function set(id,v){if($(id)&&v!==undefined&&v!==null)$(id).value=v}
function loadData(d){set('nationality',d.nationality);set('gender',d.gender);set('age',d.age);set('product',d.product);set('currency',d.currency);set('fx',d.fx);set('objective',d.objective);set('overview',d.overview);['q1','q2'].forEach(k=>{const q=d[k]||{};const n=k.slice(1);set(`q${n}title`,q.title);set(`q${n}death`,q.death);set(`q${n}deathAge`,q.deathAge);set(`q${n}tpd`,q.tpd);set(`q${n}tpdAge`,q.tpdAge);set(`q${n}premEnd`,q.premEnd);set(`q${n}prem1`,q.prem1);set(`q${n}band1`,q.band1);set(`q${n}prem2`,q.prem2||'');set(`q${n}band2`,q.band2||'')});logoData=d.logoData||'';headerData=d.headerData||'';}

renderPreview();
