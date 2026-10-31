/* Risk register + 5x5 heatmap */
(function(){
  var KEY='pm-risk-v1',body=document.getElementById('r-body'),heat=document.getElementById('r-heat'),sum=document.getElementById('r-sum');
  var RESP=['Avoid','Mitigate','Transfer','Accept','Escalate','Exploit','Enhance','Share'];
  function sample(){return [
    {n:'Key developer leaves mid-project',c:'People',p:2,i:4,o:'PM',r:'Mitigate',a:'Pair programming; document critical modules'},
    {n:'Vendor API changes without notice',c:'Technical',p:3,i:3,o:'Tech lead',r:'Mitigate',a:'Contract SLA; abstraction layer; monitoring'},
    {n:'Scope creep from sponsor requests',c:'Scope',p:4,i:3,o:'PM',r:'Avoid',a:'Formal change control; weekly scope review'},
    {n:'Data migration takes longer than planned',c:'Schedule',p:3,i:5,o:'Data lead',r:'Mitigate',a:'Trial migration in sprint 2; extra buffer'},
    {n:'Budget cut next fiscal quarter',c:'Financial',p:2,i:5,o:'Sponsor',r:'Escalate',a:'Phase deliverables so value lands early'},
    {n:'Regulatory review delays launch',c:'Compliance',p:1,i:4,o:'Legal',r:'Transfer',a:'Engage external counsel early'}]}
  var R;try{R=JSON.parse(PM.store(KEY))}catch(e){}
  if(!R||!R.length)R=sample();
  function lvl(s){return s>=15?5:s>=10?4:s>=5?3:s>=3?2:1}
  function band(s){return s>=15?'Critical':s>=10?'High':s>=5?'Medium':'Low'}
  function sel(i,f,v,opts){return '<select data-i="'+i+'" data-f="'+f+'" aria-label="'+f+'">'+opts.map(function(o){var arr=Array.isArray(o),val=arr?o[0]:o;return '<option value="'+val+'"'+(String(val)===String(v)?' selected':'')+'>'+(arr?o[1]:o)+'</option>'}).join('')+'</select>'}
  var P=[[1,'1 Rare'],[2,'2 Unlikely'],[3,'3 Possible'],[4,'4 Likely'],[5,'5 Almost certain']],I=[[1,'1 Minimal'],[2,'2 Minor'],[3,'3 Moderate'],[4,'4 Major'],[5,'5 Severe']];
  function rows(){body.innerHTML=R.map(function(r,i){var s=r.p*r.i;return '<tr><td class="muted">R'+(i+1)+'</td><td><input data-i="'+i+'" data-f="n" value="'+PM.esc(r.n)+'" aria-label="Risk"></td><td><input data-i="'+i+'" data-f="c" value="'+PM.esc(r.c)+'" style="width:100px" aria-label="Category"></td><td>'+sel(i,'p',r.p,P)+'</td><td>'+sel(i,'i',r.i,I)+'</td><td><span class="tag lv'+lvl(s)+'" style="margin:0;color:#1b1300">'+s+' '+band(s)+'</span></td><td><input data-i="'+i+'" data-f="o" value="'+PM.esc(r.o)+'" style="width:96px" aria-label="Owner"></td><td>'+sel(i,'r',r.r,RESP)+'</td><td><input data-i="'+i+'" data-f="a" value="'+PM.esc(r.a)+'" aria-label="Action"></td><td><button class="x" data-del="'+i+'" aria-label="Delete">✕</button></td></tr>'}).join('')}
  function draw(){
    PM.store(KEY,JSON.stringify(R));
    var h='';for(var p=5;p>=1;p--){h+='<div class="ax">P'+p+'</div>';for(var i=1;i<=5;i++){var n=R.map(function(r,k){return r.p==p&&r.i==i?'R'+(k+1):null}).filter(Boolean);h+='<div class="lv'+lvl(p*i)+'" title="Probability '+p+' × Impact '+i+' = '+p*i+'">'+(n.join(' ')||'')+'</div>'}}
    h+='<div class="ax"></div>'+[1,2,3,4,5].map(function(i){return '<div class="ax">I'+i+'</div>'}).join('');heat.innerHTML=h;
    var c={Critical:0,High:0,Medium:0,Low:0};R.forEach(function(r){c[band(r.p*r.i)]++});
    var exp=R.reduce(function(a,r){return a+r.p*r.i},0);
    sum.innerHTML='<div class="kpi bad"><small>Critical (15–25)</small><b>'+c.Critical+'</b></div><div class="kpi"><small>High (10–14)</small><b>'+c.High+'</b></div><div class="kpi"><small>Medium (5–9)</small><b>'+c.Medium+'</b></div><div class="kpi good"><small>Low (1–4)</small><b>'+c.Low+'</b></div><div class="kpi"><small>Total exposure</small><b>'+exp+'</b></div>';
  }
  body.addEventListener('change',function(e){var i=e.target.dataset.i,f=e.target.dataset.f;if(i==null)return;R[i][f]=(f==='p'||f==='i')?+e.target.value:e.target.value;rows();draw()});
  body.addEventListener('click',function(e){if(e.target.dataset.del!=null){R.splice(+e.target.dataset.del,1);rows();draw()}});
  document.getElementById('r-add').addEventListener('click',function(){R.push({n:'New risk',c:'General',p:3,i:3,o:'',r:'Mitigate',a:''});rows();draw()});
  document.getElementById('r-sample').addEventListener('click',function(){R=sample();rows();draw()});
  document.getElementById('r-sort').addEventListener('click',function(){R.sort(function(a,b){return b.p*b.i-a.p*a.i});rows();draw()});
  document.getElementById('r-csv').addEventListener('click',function(){var o=[['ID','Risk','Category','Probability (1-5)','Impact (1-5)','Score','Rating','Owner','Response','Action']];R.forEach(function(r,i){o.push(['R'+(i+1),r.n,r.c,r.p,r.i,r.p*r.i,band(r.p*r.i),r.o,r.r,r.a])});PM.download('risk-register.csv',PM.csv(o))});
  rows();draw();
})();
