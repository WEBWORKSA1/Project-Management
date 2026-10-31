/* PERT three-point estimator with probability of meeting a target */
(function(){
  var KEY='pm-pert-v1',body=document.getElementById('p-body'),out=document.getElementById('p-out'),tgt=document.getElementById('p-target');
  function sample(){return [{n:'Requirements workshop',o:3,m:5,p:10},{n:'Prototype',o:5,m:8,p:15},{n:'Build',o:10,m:15,p:28},{n:'Testing',o:4,m:6,p:12}]}
  var rowsData;try{rowsData=JSON.parse(PM.store(KEY))}catch(e){}
  if(!rowsData||!rowsData.length)rowsData=sample();
  function erf(x){var s=x<0?-1:1;x=Math.abs(x);var t=1/(1+.3275911*x);var y=1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-.284496736)*t+.254829592)*t*Math.exp(-x*x);return s*y}
  function cdf(z){return .5*(1+erf(z/Math.SQRT2))}
  function rows(){body.innerHTML=rowsData.map(function(r,i){return '<tr><td><input data-i="'+i+'" data-f="n" value="'+PM.esc(r.n)+'" aria-label="Task"></td>'+['o','m','p'].map(function(f){return '<td><input type="number" min="0" step="0.5" data-i="'+i+'" data-f="'+f+'" value="'+r[f]+'" style="width:84px" aria-label="'+f+'"></td>'}).join('')+'<td class="e">—</td><td class="sd">—</td><td><button class="x" data-del="'+i+'" aria-label="Delete">✕</button></td></tr>'}).join('')}
  function calc(){
    PM.store(KEY,JSON.stringify(rowsData));var E=0,V=0,warn=[];
    rowsData.forEach(function(r,i){var o=+r.o||0,m=+r.m||0,p=+r.p||0;if(!(o<=m&&m<=p))warn.push((r.n||'Row '+(i+1))+': optimistic ≤ most likely ≤ pessimistic');var e=(o+4*m+p)/6,sd=(p-o)/6;E+=e;V+=sd*sd;
      var tr=body.children[i];if(tr){tr.querySelector('.e').textContent=PM.fmt(e,1);tr.querySelector('.sd').textContent=PM.fmt(sd,2)}});
    var SD=Math.sqrt(V),T=+tgt.value;
    var prob=T>0&&SD>0?cdf((T-E)/SD)*100:(T>0?(T>=E?100:0):null);
    out.innerHTML=(warn.length?'<div class="notice">Check: '+warn.map(PM.esc).join('; ')+'</div>':'')+
      '<div class="kpis"><div class="kpi"><small>Expected total (E)</small><b>'+PM.fmt(E,1)+'</b></div><div class="kpi"><small>Std deviation (σ)</small><b>'+PM.fmt(SD,2)+'</b></div>'+
      '<div class="kpi"><small>68% range (±1σ)</small><b>'+PM.fmt(E-SD,1)+'–'+PM.fmt(E+SD,1)+'</b></div><div class="kpi"><small>95% range (±2σ)</small><b>'+PM.fmt(E-2*SD,1)+'–'+PM.fmt(E+2*SD,1)+'</b></div>'+
      '<div class="kpi"><small>99.7% range (±3σ)</small><b>'+PM.fmt(E-3*SD,1)+'–'+PM.fmt(E+3*SD,1)+'</b></div>'+
      (prob!=null?'<div class="kpi '+(prob>=80?'good':prob<50?'bad':'')+'"><small>P(finish ≤ '+T+')</small><b>'+PM.fmt(prob,1)+'%</b></div>':'')+'</div>'+
      '<div class="out small">Commit to the <b>90% estimate: '+PM.fmt(E+1.2816*SD,1)+'</b> units if you need high confidence. The sum assumes tasks are independent; correlated risks (same team, same vendor) widen the real range.</div>';
  }
  body.addEventListener('input',function(e){var i=e.target.dataset.i,f=e.target.dataset.f;if(i==null)return;rowsData[i][f]=f==='n'?e.target.value:e.target.value;calc()});
  body.addEventListener('click',function(e){if(e.target.dataset.del!=null){rowsData.splice(+e.target.dataset.del,1);rows();calc()}});
  tgt.addEventListener('input',calc);
  document.getElementById('p-add').addEventListener('click',function(){rowsData.push({n:'New task',o:1,m:2,p:4});rows();calc()});
  document.getElementById('p-sample').addEventListener('click',function(){rowsData=sample();rows();calc()});
  document.getElementById('p-csv').addEventListener('click',function(){var r=[['Task','Optimistic','Most likely','Pessimistic','Expected','Std dev']];rowsData.forEach(function(x){var o=+x.o,m=+x.m,p=+x.p;r.push([x.n,o,m,p,((o+4*m+p)/6).toFixed(2),((p-o)/6).toFixed(2)])});PM.download('pert-estimates.csv',PM.csv(r))});
  rows();calc();
})();
