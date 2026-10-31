/* Gantt Chart Maker — tasks, dependencies (finish-to-start), milestones, progress */
(function(){
  var KEY='pm-gantt-v1',D=86400000;
  var body=document.getElementById('g-body'),chart=document.getElementById('g-chart'),title=document.getElementById('g-title');
  function iso(d){return new Date(d).toISOString().slice(0,10)}
  function today(){var t=new Date();return Date.UTC(t.getFullYear(),t.getMonth(),t.getDate())}
  function sample(){
    var s=today();function d(n){return iso(+s+n*D)}
    return {title:'Website redesign',tasks:[
      {n:'Kick-off & discovery',s:d(0),d:5,dep:'',p:100,m:false},
      {n:'Requirements & sitemap',s:d(5),d:5,dep:'1',p:60,m:false},
      {n:'Visual design',s:d(10),d:8,dep:'2',p:20,m:false},
      {n:'Content writing',s:d(10),d:10,dep:'2',p:10,m:false},
      {n:'Development',s:d(18),d:12,dep:'3',p:0,m:false},
      {n:'QA & UAT',s:d(30),d:5,dep:'4,5',p:0,m:false},
      {n:'Go-live',s:d(35),d:0,dep:'6',p:0,m:true}]};
  }
  var st;try{st=JSON.parse(PM.store(KEY))}catch(e){}
  if(!st||!st.tasks)st=sample();
  function save(){PM.store(KEY,JSON.stringify(st))}
  function schedule(){
    // resolve dependencies: start no earlier than latest predecessor finish
    for(var pass=0;pass<st.tasks.length;pass++){
      st.tasks.forEach(function(t){
        var deps=String(t.dep||'').split(/[ ,;]+/).map(Number).filter(function(x){return x>0&&x<=st.tasks.length&&st.tasks[x-1]!==t});
        deps.forEach(function(i){var p=st.tasks[i-1];var fin=+new Date(p.s)+Math.max(0,+p.d||0)*D;if(+new Date(t.s)<fin)t.s=iso(fin)});
      });
    }
  }
  function rows(){
    body.innerHTML=st.tasks.map(function(t,i){
      return '<tr><td class="muted">'+(i+1)+'</td><td><input data-i="'+i+'" data-f="n" value="'+PM.esc(t.n)+'" aria-label="Task name"></td>'+
      '<td><input type="date" data-i="'+i+'" data-f="s" value="'+t.s+'" aria-label="Start date"></td>'+
      '<td><input type="number" min="0" data-i="'+i+'" data-f="d" value="'+t.d+'" style="width:76px" aria-label="Duration days"></td>'+
      '<td><input data-i="'+i+'" data-f="dep" value="'+PM.esc(t.dep)+'" placeholder="e.g. 1,2" style="width:86px" aria-label="Depends on"></td>'+
      '<td><input type="number" min="0" max="100" data-i="'+i+'" data-f="p" value="'+t.p+'" style="width:70px" aria-label="Progress %"></td>'+
      '<td><input type="checkbox" data-i="'+i+'" data-f="m" '+(t.m?'checked':'')+' aria-label="Milestone" style="width:auto"></td>'+
      '<td><button class="x" data-del="'+i+'" aria-label="Delete task">✕</button></td></tr>';
    }).join('');
  }
  function draw(){
    schedule();
    var ts=st.tasks.filter(function(t){return t.s});
    if(!ts.length){chart.innerHTML='<p class="muted" style="padding:16px">Add a task to see the chart.</p>';return}
    var min=Math.min.apply(null,ts.map(function(t){return +new Date(t.s)}));
    var max=Math.max.apply(null,ts.map(function(t){return +new Date(t.s)+Math.max(1,+t.d||0)*D}));
    min-=D;max+=2*D;var span=(max-min)/D;
    var step=Math.max(1,Math.ceil(span/12));
    var scale='';for(var x=min;x<=max;x+=step*D){var pct=(x-min)/(max-min)*100;var dt=new Date(x);scale+='<span style="left:'+pct+'%">'+dt.toLocaleDateString(undefined,{month:'short',day:'numeric',timeZone:'UTC'})+'</span>'}
    var tp=(+today()-min)/(max-min)*100,todayLine=(tp>=0&&tp<=100)?'<div class="g-today" style="left:'+tp+'%" title="Today"></div>':'';
    var html='<div class="gantt-inner"><div class="g-head"><div class="g-name">Task</div><div class="g-scale">'+scale+'</div></div>';
    st.tasks.forEach(function(t,i){
      var s=+new Date(t.s),l=(s-min)/(max-min)*100,w=Math.max(.6,(Math.max(0,+t.d||0)*D)/(max-min)*100);
      var bar=t.m||(+t.d===0)?'<div class="g-bar ms" style="left:calc('+l+'% - 8px)" title="'+PM.esc(t.n)+' (milestone)"></div>':
        '<div class="g-bar" style="left:'+l+'%;width:'+w+'%;background:'+(t.p>=100?'var(--ok)':'var(--brand)')+'" title="'+PM.esc(t.n)+': '+t.d+' days, '+t.p+'%"><span class="p" style="width:'+Math.min(100,+t.p||0)+'%"></span><span style="position:relative">'+(t.p||0)+'%</span></div>';
      html+='<div class="g-row"><div class="g-name" title="'+PM.esc(t.n)+'">'+(i+1)+'. '+PM.esc(t.n||'Untitled')+'</div><div class="g-track">'+todayLine+bar+'</div></div>';
    });
    chart.innerHTML=html+'</div>';
    var end=new Date(Math.max.apply(null,ts.map(function(t){return +new Date(t.s)+Math.max(0,+t.d||0)*D}))),done=st.tasks.reduce(function(a,t){return a+(+t.d||0)*(+t.p||0)/100},0),tot=st.tasks.reduce(function(a,t){return a+(+t.d||0)},0);
    document.getElementById('g-kpi').innerHTML='<div class="kpi"><small>Tasks</small><b>'+st.tasks.length+'</b></div><div class="kpi"><small>Finish</small><b>'+end.toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'})+'</b></div><div class="kpi"><small>Span</small><b>'+Math.round(span-3)+' days</b></div><div class="kpi good"><small>Weighted progress</small><b>'+(tot?Math.round(done/tot*100):0)+'%</b></div>';
  }
  function refresh(){rows();draw();save()}
  title.value=st.title||'';
  title.addEventListener('input',function(){st.title=title.value;save()});
  body.addEventListener('change',function(e){
    var el=e.target,i=el.getAttribute('data-i'),f=el.getAttribute('data-f');if(i==null)return;
    var t=st.tasks[i];t[f]=el.type==='checkbox'?el.checked:(el.type==='number'?Math.max(0,+el.value||0):el.value);
    if(f==='p')t.p=Math.min(100,t.p);
    refresh();
  });
  body.addEventListener('click',function(e){var d=e.target.getAttribute('data-del');if(d!=null){st.tasks.splice(+d,1);refresh()}});
  document.getElementById('g-add').addEventListener('click',function(){
    var last=st.tasks[st.tasks.length-1];var s=last?iso(+new Date(last.s)+(+last.d||0)*D):iso(today());
    st.tasks.push({n:'New task',s:s,d:3,dep:last?String(st.tasks.length):'',p:0,m:false});refresh();
    var ins=body.querySelectorAll('input[data-f="n"]');ins[ins.length-1].select();
  });
  document.getElementById('g-sample').addEventListener('click',function(){st=sample();title.value=st.title;refresh();PM.toast('Sample project loaded')});
  document.getElementById('g-clear').addEventListener('click',function(){if(confirmClear()){st={title:'',tasks:[]};title.value='';refresh()}});
  function confirmClear(){var b=document.getElementById('g-clear');if(b.dataset.armed){delete b.dataset.armed;b.textContent='Clear all';return true}b.dataset.armed=1;b.textContent='Click again to clear';setTimeout(function(){delete b.dataset.armed;b.textContent='Clear all'},2500);return false}
  document.getElementById('g-csv').addEventListener('click',function(){
    var r=[['#','Task','Start','Duration (days)','Finish','Depends on','Progress %','Milestone']];
    st.tasks.forEach(function(t,i){r.push([i+1,t.n,t.s,t.d,iso(+new Date(t.s)+(+t.d||0)*D),t.dep,t.p,t.m?'Yes':'No'])});
    PM.download((st.title||'project')+'-gantt.csv',PM.csv(r));
  });
  document.getElementById('g-print').addEventListener('click',function(){window.print()});
  document.getElementById('g-import').addEventListener('change',function(e){
    var f=e.target.files[0];if(!f)return;var rd=new FileReader();
    rd.onload=function(){
      var lines=String(rd.result).replace(/^\ufeff/,'').split(/\r?\n/).filter(Boolean).slice(1);
      var out=lines.map(function(l){var c=l.match(/("([^"]|"")*"|[^,]*)(,|$)/g).map(function(x){return x.replace(/,$/,'').replace(/^"|"$/g,'').replace(/""/g,'"')});return {n:c[1]||'Task',s:c[2]||iso(today()),d:+c[3]||0,dep:c[5]||'',p:+c[6]||0,m:/yes/i.test(c[7]||'')}}).filter(function(t){return /^\d{4}-\d{2}-\d{2}$/.test(t.s)});
      if(out.length){st.tasks=out;refresh();PM.toast('Imported '+out.length+' tasks')}else PM.toast('No valid rows found');
    };rd.readAsText(f);e.target.value='';
  });
  refresh();
})();
