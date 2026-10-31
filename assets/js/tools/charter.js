/* Project charter generator */
(function(){
  var f=document.getElementById('ch'),pv=document.getElementById('ch-preview'),KEY='pm-charter-v1';
  try{var s=JSON.parse(PM.store(KEY));if(s)Object.keys(s).forEach(function(k){if(f[k])f[k].value=s[k]})}catch(e){}
  var L={name:'Project name',sponsor:'Sponsor',pm:'Project manager',start:'Start date',end:'Target end date',budget:'Budget',purpose:'Purpose / business case',objectives:'Objectives (SMART)',scope_in:'In scope',scope_out:'Out of scope',deliverables:'Key deliverables',milestones:'Milestones',stakeholders:'Key stakeholders',risks:'High-level risks',assumptions:'Assumptions & constraints',criteria:'Success criteria',approval:'Approval'};
  function list(t){var a=String(t||'').split(/\n+/).map(function(x){return x.trim()}).filter(Boolean);return a.length>1?'<ul>'+a.map(function(x){return '<li>'+PM.esc(x.replace(/^[-•*]\s*/,''))+'</li>'}).join('')+'</ul>':'<p>'+PM.esc(a[0]||'—')+'</p>'}
  function v(n){return f[n]?f[n].value:''}
  function render(){
    var o={};Object.keys(L).forEach(function(k){if(f[k])o[k]=f[k].value});PM.store(KEY,JSON.stringify(o));
    pv.innerHTML='<h2 style="margin-top:0">'+PM.esc(v('name')||'Untitled project')+' — Project Charter</h2>'+
    '<div class="tbl-wrap"><table class="tbl"><tr><th>Sponsor</th><td>'+PM.esc(v('sponsor')||'—')+'</td><th>Project manager</th><td>'+PM.esc(v('pm')||'—')+'</td></tr><tr><th>Start</th><td>'+PM.esc(v('start')||'—')+'</td><th>Target end</th><td>'+PM.esc(v('end')||'—')+'</td></tr><tr><th>Budget</th><td colspan="3">'+PM.esc(v('budget')||'—')+'</td></tr></table></div>'+
    ['purpose','objectives','scope_in','scope_out','deliverables','milestones','stakeholders','risks','assumptions','criteria'].map(function(k){return '<h3>'+L[k]+'</h3>'+list(v(k))}).join('')+
    '<h3>Approval</h3><div class="tbl-wrap"><table class="tbl"><tr><th>Name</th><th>Role</th><th>Signature</th><th>Date</th></tr><tr><td>'+PM.esc(v('sponsor'))+'</td><td>Sponsor</td><td></td><td></td></tr><tr><td>'+PM.esc(v('pm'))+'</td><td>Project manager</td><td></td><td></td></tr></table></div>';
  }
  function text(){var t=(v('name')||'Untitled project')+' — PROJECT CHARTER\n\n';Object.keys(L).forEach(function(k){if(k!=='approval'&&f[k])t+=L[k].toUpperCase()+'\n'+(v(k)||'—')+'\n\n'});return t}
  f.addEventListener('input',render);
  document.getElementById('ch-copy').addEventListener('click',function(){PM.copy(text())});
  document.getElementById('ch-txt').addEventListener('click',function(){PM.download((v('name')||'project')+'-charter.txt',text(),'text/plain;charset=utf-8')});
  document.getElementById('ch-doc').addEventListener('click',function(){PM.download((v('name')||'project')+'-charter.doc','<html><head><meta charset="utf-8"><title>Charter</title></head><body style="font-family:Arial">'+pv.innerHTML+'</body></html>','application/msword')});
  document.getElementById('ch-print').addEventListener('click',function(){window.print()});
  document.getElementById('ch-sample').addEventListener('click',function(){
    var d={name:'Customer Portal Relaunch',sponsor:'Dana Lee, VP Customer Experience',pm:'Chris Patel',start:'2027-01-11',end:'2027-06-30',budget:'$240,000 (incl. 10% contingency)',
      purpose:'Support tickets about account access rose 38% last year. A self-service portal will cut ticket volume and improve customer satisfaction.',
      objectives:'Reduce account-related tickets by 30% within 3 months of launch\nReach 60% portal adoption among active customers by Q4\nAchieve a portal CSAT of 4.3/5 or higher',
      scope_in:'Login, password reset and MFA\nBilling history and invoice download\nSupport ticket submission and tracking',scope_out:'Mobile native apps\nPayment method changes (phase 2)',
      deliverables:'Requirements specification\nUX prototype\nProduction portal\nTraining materials and help centre articles',milestones:'Requirements sign-off — Feb 5\nDesign approval — Mar 12\nBeta launch — May 14\nGeneral availability — Jun 30',
      stakeholders:'Customer Experience team\nIT Security\nFinance (billing data)\nTop 20 enterprise customers (beta group)',risks:'Identity provider integration complexity\nData quality in billing system\nSecurity review lead time',
      assumptions:'Existing identity provider will be reused\nTwo developers available full-time from February',criteria:'All objectives met; launched by June 30 within budget; zero critical security findings'};
    Object.keys(d).forEach(function(k){if(f[k])f[k].value=d[k]});render();
  });
  render();
})();
