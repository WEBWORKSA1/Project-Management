/* Earned Value Management calculator */
(function(){
  var f=document.getElementById('evm'),out=document.getElementById('e-out');
  var KEY='pm-evm-v1';try{var s=JSON.parse(PM.store(KEY));if(s)Object.keys(s).forEach(function(k){if(f[k])f[k].value=s[k]})}catch(e){}
  function v(n){return parseFloat(f[n].value)}
  function verdict(x,good,bad){return x>=1.0?good:bad}
  function calc(){
    var BAC=v('bac'),PV=v('pv'),EV=v('ev'),AC=v('ac'),cur=f.cur.value||'$';
    var st={};['bac','pv','ev','ac','cur'].forEach(function(k){st[k]=f[k].value});PM.store(KEY,JSON.stringify(st));
    if(![BAC,PV,EV,AC].every(isFinite)||BAC<=0){out.innerHTML='<p class="muted">Enter BAC, PV, EV and AC to see results.</p>';return}
    var CV=EV-AC,SV=EV-PV,CPI=AC?EV/AC:NaN,SPI=PV?EV/PV:NaN,EAC=CPI?BAC/CPI:NaN,EAC2=AC+(BAC-EV),EAC3=(CPI&&SPI)?AC+(BAC-EV)/(CPI*SPI):NaN,ETC=EAC-AC,VAC=BAC-EAC,TCPI=(BAC-EV)/(BAC-AC),TCPIe=(BAC-EV)/(EAC-AC);
    var pct=EV/BAC*100,spent=AC/BAC*100;
    function m(x){return isFinite(x)?(x<0?'−':'')+cur+PM.fmt(Math.abs(x),0):'—'}
    function k(lbl,val,cls,tip){return '<div class="kpi '+(cls||'')+'" title="'+(tip||'')+'"><small>'+lbl+'</small><b>'+val+'</b></div>'}
    out.innerHTML='<div class="kpis">'+
      k('Cost variance (CV)',m(CV),CV>=0?'good':'bad','EV − AC')+k('Schedule variance (SV)',m(SV),SV>=0?'good':'bad','EV − PV')+
      k('CPI',PM.fmt(CPI,2),CPI>=1?'good':'bad','EV ÷ AC')+k('SPI',PM.fmt(SPI,2),SPI>=1?'good':'bad','EV ÷ PV')+
      k('EAC (CPI method)',m(EAC),'','BAC ÷ CPI')+k('ETC',m(ETC),'','EAC − AC')+k('VAC',m(VAC),VAC>=0?'good':'bad','BAC − EAC')+k('TCPI (to hit BAC)',PM.fmt(TCPI,2),TCPI<=1?'good':'bad','(BAC − EV) ÷ (BAC − AC)')+'</div>'+
      '<div class="out"><b>Plain-English verdict</b><ul class="mb0">'+
      '<li>'+verdict(CPI,'Under budget: every '+cur+'1 spent is producing '+cur+PM.fmt(CPI,2)+' of planned value.','Over budget: every '+cur+'1 spent is producing only '+cur+PM.fmt(CPI,2)+' of planned value.')+'</li>'+
      '<li>'+verdict(SPI,'Ahead of schedule: work is progressing at '+PM.fmt(SPI*100,0)+'% of the planned rate.','Behind schedule: work is progressing at '+PM.fmt(SPI*100,0)+'% of the planned rate.')+'</li>'+
      '<li>The project is <b>'+PM.fmt(pct,1)+'% complete</b> by value and has spent <b>'+PM.fmt(spent,1)+'%</b> of the budget.</li>'+
      '<li>If current cost performance continues, it will finish at <b>'+m(EAC)+'</b> ('+(VAC>=0?m(VAC)+' under':m(-VAC)+' over')+' budget).</li>'+
      '<li>To finish on the original budget, the remaining work must be done at a CPI of <b>'+PM.fmt(TCPI,2)+'</b>'+(TCPI>1.1?' — historically very hard to achieve; consider re-baselining.':'.')+'</li></ul></div>'+
      '<details class="faq mt"><summary>Alternative EAC formulas</summary><p>EAC if the variance was a one-off (AC + BAC − EV): <b>'+m(EAC2)+'</b><br>EAC if both cost and schedule drive the forecast (AC + (BAC − EV) ÷ (CPI × SPI)): <b>'+m(EAC3)+'</b><br>TCPI to hit the CPI-based EAC: <b>'+PM.fmt(TCPIe,2)+'</b></p></details>';
  }
  f.addEventListener('input',calc);
  document.getElementById('e-sample').addEventListener('click',function(){f.bac.value=200000;f.pv.value=90000;f.ev.value=80000;f.ac.value=95000;calc()});
  calc();
})();
