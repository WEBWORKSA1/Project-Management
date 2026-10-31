/* Meeting cost calculator with live timer */
(function(){
  var f=document.getElementById('m-form'),out=document.getElementById('m-out'),live=document.getElementById('m-live'),btn=document.getElementById('m-timer'),t0=null,iv=null;
  function rate(){var n=+f.people.value||0,sal=+f.salary.value||0,ov=1+(+f.overhead.value||0)/100,hrs=+f.hours.value||2080;return n*sal*ov/hrs}
  function calc(){
    var r=rate(),mins=+f.mins.value||0,freq=+f.freq.value||0,cur=f.cur.value||'$';var one=r*mins/60,yr=one*freq;
    out.innerHTML='<div class="kpis"><div class="kpi"><small>Cost per minute</small><b>'+cur+PM.fmt(r/60,2)+'</b></div><div class="kpi bad"><small>This meeting</small><b>'+cur+PM.fmt(one,0)+'</b></div><div class="kpi bad"><small>Per year</small><b>'+cur+PM.fmt(yr,0)+'</b></div><div class="kpi"><small>Person-hours / year</small><b>'+PM.fmt((+f.people.value||0)*mins/60*freq,0)+'</b></div></div>'+
    '<div class="out small">Cutting this meeting by 15 minutes saves <b>'+cur+PM.fmt(r*15/60*freq,0)+'</b> a year. Removing two attendees saves <b>'+cur+PM.fmt((+f.people.value>2?r*2/(+f.people.value):0)*mins/60*freq,0)+'</b>.</div>';
  }
  function tick(){var s=(Date.now()-t0)/1000;live.textContent=(f.cur.value||'$')+PM.fmt(rate()*s/3600,2)+'  ·  '+Math.floor(s/60)+':'+('0'+Math.floor(s%60)).slice(-2)}
  btn.addEventListener('click',function(){if(iv){clearInterval(iv);iv=null;btn.textContent='▶ Start live timer'}else{t0=Date.now();iv=setInterval(tick,250);btn.textContent='■ Stop';tick()}});
  f.addEventListener('input',calc);calc();
})();
