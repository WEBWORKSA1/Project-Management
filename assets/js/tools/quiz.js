/* Methodology selector quiz */
(function(){
  var Q=[
   ['How well defined are the requirements today?',[['Fixed and documented; unlikely to change',{w:3,h:1}],['Mostly known, some details will emerge',{h:2,w:1,s:1}],['Vague — we will learn as we go',{s:2,a:2,k:1}]]],
   ['How often can you deliver something usable to customers?',[['Only at the end (e.g. a building, an event)',{w:3}],['Every few weeks',{s:3,a:1}],['Continuously, any time',{k:3,a:1}]]],
   ['What kind of work is it mostly?',[['New product or feature development',{s:2,a:2}],['Ongoing support, ops or a request queue',{k:3}],['Physical/engineering work with strict sequencing',{w:3,h:1}],['A mix of planned phases and iterative work',{h:3}]]],
   ['How involved can the customer or sponsor be?',[['Available every week for feedback',{s:2,a:2}],['Monthly check-ins',{h:2,k:1}],['Sign-off at phase gates only',{w:3}]]],
   ['How strict is your regulatory or contractual environment?',[['Very strict — fixed scope, audits, documentation',{w:3,h:1}],['Some compliance, some flexibility',{h:2}],['Light — we can change course freely',{a:2,s:1,k:1}]]],
   ['How big and stable is the team?',[['Small (3–9), dedicated, cross-functional',{s:3,a:1}],['Specialists who rotate in and out',{k:2,w:1}],['Several teams or vendors coordinating',{h:3,w:1}]]],
   ['What hurts most if it goes wrong?',[['Missing a fixed deadline or budget',{w:2,h:2}],['Building the wrong thing',{s:2,a:2}],['Work piling up and slow turnaround',{k:3}]]],
   ['How do priorities change?',[['Rarely — the plan is the plan',{w:3}],['Between iterations, not during',{s:3}],['Daily; urgent work arrives constantly',{k:3}],['Big priorities are fixed; details shift',{h:2,a:1}]]]
  ];
  var N={w:'Waterfall',s:'Scrum',k:'Kanban',a:'Agile (general)',h:'Hybrid'},D={
   w:['Plan the whole project up front, then execute phase by phase with formal sign-offs.','learn/waterfall-methodology.html','tools/gantt-chart-maker.html','Gantt chart maker'],
   s:['Work in fixed sprints with a Product Owner, Scrum Master and a dedicated team.','learn/scrum-guide.html','tools/sprint-capacity-planner.html','Sprint capacity planner'],
   k:['Visualise work, limit work-in-progress and optimise flow — no sprints needed.','learn/kanban-method.html','tools/kanban-board.html','Kanban board'],
   a:['Use agile values and short feedback loops; choose practices that fit your team.','learn/agile-project-management.html','tools/kanban-board.html','Kanban board'],
   h:['Plan milestones and governance up front, deliver the work inside them iteratively.','learn/agile-vs-waterfall.html','tools/gantt-chart-maker.html','Gantt chart maker']};
  var box=document.getElementById('qz'),res=document.getElementById('qz-res'),bar=document.getElementById('qz-bar'),ans=[],cur=0,R=document.documentElement.getAttribute('data-root')||'';
  function show(){
    bar.style.width=(cur/Q.length*100)+'%';
    if(cur>=Q.length){return result()}
    var q=Q[cur];box.innerHTML='<p class="muted small">Question '+(cur+1)+' of '+Q.length+'</p><h3>'+q[0]+'</h3><div class="choice-grid" style="grid-template-columns:1fr">'+q[1].map(function(o,i){return '<label class="choice"><input type="radio" name="q" value="'+i+'"><span>'+o[0]+'</span></label>'}).join('')+'</div>'+(cur?'<button class="btn btn-ghost btn-sm mt" id="qz-back">← Back</button>':'');
    box.querySelectorAll('input').forEach(function(i){i.addEventListener('change',function(){ans[cur]=+i.value;cur++;setTimeout(show,180)})});
    var b=document.getElementById('qz-back');if(b)b.addEventListener('click',function(){cur--;show()});
  }
  function result(){
    var sc={w:0,s:0,k:0,a:0,h:0};ans.forEach(function(a,i){var m=Q[i][1][a][1];Object.keys(m).forEach(function(k){sc[k]+=m[k]})});
    var tot=Object.keys(sc).reduce(function(a,k){return a+sc[k]},0)||1,ord=Object.keys(sc).sort(function(a,b){return sc[b]-sc[a]}),top=ord[0],d=D[top];
    box.innerHTML='';res.hidden=false;
    res.innerHTML='<span class="eyebrow">Your best fit</span><h2>'+N[top]+'</h2><p class="lead">'+d[0]+'</p><div class="bars">'+ord.map(function(k){var p=Math.round(sc[k]/tot*100);return '<div class="b"><b>'+N[k]+'</b><span style="width:'+Math.max(p,2)+'%"></span><small>'+p+'%</small></div>'}).join('')+'</div>'+
      '<p class="mt">Runner-up: <b>'+N[ord[1]]+'</b>. Close scores usually mean a hybrid approach will work best.</p><div class="toolbar mt"><a class="btn btn-primary" href="'+R+d[1]+'">Read the '+N[top]+' guide</a><a class="btn btn-ghost" href="'+R+d[2]+'">Open the '+d[3]+'</a><button class="btn btn-ghost" id="qz-again">Retake quiz</button></div>'+
      '<div class="out mt"><b>Want a second opinion?</b> Send your result to a PM consultant for a free 15-minute review. <a href="'+R+'get-help.html?need=Consultant%20%2F%20project%20rescue&amp;details=Methodology%20quiz%20result%3A%20'+encodeURIComponent(N[top])+'">Request a review →</a></div>';
    document.getElementById('qz-again').addEventListener('click',function(){ans=[];cur=0;res.hidden=true;show()});
  }
  show();
})();
