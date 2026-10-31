/* Project.Management — site script (no dependencies) */
(function(){
  'use strict';
  var $=function(s,c){return (c||document).querySelector(s)};
  var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
  function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
  var ROOT=document.documentElement.getAttribute('data-root')||'';

  /* ---------- Shared chrome (menus, footer columns, modals) injected once ---------- */
  (function(){
    var R=ROOT,T=[['gantt-chart-maker','📊 Gantt Chart Maker','Plan tasks on a live timeline'],['kanban-board','🗂 Kanban Board','Drag-and-drop with WIP limits'],['critical-path-calculator','🧭 Critical Path Calculator','Critical path and float'],['pert-estimator','🎯 PERT Estimator','Three-point estimates'],['earned-value-calculator','💰 Earned Value Calculator','CPI, SPI, EAC, VAC, TCPI'],['risk-matrix','⚠ Risk Matrix & Register','5×5 heatmap'],['raci-matrix-generator','🧩 RACI Matrix Generator','Who does what'],['project-charter-generator','📝 Project Charter Generator','One-page charter'],['stakeholder-map','👥 Stakeholder Map','Power/interest grid'],['sprint-capacity-planner','🏃 Sprint Capacity Planner','Capacity & velocity'],['meeting-cost-calculator','⏱ Meeting Cost Calculator','True meeting cost'],['methodology-quiz','❓ Methodology Quiz','Agile, Waterfall or hybrid?']],
    G=[['what-is-project-management','What Is Project Management?'],['project-life-cycle','The Project Life Cycle'],['agile-project-management','Agile Project Management'],['scrum-guide','Scrum Explained'],['kanban-method','The Kanban Method'],['waterfall-methodology','Waterfall Methodology'],['agile-vs-waterfall','Agile vs Waterfall vs Hybrid'],['work-breakdown-structure','Work Breakdown Structure'],['critical-path-method','Critical Path Method'],['risk-management','Project Risk Management'],['stakeholder-management','Stakeholder Management'],['earned-value-management','Earned Value Management'],['how-to-write-a-project-charter','How to Write a Project Charter']],
    M=[['glossary','Glossary','150+ PM terms, A–Z'],['careers','Careers & Hiring','Career guide, talent pool'],['contests','Contests & Prizes','Monthly PM challenge'],['support','Support Us','Keep the tools free'],['advertise','Advertise & Sponsor','Reach project leaders'],['about','About',''],['contact','Contact','']];
    function li(h,t,d){return '<li><a href="'+R+h+'">'+t+(d?'<small>'+d+'</small>':'')+'</a></li>'}
    var dd={tools:['Tools',T.map(function(x){return li('tools/'+x[0]+'.html',x[1],x[2])}).join('')+li('tools/index.html','<b>All free tools →</b>'),' wide'],
      learn:['Learn',G.map(function(x){return li('learn/'+x[0]+'.html',x[1])}).join('')+li('learn/index.html','<b>All guides →</b>'),' wide'],
      more:['More',M.map(function(x){return li(x[0]+'.html',x[1],x[2])}).join(''),'']};
    $$('#menu [data-dd]').forEach(function(el){var d=dd[el.getAttribute('data-dd')];el.innerHTML='<button class="dd" aria-haspopup="true">'+d[0]+' ▾</button><ul class="drop'+d[2]+'">'+d[1]+'</ul>'});
    var cols=$('#f-cols');
    if(cols)cols.outerHTML='<div class="f-grid"><div><a class="logo" href="'+R+'index.html" style="color:#fff">'+($('.site-header .logo svg')?$('.site-header .logo svg').outerHTML:'')+'<span>Project<b>.</b>Management</span></a><p style="margin-top:14px">Free project management tools, templates and guides for anyone who has to deliver work on time and on budget. No sign-up required.</p>'+
      '<form class="js-form news" data-subject="Newsletter signup" data-ok="You\'re subscribed. Watch your inbox for the weekly PM brief."><label class="hp">Leave empty<input name="_honey" tabindex="-1" autocomplete="off"></label><input type="hidden" name="form" value="newsletter"><input type="email" name="email" required placeholder="Your email" aria-label="Email for newsletter"><button class="btn btn-primary" type="submit">Subscribe</button><div class="form-msg" role="status"></div></form></div>'+
      '<div><h4>Free tools</h4><ul>'+T.slice(0,6).map(function(x){return '<li><a href="'+R+'tools/'+x[0]+'.html">'+x[1].replace(/^\S+ /,'')+'</a></li>'}).join('')+'<li><a href="'+R+'tools/index.html">All tools</a></li></ul></div>'+
      '<div><h4>Learn</h4><ul>'+G.slice(0,5).map(function(x){return '<li><a href="'+R+'learn/'+x[0]+'.html">'+x[1]+'</a></li>'}).join('')+'<li><a href="'+R+'certifications.html">Certifications</a></li><li><a href="'+R+'videos.html">Video library</a></li></ul></div>'+
      '<div><h4>Get involved</h4><ul><li><a href="'+R+'get-help.html">Get expert help</a></li><li><a href="'+R+'software.html">Find PM software</a></li><li><a href="'+R+'templates.html">Templates</a></li><li><a href="'+R+'contests.html">Contests &amp; prizes</a></li><li><a href="'+R+'careers.html">Careers &amp; hiring</a></li><li><a href="'+R+'support.html">Donate / support</a></li><li><a href="'+R+'advertise.html">Advertise</a></li></ul></div>'+
      '<div><h4>Owner contact</h4><p>For the website, domain, sponsorship, advertising or partnership:</p><a class="btn btn-ghost btn-sm" style="color:#fff;border-color:#33405f;background:transparent" href="https://web.works/contact" target="_blank" rel="noopener">Contact the owner</a></div></div>';
    var main=$('#main');
    if(main&&!document.body.hasAttribute('data-noband')){var band=document.createElement('section');band.className='tight no-print';band.innerHTML='<div class="wrap"><div class="band"><div><span class="eyebrow" style="background:rgba(255,255,255,.12);color:#9ff0e4">Free PM Starter Toolkit</span><h2 style="color:#fff">Get 10 ready-to-use project templates + a 7-day PM crash course</h2><p class="mb0">Charter, WBS, RACI, risk register, status report, retrospective and more — editable in Excel, Google Sheets or Word.</p></div><div><a class="btn btn-accent" href="#" data-toolkit>Send me the toolkit</a> <a class="btn btn-ghost" href="'+R+'get-help.html">Talk to an expert</a></div></div></div>';main.appendChild(band)}
    var x=document.createElement('div');x.innerHTML=
      '<div class="cookie" id="cookie" role="dialog" aria-label="Cookie notice"><b>Cookies &amp; ads</b><p class="mb0 small">We use cookies for essential features, analytics and to show ads from Google AdSense, which may use cookies to personalise ads. See our <a href="'+R+'cookies.html">Cookie Policy</a> and <a href="'+R+'privacy.html">Privacy Policy</a>.</p><div class="btns"><button class="btn btn-primary btn-sm" data-cookie="all">Accept all</button><button class="btn btn-ghost btn-sm" data-cookie="essential">Essential only</button></div></div>'+
      '<div class="sr-modal" id="search-modal" role="dialog" aria-label="Search"><div class="sr-box"><div class="search-box"><input id="search-input" type="search" placeholder="Search tools, guides, templates…" aria-label="Search the site"></div><div class="sr-results" id="search-results"></div><p class="small muted mb0" style="margin-top:8px">Tip: press Ctrl+K or / anywhere. Esc to close.</p></div></div>'+
      '<div class="modal" id="toolkit-modal" role="dialog" aria-label="Free toolkit"><div class="form-card"><button class="icon-btn close" aria-label="Close">✕</button><span class="eyebrow">Free download</span><h3>PM Starter Toolkit</h3><p class="small muted">10 editable templates + 7-day email course. Unsubscribe anytime.</p>'+
      '<form class="js-form" data-subject="Toolkit request (lead)" data-unlock=".toolkit-locked" data-ok="Done! The toolkit is unlocked on the Templates page and the course starts tomorrow."><label class="hp">Leave empty<input name="_honey" tabindex="-1" autocomplete="off"></label><input type="hidden" name="form" value="toolkit">'+
      '<div class="field"><label for="tk-name">First name</label><input id="tk-name" name="name" required autocomplete="given-name"></div><div class="field"><label for="tk-email">Work email</label><input id="tk-email" name="email" type="email" required autocomplete="email"></div>'+
      '<div class="field"><label for="tk-role">Your role</label><select id="tk-role" name="role"><option>Project manager</option><option>Team lead</option><option>Founder / business owner</option><option>Student / career changer</option><option>Consultant</option><option>Other</option></select></div>'+
      '<label class="check"><input type="checkbox" name="consent" value="yes" required><span>Send me the toolkit and occasional PM tips. I accept the <a href="'+R+'privacy.html">Privacy Policy</a>.</span></label><button class="btn btn-primary mt" type="submit" style="width:100%">Get the free toolkit</button><div class="form-msg" role="status"></div></form></div></div>'+
      '<div class="sticky-cta"><a class="btn btn-accent" href="'+R+'get-help.html">⚡ Free project consultation</a> <button class="icon-btn" data-sticky-x aria-label="Dismiss" style="display:inline-grid;vertical-align:middle;width:34px;height:34px">✕</button></div>';
    while(x.firstChild)document.body.appendChild(x.firstChild);
  })();

  /* ---------- Private inbox routing (address is never written in the page) ---------- */
  var _k=[106,104,100,41,107,110,102,106,96,71,54,102,116,108,117,104,112,101,98,112];
  function inbox(){return String.fromCharCode.apply(null,_k.map(function(c){return c^7})).split('').reverse().join('')}
  function endpoint(){return 'https://formsubmit.co/ajax/'+inbox()}

  /* ---------- Toast ---------- */
  var toastEl;
  function toast(t){
    if(!toastEl){toastEl=document.createElement('div');toastEl.className='toast';toastEl.setAttribute('role','status');document.body.appendChild(toastEl)}
    toastEl.textContent=t;toastEl.classList.add('show');clearTimeout(toastEl._t);
    toastEl._t=setTimeout(function(){toastEl.classList.remove('show')},2600);
  }

  /* ---------- Shared helpers for tools ---------- */
  window.PM={
    store:store,toast:toast,
    download:function(name,text,type){
      var blob=new Blob([text],{type:type||'text/csv;charset=utf-8'});
      var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;
      document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500);
    },
    csv:function(rows){return '﻿'+rows.map(function(r){return r.map(function(c){c=(c==null?'':String(c));return /[",\n]/.test(c)?'"'+c.replace(/"/g,'""')+'"':c}).join(',')}).join('\r\n')},
    copy:function(text){
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(function(){toast('Copied to clipboard')},function(){fallback()})}else fallback();
      function fallback(){var t=document.createElement('textarea');t.value=text;document.body.appendChild(t);t.select();try{document.execCommand('copy');toast('Copied to clipboard')}catch(e){toast('Copy failed — select and copy manually')}t.remove()}
    },
    esc:function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})},
    fmt:function(n,d){if(!isFinite(n))return '—';return Number(n).toLocaleString(undefined,{maximumFractionDigits:d==null?2:d,minimumFractionDigits:0})}
  };

  /* ---------- Theme ---------- */
  var themeBtn=$('#theme');
  function applyTheme(t){document.documentElement.setAttribute('data-theme',t);if(themeBtn)themeBtn.textContent=t==='dark'?'☀':'☾'}
  applyTheme(store('pm-theme')||(window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));
  if(themeBtn)themeBtn.addEventListener('click',function(){var t=document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark';store('pm-theme',t);applyTheme(t)});

  /* ---------- Mobile menu ---------- */
  var burger=$('#burger'),menu=$('#menu');
  if(burger&&menu)burger.addEventListener('click',function(){var o=menu.classList.toggle('open');burger.setAttribute('aria-expanded',o?'true':'false');burger.textContent=o?'✕':'☰'});

  /* ---------- Active nav ---------- */
  var here=location.pathname.replace(/index\.html$/,'');
  $$('#menu a').forEach(function(a){var p=a.pathname.replace(/index\.html$/,'');if(p===here&&p.length>1)a.classList.add('active')});

  /* ---------- Cookie notice ---------- */
  var ck=$('#cookie');
  if(ck&&!store('pm-cookie'))ck.classList.add('show');
  $$('[data-cookie]').forEach(function(b){b.addEventListener('click',function(){store('pm-cookie',b.getAttribute('data-cookie'));ck.classList.remove('show')})});

  /* ---------- Mail links (address assembled only on click) ---------- */
  $$('[data-mail]').forEach(function(a){
    a.addEventListener('click',function(e){
      e.preventDefault();
      window.location.href='mailto:'+inbox()+'?subject='+encodeURIComponent(a.getAttribute('data-mail')||'Inquiry from Project.Management');
    });
  });

  /* ---------- Prefill from query (?topic=, ?plan=, ?amount=) ---------- */
  try{
    var qs=new URLSearchParams(location.search);
    qs.forEach(function(v,k){
      $$('form.js-form [name="'+k+'"]').forEach(function(el){
        if(el.type==='radio'||el.type==='checkbox'){if(el.value===v)el.checked=true}
        else if(el.tagName==='SELECT'){$$('option',el).forEach(function(o){if(o.value===v||o.text===v)el.value=o.value})}
        else el.value=v;
      });
    });
  }catch(e){}

  /* ---------- Forms ---------- */
  function resetSteps(f){
    var st=$$('.step',f);if(!st.length)return;
    st.forEach(function(s,i){s.classList.toggle('active',i===0)});
    $$('.steps-ind span',f).forEach(function(s,i){s.classList.toggle('on',i===0)});
  }
  $$('form.js-form').forEach(function(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var msg=$('.form-msg',f);
      if(f._honey&&f._honey.value)return;
      if(!f.checkValidity()){f.reportValidity();return}
      var btn=$('button[type=submit]',f),old=btn?btn.textContent:'';
      if(btn){btn.disabled=true;btn.textContent='Sending…'}
      var data={};
      new FormData(f).forEach(function(v,k){if(k!=='_honey')data[k]=data[k]?data[k]+', '+v:v});
      data._subject=(f.getAttribute('data-subject')||'Project.Management form')+' — '+(data.name||data.email||'');
      data._template='table';data._captcha='false';data.page=location.href.split('?')[0];
      fetch(endpoint(),{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)})
        .then(function(r){return r.json().catch(function(){return {}})})
        .then(function(){
          if(msg){msg.className='form-msg ok';msg.textContent=f.getAttribute('data-ok')||'Received. We will get back to you within 48 hours.'}
          var unlock=f.getAttribute('data-unlock');if(unlock){store('pm-toolkit','1');$$(unlock).forEach(function(el){el.hidden=false})}
          f.reset();resetSteps(f);
          var md=f.closest('.modal');if(md)setTimeout(function(){md.classList.remove('open')},2600);
        })
        .catch(function(){if(msg){msg.className='form-msg err';msg.textContent='Network error — please try again in a minute.'}})
        .then(function(){if(btn){btn.disabled=false;btn.textContent=old}});
    });
  });

  /* ---------- Multi-step forms ---------- */
  $$('form[data-steps]').forEach(function(f){
    var steps=$$('.step',f),ind=$$('.steps-ind span',f);
    function go(i){steps.forEach(function(s,j){s.classList.toggle('active',j===i)});ind.forEach(function(s,j){s.classList.toggle('on',j<=i)});var fi=$('input,select,textarea',steps[i]);if(fi&&i>0)fi.focus({preventScroll:true})}
    $$('[data-next]',f).forEach(function(b){b.addEventListener('click',function(){
      var cur=steps.findIndex(function(s){return s.classList.contains('active')});
      var bad=$$('input,select,textarea',steps[cur]).filter(function(el){return !el.checkValidity()});
      if(bad.length){bad[0].reportValidity();return}
      go(Math.min(cur+1,steps.length-1));
    })});
    $$('[data-prev]',f).forEach(function(b){b.addEventListener('click',function(){
      var cur=steps.findIndex(function(s){return s.classList.contains('active')});go(Math.max(cur-1,0));
    })});
  });

  /* ---------- Lazy YouTube (privacy-enhanced) ---------- */
  $$('.vid[data-id]').forEach(function(v){
    var id=v.getAttribute('data-id');
    if(!$('img',v)){var im=document.createElement('img');im.loading='lazy';im.alt=v.getAttribute('data-title')||'Video thumbnail';im.src='https://i.ytimg.com/vi/'+id+'/hqdefault.jpg';v.insertBefore(im,v.firstChild)}
    function play(){v.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0" title="'+PM.esc(v.getAttribute('data-title')||'YouTube video')+'" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe>'}
    v.addEventListener('click',play);
    v.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();play()}});
  });
  /* video filter */
  $$('[data-vfilter]').forEach(function(p){p.addEventListener('click',function(){
    var t=p.getAttribute('data-vfilter');$$('[data-vfilter]').forEach(function(x){x.classList.toggle('on',x===p)});
    $$('[data-vtopic]').forEach(function(c){c.hidden=!(t==='all'||c.getAttribute('data-vtopic').indexOf(t)>-1)});
  })});

  /* ---------- Site search ---------- */
  var sm=$('#search-modal'),si=$('#search-input'),sr=$('#search-results');
  function openSearch(){if(!sm)return;sm.classList.add('open');si.value='';render('');setTimeout(function(){si.focus()},30)}
  function closeSearch(){if(sm)sm.classList.remove('open')}
  function render(q){
    var idx=window.PM_INDEX||[];q=q.trim().toLowerCase();
    var res=q?idx.map(function(d){var s=0,t=d.t.toLowerCase(),k=(d.k||'').toLowerCase();q.split(/\s+/).forEach(function(w){if(t.indexOf(w)>-1)s+=3;if(k.indexOf(w)>-1)s+=1});return [s,d]}).filter(function(x){return x[0]>0}).sort(function(a,b){return b[0]-a[0]}).slice(0,12).map(function(x){return x[1]}):idx.slice(0,8);
    sr.innerHTML=res.length?res.map(function(d,i){return '<a href="'+ROOT+d.u+'"'+(i===0?' class="sel"':'')+'>'+PM.esc(d.t)+'<small>'+PM.esc(d.c)+'</small></a>'}).join(''):'<p class="muted small" style="padding:10px">No results. Try “gantt”, “risk”, “scrum” or “PMP”.</p>';
  }
  $$('[data-search]').forEach(function(b){b.addEventListener('click',openSearch)});
  if(sm){
    sm.addEventListener('click',function(e){if(e.target===sm)closeSearch()});
    si.addEventListener('input',function(){render(si.value)});
    si.addEventListener('keydown',function(e){var s=$('.sel',sr);if(e.key==='Enter'&&s){location.href=s.href}});
  }
  document.addEventListener('keydown',function(e){
    if((e.key==='k'&&(e.metaKey||e.ctrlKey))||(e.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))){e.preventDefault();openSearch()}
    if(e.key==='Escape'){closeSearch();$$('.modal.open').forEach(function(m){m.classList.remove('open')})}
  });

  /* ---------- Toolkit modal + sticky CTA ---------- */
  var tk=$('#toolkit-modal');
  $$('[data-toolkit]').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();if(tk)tk.classList.add('open')})});
  if(tk){$$('.close',tk).forEach(function(c){c.addEventListener('click',function(){tk.classList.remove('open')})});tk.addEventListener('click',function(e){if(e.target===tk)tk.classList.remove('open')})}
  if(store('pm-toolkit'))$$('.toolkit-locked').forEach(function(el){el.hidden=false});
  var sticky=$('.sticky-cta');
  if(sticky&&!store('pm-sticky-x')){window.addEventListener('scroll',function(){sticky.classList.toggle('show',window.scrollY>900)},{passive:true})}
  $$('[data-sticky-x]').forEach(function(b){b.addEventListener('click',function(){store('pm-sticky-x','1');sticky.remove()})});

  /* ---------- Glossary filter ---------- */
  var gq=$('#gloss-q');
  if(gq)gq.addEventListener('input',function(){
    var q=gq.value.trim().toLowerCase();
    $$('dl.gloss > div').forEach(function(d){d.hidden=q&&d.textContent.toLowerCase().indexOf(q)<0});
    $$('.gloss-sec').forEach(function(s){s.hidden=!$$('dl.gloss > div',s).some(function(d){return !d.hidden})});
  });

  /* ---------- Card filter (tools, templates, software) ---------- */
  $$('[data-filter-group]').forEach(function(g){
    var target=g.getAttribute('data-filter-group');
    $$('[data-filter]',g).forEach(function(p){p.addEventListener('click',function(){
      var t=p.getAttribute('data-filter');$$('[data-filter]',g).forEach(function(x){x.classList.toggle('on',x===p)});
      $$(target+' [data-cat]').forEach(function(c){c.hidden=!(t==='all'||c.getAttribute('data-cat').split(' ').indexOf(t)>-1)});
    })});
  });

  /* ---------- Year ---------- */
  $$('[data-year]').forEach(function(y){y.textContent=new Date().getFullYear()});
})();
