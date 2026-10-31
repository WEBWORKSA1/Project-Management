/* RACI matrix generator with validation */
(function(){
  var KEY='pm-raci-v1',tbl=document.getElementById('x-tbl'),val=document.getElementById('x-val');
  var CYCLE=['','R','A','C','I','A/R'];
  function sample(){return {roles:['Sponsor','Project manager','Tech lead','Designer','QA'],rows:[
    {t:'Approve business case',v:['A','R','C','','I']},{t:'Project plan & schedule',v:['I','A/R','C','C','C']},
    {t:'Technical architecture',v:['I','C','A/R','C','I']},{t:'UI design',v:['C','I','C','A/R','I']},
    {t:'Test plan & execution',v:['I','A','C','I','R']},{t:'Go-live decision',v:['A','R','C','I','C']}]}}
  var S;try{S=JSON.parse(PM.store(KEY))}catch(e){}
  if(!S||!S.roles)S=sample();
  function color(v){return {R:'var(--brand-soft)',A:'#ffe0b2','A/R':'#ffd18a',C:'var(--teal-soft)',I:'var(--surface-2)'}[v]||'transparent'}
  function draw(){
    PM.store(KEY,JSON.stringify(S));
    var h='<thead><tr><th>Deliverable / task</th>'+S.roles.map(function(r,j){return '<th><input data-role="'+j+'" value="'+PM.esc(r)+'" style="min-width:100px;font-weight:700" aria-label="Role name"><button class="x" data-delrole="'+j+'" aria-label="Remove role">✕</button></th>'}).join('')+'<th></th></tr></thead><tbody>';
    S.rows.forEach(function(r,i){h+='<tr><td><input data-row="'+i+'" value="'+PM.esc(r.t)+'" style="min-width:200px" aria-label="Task"></td>'+S.roles.map(function(_,j){var v=r.v[j]||'';return '<td style="text-align:center"><button class="pill" data-cell="'+i+','+j+'" style="min-width:58px;font-weight:800;background:'+color(v)+'" aria-label="Cycle value">'+(v||'·')+'</button></td>'}).join('')+'<td><button class="x" data-delrow="'+i+'" aria-label="Remove row">✕</button></td></tr>'});
    tbl.innerHTML=h+'</tbody>';
    var issues=[];
    S.rows.forEach(function(r){var a=r.v.filter(function(x){return x==='A'||x==='A/R'}).length,rr=r.v.filter(function(x){return x==='R'||x==='A/R'}).length;
      if(a===0)issues.push('“'+r.t+'” has no Accountable person.');if(a>1)issues.push('“'+r.t+'” has '+a+' Accountable people — there should be exactly one.');if(rr===0)issues.push('“'+r.t+'” has nobody Responsible for doing the work.')});
    S.roles.forEach(function(ro,j){var n=S.rows.filter(function(r){return /R/.test(r.v[j]||'')}).length;if(n>Math.max(3,S.rows.length*.6))issues.push(ro+' is Responsible for '+n+' items — possible overload.');
      if(S.rows.every(function(r){return !r.v[j]}))issues.push(ro+' has no assignments — remove the role or involve them.')});
    val.innerHTML=issues.length?'<div class="notice"><b>'+issues.length+' issue'+(issues.length>1?'s':'')+' found</b><ul class="mb0">'+issues.map(function(x){return '<li>'+PM.esc(x)+'</li>'}).join('')+'</ul></div>':'<div class="out" style="color:var(--ok)"><b>✓ Matrix is valid:</b> every task has exactly one Accountable and at least one Responsible.</div>';
  }
  tbl.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
    if(b.dataset.cell){var p=b.dataset.cell.split(','),r=S.rows[p[0]];var cur=r.v[p[1]]||'';r.v[p[1]]=CYCLE[(CYCLE.indexOf(cur)+1)%CYCLE.length];draw()}
    if(b.dataset.delrow!=null){S.rows.splice(+b.dataset.delrow,1);draw()}
    if(b.dataset.delrole!=null){var j=+b.dataset.delrole;S.roles.splice(j,1);S.rows.forEach(function(r){r.v.splice(j,1)});draw()}});
  tbl.addEventListener('change',function(e){if(e.target.dataset.role!=null){S.roles[e.target.dataset.role]=e.target.value;draw()}if(e.target.dataset.row!=null){S.rows[e.target.dataset.row].t=e.target.value;draw()}});
  document.getElementById('x-row').addEventListener('click',function(){S.rows.push({t:'New deliverable',v:S.roles.map(function(){return ''})});draw()});
  document.getElementById('x-role').addEventListener('click',function(){S.roles.push('New role');S.rows.forEach(function(r){r.v.push('')});draw()});
  document.getElementById('x-sample').addEventListener('click',function(){S=sample();draw()});
  document.getElementById('x-csv').addEventListener('click',function(){var o=[['Deliverable / task'].concat(S.roles)];S.rows.forEach(function(r){o.push([r.t].concat(S.roles.map(function(_,j){return r.v[j]||''})))});PM.download('raci-matrix.csv',PM.csv(o))});
  draw();
})();
