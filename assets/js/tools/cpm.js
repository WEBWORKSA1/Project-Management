/* Critical Path Method calculator — forward/backward pass, total & free float */
(function(){
  var KEY='pm-cpm-v1',body=document.getElementById('c-body'),out=document.getElementById('c-out');
  function sample(){return [
    {id:'A',n:'Requirements',d:5,p:''},{id:'B',n:'Architecture',d:4,p:'A'},{id:'C',n:'UI design',d:6,p:'A'},
    {id:'D',n:'Backend build',d:10,p:'B'},{id:'E',n:'Frontend build',d:8,p:'C'},{id:'F',n:'Integration',d:3,p:'D,E'},
    {id:'G',n:'Testing',d:5,p:'F'},{id:'H',n:'Training material',d:4,p:'C'},{id:'I',n:'Launch',d:1,p:'G,H'}]}
  var acts;try{acts=JSON.parse(PM.store(KEY))}catch(e){}
  if(!acts||!acts.length)acts=sample();
  function nextId(){var used={};acts.forEach(function(a){used[a.id]=1});for(var i=0;i<702;i++){var s=i<26?String.fromCharCode(65+i):String.fromCharCode(64+Math.floor(i/26))+String.fromCharCode(65+i%26);if(!used[s])return s}return 'X'+acts.length}
  function rows(){
    body.innerHTML=acts.map(function(a,i){return '<tr><td><input data-i="'+i+'" data-f="id" value="'+PM.esc(a.id)+'" style="width:58px;font-weight:700" aria-label="ID"></td><td><input data-i="'+i+'" data-f="n" value="'+PM.esc(a.n)+'" aria-label="Activity"></td><td><input type="number" min="0" step="0.5" data-i="'+i+'" data-f="d" value="'+a.d+'" style="width:80px" aria-label="Duration"></td><td><input data-i="'+i+'" data-f="p" value="'+PM.esc(a.p)+'" placeholder="e.g. A,B" style="width:110px" aria-label="Predecessors"></td><td><button class="x" data-del="'+i+'" aria-label="Delete">✕</button></td></tr>'}).join('');
  }
  function calc(){
    PM.store(KEY,JSON.stringify(acts));
    var map={},err=[];
    acts.forEach(function(a){a.id=String(a.id).trim().toUpperCase();if(map[a.id])err.push('Duplicate ID "'+a.id+'".');map[a.id]=a;a.pre=String(a.p||'').toUpperCase().split(/[ ,;]+/).filter(Boolean)});
    acts.forEach(function(a){a.pre.forEach(function(p){if(!map[p])err.push('Activity '+a.id+' depends on unknown ID "'+p+'".')})});
    if(err.length){out.innerHTML='<div class="notice">'+err.map(PM.esc).join('<br>')+'</div>';return}
    // topological sort (Kahn)
    var indeg={},succ={};acts.forEach(function(a){indeg[a.id]=a.pre.length;succ[a.id]=[]});
    acts.forEach(function(a){a.pre.forEach(function(p){succ[p].push(a.id)})});
    var q=acts.filter(function(a){return !indeg[a.id]}).map(function(a){return a.id}),order=[];
    while(q.length){var x=q.shift();order.push(x);succ[x].forEach(function(s){if(--indeg[s]===0)q.push(s)})}
    if(order.length!==acts.length){out.innerHTML='<div class="notice">Circular dependency detected — check the predecessor column.</div>';return}
    order.forEach(function(id){var a=map[id];a.es=a.pre.reduce(function(m,p){return Math.max(m,map[p].ef)},0);a.ef=a.es+(+a.d||0)});
    var T=Math.max.apply(null,acts.map(function(a){return a.ef}));
    order.slice().reverse().forEach(function(id){var a=map[id];a.lf=succ[id].length?Math.min.apply(null,succ[id].map(function(s){return map[s].ls})):T;a.ls=a.lf-(+a.d||0);a.tf=+(a.ls-a.es).toFixed(4);
      a.ff=+((succ[id].length?Math.min.apply(null,succ[id].map(function(s){return map[s].es})):T)-a.ef).toFixed(4)});
    var crit=order.filter(function(id){return Math.abs(map[id].tf)<1e-9});
    var chains=[];
    crit.filter(function(id){return !map[id].pre.length}).forEach(function(id){(function walk(id,path){var a=map[id];path=path.concat(id);var nx=succ[id].filter(function(s){return Math.abs(map[s].tf)<1e-9&&Math.abs(map[s].es-a.ef)<1e-9});if(!nx.length){if(Math.abs(a.ef-T)<1e-9&&chains.length<6)chains.push(path);return}nx.forEach(function(s){walk(s,path)})})(id,[])});
    var tbl='<div class="tbl-wrap"><table class="tbl"><thead><tr><th>ID</th><th>Activity</th><th>Dur.</th><th>ES</th><th>EF</th><th>LS</th><th>LF</th><th>Total float</th><th>Free float</th><th>Critical</th></tr></thead><tbody>'+
      order.map(function(id){var a=map[id],c=Math.abs(a.tf)<1e-9;return '<tr'+(c?' style="background:color-mix(in srgb,var(--danger) 9%,transparent)"':'')+'><td><b>'+a.id+'</b></td><td>'+PM.esc(a.n)+'</td><td>'+a.d+'</td><td>'+PM.fmt(a.es)+'</td><td>'+PM.fmt(a.ef)+'</td><td>'+PM.fmt(a.ls)+'</td><td>'+PM.fmt(a.lf)+'</td><td>'+PM.fmt(a.tf)+'</td><td>'+PM.fmt(a.ff)+'</td><td>'+(c?'<b style="color:var(--danger)">Yes</b>':'No')+'</td></tr>'}).join('')+'</tbody></table></div>';
    var bars='<div class="gantt"><div class="gantt-inner">'+order.map(function(id){var a=map[id],c=Math.abs(a.tf)<1e-9;var l=T?a.es/T*100:0,w=T?(+a.d||0)/T*100:0,fl=T?a.tf/T*100:0;
      return '<div class="g-row"><div class="g-name">'+a.id+' · '+PM.esc(a.n)+'</div><div class="g-track"><div class="g-bar" style="left:'+l+'%;width:'+Math.max(w,.5)+'%;background:'+(c?'var(--danger)':'var(--brand)')+'">'+a.d+'</div>'+(fl>0?'<div class="g-bar" style="left:'+(l+w)+'%;width:'+fl+'%;background:transparent;border:1.5px dashed var(--muted);color:var(--muted)" title="Total float">float '+PM.fmt(a.tf)+'</div>':'')+'</div></div>'}).join('')+'</div></div>';
    out.innerHTML='<div class="kpis"><div class="kpi bad"><small>Project duration</small><b>'+PM.fmt(T)+' days</b></div><div class="kpi"><small>Activities</small><b>'+acts.length+'</b></div><div class="kpi"><small>Critical activities</small><b>'+crit.length+'</b></div></div>'+
      '<div class="out"><b>Critical path'+(chains.length>1?'s':'')+':</b> '+chains.map(function(c){return c.join(' → ')}).join(' &nbsp;|&nbsp; ')+'<br><span class="small muted">Any delay to a red activity delays the whole project by the same amount. Dashed boxes show how long other activities can slip.</span></div>'+bars+'<h3 class="mt">Schedule table</h3>'+tbl;
    out._csv=[['ID','Activity','Duration','ES','EF','LS','LF','Total float','Free float','Critical']].concat(order.map(function(id){var a=map[id];return [a.id,a.n,a.d,a.es,a.ef,a.ls,a.lf,a.tf,a.ff,Math.abs(a.tf)<1e-9?'Yes':'No']}));
  }
  body.addEventListener('change',function(e){var i=e.target.dataset.i,f=e.target.dataset.f;if(i==null)return;acts[i][f]=f==='d'?Math.max(0,+e.target.value||0):e.target.value;if(f==='id')rows();calc()});
  body.addEventListener('click',function(e){if(e.target.dataset.del!=null){acts.splice(+e.target.dataset.del,1);rows();calc()}});
  document.getElementById('c-add').addEventListener('click',function(){var last=acts[acts.length-1];acts.push({id:nextId(),n:'New activity',d:2,p:last?last.id:''});rows();calc()});
  document.getElementById('c-sample').addEventListener('click',function(){acts=sample();rows();calc()});
  document.getElementById('c-clear').addEventListener('click',function(){acts=[{id:'A',n:'First activity',d:1,p:''}];rows();calc()});
  document.getElementById('c-csv').addEventListener('click',function(){if(out._csv)PM.download('critical-path.csv',PM.csv(out._csv))});
  rows();calc();
})();
