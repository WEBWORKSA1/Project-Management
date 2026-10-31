/* Kanban board — drag & drop, WIP limits, priorities, CSV export */
(function(){
  var KEY='pm-kanban-v1',board=document.getElementById('k-board');
  var COLS=[['backlog','Backlog'],['todo','To do'],['doing','In progress'],['done','Done']];
  function sample(){return {wip:{backlog:0,todo:6,doing:3,done:0},cards:[
    {id:1,t:'Define project goals & success metrics',o:'Alex',p:'h',c:'done',due:''},
    {id:2,t:'Stakeholder interviews',o:'Sam',p:'m',c:'done',due:''},
    {id:3,t:'Draft product requirements',o:'Alex',p:'h',c:'doing',due:''},
    {id:4,t:'Wireframes for checkout',o:'Priya',p:'m',c:'doing',due:''},
    {id:5,t:'Set up CI pipeline',o:'Jordan',p:'l',c:'todo',due:''},
    {id:6,t:'Vendor security review',o:'Sam',p:'h',c:'todo',due:''},
    {id:7,t:'Analytics dashboard',o:'',p:'l',c:'backlog',due:''},
    {id:8,t:'Localisation (FR/ES)',o:'',p:'m',c:'backlog',due:''}]}}
  var st;try{st=JSON.parse(PM.store(KEY))}catch(e){}
  if(!st||!st.cards)st=sample();
  function save(){PM.store(KEY,JSON.stringify(st))}
  function draw(){
    board.innerHTML=COLS.map(function(c,ci){
      var cards=st.cards.filter(function(k){return k.c===c[0]});
      var lim=+st.wip[c[0]]||0,over=lim&&cards.length>lim;
      return '<div class="col'+(over?' wip-over':'')+'" data-col="'+c[0]+'"><h3>'+c[1]+' <span>'+cards.length+(lim?'/'+lim:'')+'</span></h3>'+
        cards.map(function(k){
          return '<div class="kcard prio-'+k.p+'" draggable="true" data-id="'+k.id+'"><div>'+PM.esc(k.t)+'</div><div class="k-meta"><span>'+(k.o?'👤 '+PM.esc(k.o):'Unassigned')+(k.due?' · 📅 '+PM.esc(k.due):'')+'</span><span>'+
          (ci>0?'<button class="x" data-mv="-1" data-id="'+k.id+'" aria-label="Move left">←</button>':'')+
          (ci<COLS.length-1?'<button class="x" data-mv="1" data-id="'+k.id+'" aria-label="Move right">→</button>':'')+
          '<button class="x" data-del="'+k.id+'" aria-label="Delete card">✕</button></span></div></div>';
        }).join('')+(over?'<p class="small" style="color:var(--danger)">WIP limit exceeded — finish work before starting more.</p>':'')+'</div>';
    }).join('');
    var done=st.cards.filter(function(k){return k.c==='done'}).length;
    document.getElementById('k-kpi').innerHTML='<div class="kpi"><small>Total cards</small><b>'+st.cards.length+'</b></div><div class="kpi"><small>In progress</small><b>'+st.cards.filter(function(k){return k.c==='doing'}).length+'</b></div><div class="kpi good"><small>Done</small><b>'+done+'</b></div><div class="kpi"><small>Completion</small><b>'+(st.cards.length?Math.round(done/st.cards.length*100):0)+'%</b></div>';
    COLS.forEach(function(c){var i=document.getElementById('wip-'+c[0]);if(i)i.value=st.wip[c[0]]||0});
    save();
  }
  var dragId=null;
  board.addEventListener('dragstart',function(e){var c=e.target.closest('.kcard');if(!c)return;dragId=+c.dataset.id;c.classList.add('dragging');e.dataTransfer.effectAllowed='move';try{e.dataTransfer.setData('text/plain',dragId)}catch(x){}});
  board.addEventListener('dragend',function(e){var c=e.target.closest('.kcard');if(c)c.classList.remove('dragging')});
  board.addEventListener('dragover',function(e){var col=e.target.closest('.col');if(!col)return;e.preventDefault();Array.prototype.forEach.call(board.querySelectorAll('.col'),function(x){x.classList.toggle('over',x===col)})});
  board.addEventListener('dragleave',function(e){if(!board.contains(e.relatedTarget))Array.prototype.forEach.call(board.querySelectorAll('.col'),function(x){x.classList.remove('over')})});
  board.addEventListener('drop',function(e){var col=e.target.closest('.col');if(!col||dragId==null)return;e.preventDefault();
    var k=st.cards.find(function(x){return x.id===dragId});if(k){k.c=col.dataset.col;
      // reorder: move to end of target column
      st.cards.splice(st.cards.indexOf(k),1);st.cards.push(k)}
    dragId=null;draw()});
  board.addEventListener('click',function(e){
    var b=e.target.closest('button');if(!b)return;var id=+b.dataset.id||+b.dataset.del;
    if(b.dataset.del){st.cards=st.cards.filter(function(k){return k.id!==+b.dataset.del});draw();return}
    if(b.dataset.mv){var k=st.cards.find(function(x){return x.id===id});var i=COLS.findIndex(function(c){return c[0]===k.c});k.c=COLS[Math.max(0,Math.min(COLS.length-1,i+(+b.dataset.mv)))][0];draw()}
  });
  document.getElementById('k-form').addEventListener('submit',function(e){
    e.preventDefault();var f=e.target;if(!f.t.value.trim())return;
    var id=st.cards.reduce(function(a,k){return Math.max(a,k.id)},0)+1;
    st.cards.push({id:id,t:f.t.value.trim(),o:f.o.value.trim(),p:f.p.value,c:f.c.value,due:f.due.value});f.t.value='';f.t.focus();draw();
  });
  COLS.forEach(function(c){var i=document.getElementById('wip-'+c[0]);if(i)i.addEventListener('change',function(){st.wip[c[0]]=Math.max(0,+i.value||0);draw()})});
  document.getElementById('k-sample').addEventListener('click',function(){st=sample();draw();PM.toast('Sample board loaded')});
  document.getElementById('k-clear').addEventListener('click',function(){st.cards=[];draw()});
  document.getElementById('k-csv').addEventListener('click',function(){
    var r=[['ID','Card','Owner','Priority','Column','Due']];var P={h:'High',m:'Medium',l:'Low'};var C={};COLS.forEach(function(c){C[c[0]]=c[1]});
    st.cards.forEach(function(k){r.push([k.id,k.t,k.o,P[k.p],C[k.c],k.due])});PM.download('kanban-board.csv',PM.csv(r));
  });
  draw();
})();
