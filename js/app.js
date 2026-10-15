if(!sessionStorage.getItem('staff'))location.href='index.html';
const $=s=>document.querySelector(s),esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ini=n=>n.split(' ').map(w=>w[0]).join('').slice(0,2);
const residents=[
 {n:'Maria L. Reyes',a:'42 Sampaguita St.',p:3,id:'BSI-2026-01482',hh:'HH-1482',s:'Active'},
 {n:'Joel P. Santos',a:'18 Mabini Ave.',p:2,id:'BSI-2025-01104',hh:'HH-1104',s:'Active'},
 {n:'Andrea M. Cruz',a:'7 Rosal Rd.',p:5,id:'BSI-2024-00883',hh:'HH-0883',s:'For verification'},
 {n:'Ramon D. Villanueva',a:'103 Rizal Ext.',p:1,id:'BSI-2023-00612',hh:'HH-0612',s:'Active'},
 {n:'Liza B. Evangelista',a:'55 Narra Lane',p:4,id:'BSI-2022-00494',hh:'HH-0494',s:'Inactive'}];
const requests=[['Barangay Clearance','Maria L. Reyes','REQ-2026-1048','Employment','For review','warn'],
 ['Certificate of Indigency','Joel P. Santos','REQ-2026-1047','Medical','Pending',''],['Business Clearance',"Liza's Store",'REQ-2026-1045','Renewal','For payment','']];
