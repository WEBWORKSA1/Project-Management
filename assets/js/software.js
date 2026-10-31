/* Vendor-neutral PM software matcher */
(function(){
  var S={ // traits 0-3
   'Asana':{simple:3,agile:2,gantt:2,enterprise:2,free:2,docs:1,dev:1,url:'https://asana.com/',why:'clean UI, timelines, portfolios and strong cross-team workflows'},
   'monday.com':{simple:3,agile:1,gantt:2,enterprise:2,free:1,docs:1,dev:1,url:'https://monday.com/',why:'highly visual boards, automations and dashboards non-technical teams pick up fast'},
   'ClickUp':{simple:1,agile:2,gantt:3,enterprise:2,free:3,docs:3,dev:2,url:'https://clickup.com/',why:'all-in-one tasks, docs, Gantt and goals with a generous free tier'},
   'Jira':{simple:0,agile:3,gantt:2,enterprise:3,free:2,docs:1,dev:3,url:'https://www.atlassian.com/software/jira',why:'the deepest Scrum/Kanban support and developer integrations'},
   'Trello':{simple:3,agile:1,gantt:0,enterprise:0,free:3,docs:0,dev:1,url:'https://trello.com/',why:'the simplest Kanban boards for small teams and personal projects'},
   'Wrike':{simple:1,agile:1,gantt:3,enterprise:3,free:1,docs:1,dev:1,url:'https://www.wrike.com/',why:'robust Gantt, resource management and request forms for larger teams'},
   'Smartsheet':{simple:1,agile:0,gantt:3,enterprise:3,free:0,docs:1,dev:0,url:'https://www.smartsheet.com/',why:'a spreadsheet-like interface with Gantt, reports and enterprise controls'},
   'Notion':{simple:2,agile:1,gantt:1,enterprise:1,free:3,docs:3,dev:1,url:'https://www.notion.so/',why:'docs, wikis and lightweight project databases in one flexible workspace'},
   'Basecamp':{simple:3,agile:0,gantt:0,enterprise:0,free:1,docs:2,dev:0,url:'https://basecamp.com/',why:'calm, communication-first project spaces with flat pricing'},
   'Microsoft Project / Planner':{simple:1,agile:1,gantt:3,enterprise:3,free:0,docs:1,dev:0,url:'https://www.microsoft.com/microsoft-365/project/project-management-software',why:'tight Microsoft 365 integration and classic scheduling depth'},
   'Zoho Projects':{simple:2,agile:1,gantt:3,enterprise:1,free:2,docs:1,dev:1,url:'https://www.zoho.com/projects/',why:'strong value for money with Gantt, timesheets and the wider Zoho suite'},
   'OpenProject':{simple:1,agile:2,gantt:3,enterprise:2,free:3,docs:1,dev:2,url:'https://www.openproject.org/',why:'open-source, self-hostable, with Gantt and agile boards — good for data sovereignty'}};
  var f=document.getElementById('sm'),out=document.getElementById('sm-out');if(!f)return;
  f.addEventListener('submit',function(e){
    e.preventDefault();var w={simple:+f.simple.value,agile:+f.style.value==2?3:(+f.style.value==1?1:0),gantt:+f.style.value==0?3:(+f.style.value==1?2:0),enterprise:+f.size.value,free:+f.budget.value,docs:f.docs.checked?3:0,dev:f.dev.checked?3:0};
    var res=Object.keys(S).map(function(n){var t=S[n],sc=0,mx=0;Object.keys(w).forEach(function(k){sc+=w[k]*t[k];mx+=w[k]*3});return [n,mx?Math.round(sc/mx*100):0]}).sort(function(a,b){return b[1]-a[1]}).slice(0,3);
    out.hidden=false;
    out.innerHTML='<h3>Your top matches</h3>'+res.map(function(r,i){var t=S[r[0]];return '<div class="card" style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><h3 class="mb0">'+(i+1)+'. '+r[0]+'</h3><b style="color:var(--brand)">'+r[1]+'% match</b></div><p class="mt">Why: '+t.why+'.</p><a class="more" href="'+t.url+'" target="_blank" rel="nofollow sponsored noopener">Visit '+r[0]+' ↗</a></div>'}).join('')+
      '<div class="out"><b>Want a human second opinion?</b> Get a free personalised shortlist with pricing notes for your team size. <a href="'+(document.documentElement.getAttribute('data-root')||'')+'get-help.html?need=Software%20recommendation&details='+encodeURIComponent('Matcher results: '+res.map(function(r){return r[0]+' '+r[1]+'%'}).join(', '))+'">Get my free shortlist →</a></div>';
    out.scrollIntoView({behavior:'smooth',block:'start'});
  });
})();
