/* PMP & CAPM eligibility checker (guidance only) */
(function(){
  var f=document.getElementById('el'),out=document.getElementById('el-out');if(!f)return;
  function run(){
    var edu=f.edu.value,months=+f.months.value||0,hours=+f.hours.value||0,capm=f.capm.checked;
    var need=edu==='gac'?24:edu==='degree'?36:60,trainOk=hours>=35||capm;
    var expOk=months>=need,pmp=expOk&&trainOk,capmOk=hours>=23;
    var h='<div class="kpis"><div class="kpi '+(pmp?'good':'bad')+'"><small>PMP®</small><b>'+(pmp?'Likely eligible':'Not yet')+'</b></div><div class="kpi '+(capmOk?'good':'bad')+'"><small>CAPM®</small><b>'+(capmOk?'Likely eligible':'Not yet')+'</b></div></div><div class="out small"><ul class="mb0">';
    h+='<li>Experience: you have <b>'+months+'</b> of the <b>'+need+'</b> months of project leadership experience (within the last 8 years) required for your education level. '+(expOk?'✓':'You need <b>'+(need-months)+'</b> more months.')+'</li>';
    h+='<li>Education: '+(trainOk?'✓ requirement met'+(capm&&hours<35?' via your CAPM®':''):'you need <b>'+(35-hours)+'</b> more hours of project management education (or hold the CAPM®).')+'</li>';
    h+='<li>CAPM® needs 23 hours of project management education'+(capmOk?' — ✓ met.':' — you need <b>'+(23-hours)+'</b> more hours.')+'</li></ul></div>';
    h+='<p class="small muted mt">Guidance only, based on PMI\'s published requirements at the time of writing. Always confirm in the official certification handbook before applying.</p>';
    out.innerHTML=h;
  }
  f.addEventListener('input',run);run();
})();