const store=(k,d)=>JSON.parse(localStorage.getItem(k)||JSON.stringify(d));
const incidents=store('inc',[['INC-2026-0081','Noise disturbance','Purok 2','Assigned'],['INC-2026-0079','Street light outage','Purok 4','Resolved']]);
const complaints=store('cmp',[['CMP-2026-0212','Garbage collection missed','Purok 3','Open'],['CMP-2026-0210','Drainage blocked','Purok 1','Due today']]);
const pill=(t,c)=>`<span class="pill ${c||''}">${t}</span>`,stc=s=>s=='Active'||s=='Resolved'?'ok':s=='Inactive'?'off':s=='Open'?'':'warn';
const list=(rows)=>rows.map(r=>`<div class="row"><div class="av">${ini(r[0])}</div><div class="grow">${esc(r[0])}<small>${esc(r[1])}</small></div>${r[2]||''}</div>`).join('');
const head=(t,s,b)=>`<div class="top"><div><h1>${t}</h1><p class="sub">${s}</p></div>${b||''}</div>`;
const stats=a=>`<div class="grid4">${a.map(x=>`<div class="card stat"><span>${x[1]}</span><b>${x[0]}</b></div>`).join('')}</div>`;
const pages={
dashboard:()=>head('Magandang umaga, Ana',"Here's what needs attention at Barangay San Isidro today.",'<a class="btn" href="#qr">Scan resident QR</a>')+
 stats([[18,'Pending requests'],[42,"Today's transactions"],[7,'Open complaints'],['8,426','Residents on file']])+
 `<div class="two"><div class="card"><h3>Pending requests</h3>${list(requests.map(r=>[r[0]+' · '+r[1],r[2]+' · '+r[3],pill(r[4],r[5])]))}</div>
 <div><div class="alert" style="background:var(--amberbg)">Allowance payout tomorrow · 84 recipients</div><div class="alert" style="background:var(--bluebg)">2 complaints due before 4:00 PM</div></div></div>
 <div class="actions">${[['Add resident','residents'],['Scan QR','qr'],['Issue certificate','certificates'],['Log incident','incidents']].map(a=>`<a class="card" href="#${a[1]}" style="color:inherit">${a[0]}<br><small style="color:var(--mute)">Start a new transaction</small></a>`).join('')}</div>`,
residents:()=>head('Resident management','Search, verify, and maintain resident records across all puroks.')+
 stats([['8,426','Total residents'],['8,091','Active profiles'],[23,'For verification'],['2,184','Households']])+
 `<div style="display:flex;gap:12px;margin-bottom:16px"><input id="q" placeholder="Search name, resident ID, address, or household…" aria-label="Search residents"><select id="pk" style="width:160px" aria-label="Purok"><option value="">All puroks</option>${[1,2,3,4,5].map(i=>`<option>${i}</option>`).join('')}</select></div><div class="card" id="rl"></div>`,
certificates:()=>head('Certificate issuance','Pick a resident, review the auto-filled request, then issue.')+
 `<form class="card form" id="cf"><label>Resident</label><select id="cr">${residents.map(r=>`<option>${r.n}</option>`).join("")}</select>
 <label>Certificate type</label><select id="ct"><option>Barangay Clearance</option><option>Certificate of Indigency</option><option>Business Clearance</option></select>
 <label>Purpose</label><input id="cp" value="Employment"><button class="btn" style="margin-top:18px">Preview certificate</button></form><div id="co"></div>`,
qr:()=>head('QR scanner','Scan a resident ID to load their record instantly.')+
 `<div class="scan" id="sc"><div><p>Ready to scan</p><br><button class="btn" id="go">Start scanning</button></div></div>`,
incidents:()=>head('Incidents','Log new incidents and review the history.')+
 `<form class="card form" id="inf"><label>Incident</label><input id="it" required><label>Location</label><select id="il">${[1,2,3,4,5].map(i=>`<option>Purok ${i}</option>`).join("")}</select><button class="btn" style="margin-top:18px">Log incident</button></form><br><div class="card" id="il2"></div>`,
complaints:()=>head('Complaints','Track every complaint until it is resolved.')+
 `<form class="card form" id="cmf"><label>Complaint</label><input id="mt" required><label>Location</label><select id="ml">${[1,2,3,4,5].map(i=>`<option>Purok ${i}</option>`).join("")}</select><button class="btn" style="margin-top:18px">Submit complaint</button></form><br><div class="card" id="cl"></div>`,
inquiries:()=>head('Assistance inquiries','Medical, burial, and financial assistance requests.')+`<div class="card">${list([['Medical assistance · Joel P. Santos','INQ-2026-0311 · Hospital bill',pill('Pending')],['Burial assistance · Ramon D. Villanueva','INQ-2026-0309',pill('Approved','ok')]])}</div>`,
allowances:()=>head('Allowances','Categories, eligibility, and payout records.')+`<div class="card">${list([['Senior citizen pension','Age 60+ · 84 recipients',pill('Payout tomorrow','warn')],['PWD allowance','Registered PWD ID · 31 recipients',pill('Paid','ok')],['Solo parent aid','Solo parent ID · 22 recipients',pill('Paid','ok')]])}</div>`};
const bind={
residents(){const f=()=>{const q=$('#q').value.toLowerCase(),p=$('#pk').value;const m=residents.filter(r=>(!p||r.p==p)&&(r.n+r.a+r.id+r.hh).toLowerCase().includes(q));
 $('#rl').innerHTML=m.length?m.map(r=>`<div class="row"><div class="av">${ini(r.n)}</div><div class="grow">${r.n}<small>${r.a}, Purok ${r.p}</small></div><b>${r.id}</b><span>${r.hh}</span>${pill(r.s,stc(r.s))}</div>`).join(''):'<p class="sub">No residents match. Try a different name, ID, or purok.</p>'};
 $('#q').oninput=$('#pk').onchange=f;f()},
certificates(){$('#cf').onsubmit=e=>{e.preventDefault();$('#co').innerHTML=`<br><div class="card form"><h3>${esc($('#ct').value)}</h3><p class="sub">Issued to ${esc($('#cr').value)} for ${esc($('#cp').value)}.</p><button class="btn" id="is">Issue certificate</button></div>`;
 $('#is').onclick=()=>$('#co').innerHTML='<br><div class="alert" style="background:var(--tealbg)">Certificate issued. The resident can pick it up at the front desk.</div>'}},
qr(){$('#go').onclick=()=>{$('#sc').innerHTML='<p>Scanning…</p>';setTimeout(()=>{const r=residents[0];$('#sc').innerHTML=`<div><div class="av" style="margin:auto">${ini(r.n)}</div><h3>${r.n}</h3><p class="sub">${r.id} · ${r.a}</p><a class="btn" href="#certificates">Issue certificate</a></div>`},1200)}},
incidents(){const d=()=>$('#il2').innerHTML=list(incidents.map(i=>[i[1],i[0]+' · '+i[2],pill(i[3],stc(i[3]))]));d();
 $('#inf').onsubmit=e=>{e.preventDefault();incidents.unshift(['INC-2026-'+String(82+incidents.length).padStart(4,'0'),$('#it').value,$('#il').value,'Assigned']);localStorage.setItem('inc',JSON.stringify(incidents));$('#it').value='';d()}},
complaints(){const d=()=>$('#cl').innerHTML=list(complaints.map(i=>[i[1],i[0]+' · '+i[2],pill(i[3],stc(i[3]))]));d();
 $('#cmf').onsubmit=e=>{e.preventDefault();complaints.unshift(['CMP-2026-'+String(213+complaints.length).padStart(4,'0'),$('#mt').value,$('#ml').value,'Open']);localStorage.setItem('cmp',JSON.stringify(complaints));$('#mt').value='';d()}}};
const labels={dashboard:'Dashboard',residents:'Residents',certificates:'Certificates',qr:'QR Scanner',incidents:'Incidents',complaints:'Complaints',inquiries:'Inquiries',allowances:'Allowances'};
function route(){const k=location.hash.slice(1);const key=pages[k]?k:'dashboard';
 $('#nav').innerHTML=`<div class="brand"><div class="logo">🏛</div><div>Barangay San Isidro<small>Management System</small></div></div>`+Object.keys(labels).map(x=>`<a href="#${x}" class="${x==key?'on':''}">${labels[x]}${x=='certificates'?'<span class="badge">8</span>':''}</a>`).join('')+'<a href="index.html" style="margin-top:8px">Sign out</a><div class="online">● Office is online</div>';
 $('#view').innerHTML=pages[key]();bind[key]&&bind[key]();$('#date').textContent=new Date().toLocaleDateString('en-PH',{weekday:'long',year:'numeric',month:'long',day:'numeric'});document.title=labels[key]+' · Barangay San Isidro'}
addEventListener('hashchange',route);route();
