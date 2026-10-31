/* Sprint capacity & velocity planner */
(function(){
  var KEY='pm-sprint-v1',body=document.getElementById('sp-body'),f=document.getElementById('sp-form'),out=document.getElementById('sp-out');
  function sample(){return {days:10,focus:70,ceremonies:10,vel:'32,28,35,30',backlog:180,team:[{n:'Alex',h:8,off:0,a:100},{n:'Priya',h:8,off:2,a:100},{n:'Sam',h:6,off:0,a:80},{n:'Jordan',h:8,off:1,a:50}]}}
  var S;try{S=JSON.parse(PM.store(KEY))}catch(e){}if(!S||!S.team)S=sample();
  ['days','focus','ceremonies','vel','backlog'].forEach(function(k){f[k].value=S[k]});
  function rows(){body.innerHTML=S.team.map(function(m,i){return '<tr><td><input data-i="'+i+'" data-f="n" value="'+PM.esc(m.n)+'" aria-label="Name"></td><td><input type="number" min="0" max="24" data-i="'+i+'" data-f="h" value="'+m.h+'" style="width:76px" aria-label="Hours per day"></td><td><input type="number" min="0" data-i="'+i+'" data-f="off" value="'+m.off+'" style="width:76px" aria-label="Days off"></td><td><input type="number" min="0" max="100" data-i="'+i+'" data-f="a" value="'+m.a+'" style="width:76px" aria-label="Allocation %"></td><td class="cap">—</td><td><button class="x" data-del="'+i+'" aria-label="Delete">✕</button></td></tr>'}).join('')}
  function calc(){
    ['days','focus','ceremonies','backlog'].forEach(function(k){S[k]=+f[k].value||0});S.vel=f.vel.value;PM.store(KEY,JSON.stringify(S));
    var tot=0;S.team.forEach(function(m,i){var c=Math.max(0,S.days-m.off)*m.h*(m.a/100)*(1-S.ceremonies/100)*(S.focus/100);tot+=c;var td=body.children[i];if(td)td.querySelector('.cap').textContent=PM.fmt(c,1)+' h'});
    var v=String(S.vel).split(/[ ,;]+/).map(Number).filter(function(x){return x>0});
    var avg=v.length?v.reduce(function(a,b){return a+b},0)/v.length:0,last3=v.slice(-3),avg3=last3.length?last3.reduce(function(a,b){return a+b},0)/last3.length:0;
    var min=v.length?Math.min.apply(null,v):0,max=v.length?Math.max.apply(null,v):0;
    var commit=avg3*(S.team.reduce(function(a,m){return a+Math.max(0,S.days-m.off)*m.h*(m.a/100)},0)/(S.team.reduce(function(a,m){return a+S.days*m.h*(m.a/100)},0)||1));
    var sprints=avg?Math.ceil(S.backlog/avg):0,best=max?Math.ceil(S.backlog/max):0,worst=min?Math.ceil(S.backlog/min):0;
    out.innerHTML='<div class="kpis"><div class="kpi"><small>Focused capacity</small><b>'+PM.fmt(tot,0)+' h</b></div><div class="kpi"><small>Avg velocity</small><b>'+PM.fmt(avg,1)+' pts</b></div><div class="kpi"><small>Last-3 avg</small><b>'+PM.fmt(avg3,1)+' pts</b></div><div class="kpi good"><small>Recommended commitment</small><b>'+PM.fmt(commit,0)+' pts</b></div></div>'+
      '<div class="out"><b>Release forecast for '+S.backlog+' points:</b> about <b>'+sprints+' sprints</b> at average velocity (best case '+best+', worst case '+worst+'). At '+S.days+' working days per sprint that is roughly <b>'+PM.fmt(sprints*S.days/5,1)+' weeks</b> (range '+PM.fmt(best*S.days/5,1)+'–'+PM.fmt(worst*S.days/5,1)+').<br><span class="small muted">Commitment = last-3 average velocity scaled by this sprint\'s availability (time off reduces it proportionally).</span></div>';
  }
  body.addEventListener('input',function(e){var i=e.target.dataset.i,fl=e.target.dataset.f;if(i==null)return;S.team[i][fl]=fl==='n'?e.target.value:+e.target.value;calc()});
  body.addEventListener('click',function(e){if(e.target.dataset.del!=null){S.team.splice(+e.target.dataset.del,1);rows();calc()}});
  f.addEventListener('input',calc);
  document.getElementById('sp-add').addEventListener('click',function(){S.team.push({n:'Team member',h:8,off:0,a:100});rows();calc()});
  document.getElementById('sp-sample').addEventListener('click',function(){S=sample();['days','focus','ceremonies','vel','backlog'].forEach(function(k){f[k].value=S[k]});rows();calc()});
  rows();calc();
})();
