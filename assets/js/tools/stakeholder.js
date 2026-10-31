/* Stakeholder power/interest map */
(function(){
  var KEY='pm-stake-v1',body=document.getElementById('s-body'),grid=document.getElementById('s-grid'),plan=document.getElementById('s-plan');
  function sample(){return [{n:'CEO',p:9,i:4},{n:'Sponsor',p:9,i:9},{n:'Finance',p:7,i:5},{n:'End users',p:3,i:9},{n:'IT Ops',p:5,i:7},{n:'Legal',p:6,i:2},{n:'Vendor',p:2,i:6},{n:'Press',p:2,i:2}]}
  var S;try{S=JSON.parse(PM.store(KEY))}catch(e){}if(!S||!S.length)S=sample();
  function q(s){return s.p>5?(s.i>5?['Manage closely','Involve in key decisions, weekly 1:1 updates, early sight of risks.']:['Keep satisfied','Concise executive summaries, consult before big changes, no surprises.']):(s.i>5?['Keep informed','Regular newsletters, demos, feedback channels, champions network.']:['Monitor','Light-touch updates; watch for changes in power or interest.'])}
  function rows(){body.innerHTML=S.map(function(s,i){return '<tr><td><input data-i="'+i+'" data-f="n" value="'+PM.esc(s.n)+'" aria-label="Stakeholder"></td><td><input type="range" min="1" max="10" data-i="'+i+'" data-f="p" value="'+s.p+'" aria-label="Power"></td><td><input type="range" min="1" max="10" data-i="'+i+'" data-f="i" value="'+s.i+'" aria-label="Interest"></td><td class="small">'+q(s)[0]+'</td><td><button class="x" data-del="'+i+'" aria-label="Delete">✕</button></td></tr>'}).join('')}
  function draw(){PM.store(KEY,JSON.stringify(S));
    grid.innerHTML='<div><b>Keep satisfied</b></div><div><b>Manage closely</b></div><div><b>Monitor</b></div><div><b>Keep informed</b></div>'+S.map(function(s){var x=(s.i-.5)/10*100,y=100-(s.p-.5)/10*100;return '<span class="dot" style="left:'+x+'%;top:'+y+'%;background:'+(s.p>5&&s.i>5?'var(--danger)':s.p>5?'var(--accent)':s.i>5?'var(--brand)':'var(--muted)')+'">'+PM.esc(s.n)+'</span>'}).join('');
    var g={};S.forEach(function(s){var k=q(s);(g[k[0]]=g[k[0]]||{d:k[1],n:[]}).n.push(s.n)});
    plan.innerHTML=['Manage closely','Keep satisfied','Keep informed','Monitor'].filter(function(k){return g[k]}).map(function(k){return '<div class="card"><h3>'+k+'</h3><p><b>'+g[k].n.map(PM.esc).join(', ')+'</b></p><p class="small mt">'+g[k].d+'</p></div>'}).join('');}
  body.addEventListener('input',function(e){var i=e.target.dataset.i,f=e.target.dataset.f;if(i==null)return;S[i][f]=f==='n'?e.target.value:+e.target.value;var td=e.target.closest('tr').children[3];td.textContent=q(S[i])[0];draw()});
  body.addEventListener('click',function(e){if(e.target.dataset.del!=null){S.splice(+e.target.dataset.del,1);rows();draw()}});
  document.getElementById('s-add').addEventListener('click',function(){S.push({n:'New stakeholder',p:5,i:5});rows();draw()});
  document.getElementById('s-sample').addEventListener('click',function(){S=sample();rows();draw()});
  document.getElementById('s-csv').addEventListener('click',function(){var o=[['Stakeholder','Power (1-10)','Interest (1-10)','Strategy','Engagement']];S.forEach(function(s){var k=q(s);o.push([s.n,s.p,s.i,k[0],k[1]])});PM.download('stakeholder-map.csv',PM.csv(o))});
  rows();draw();
})();
