/* KARIM SAAB — health knowledge branch. Additive, bilingual and reversible. */
(function(){
'use strict';
const L=(ar,en)=>state.lang==='ar'?ar:en;
const route=(s)=>path(s);
const ae=(v)=>String(v||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const library=window.KARIM_HEALTH_CONTENT||{};
const originRoute='about/health';
const articleRoute='about/health/depression-anxiety';
const readRouteName='about/health/depression-anxiety/read';
function navTrail(items){
 return '<nav class="ks-health-crumb" aria-label="'+L('مسار التصفح','Breadcrumb')+'">'+
 [{t:L('الرئيسية','Home'),r:''},{t:L('من أنا','About Me'),r:'about'},...items].map(x=>x.r===null?'<span aria-current="page">'+ae(x.t)+'</span>':'<a href="'+route(x.r)+'">'+ae(x.t)+'</a>').join('<span aria-hidden="true">›</span>')+'</nav>';
}
function intro(){
 return '<section class="ks-health-intro"><div class="container">'+
 '<span class="eyebrow">KARIM SAAB / HEALTH KNOWLEDGE</span>'+
 '<h1>'+L('ماذا تعرف عن صحتك؟','What Do You Know About Your Health?')+'</h1>'+
 '<p>'+L('مقالات توعوية مدعومة بمراجع طبية، تساعد على طرح الأسئلة الصحيحة دون أن تحل محل الطبيب.','Evidence-informed health articles that help ask better questions without replacing a clinician.')+'</p></div></section>';
}
function overview(){
 return '<main class="ks-health-main">'+intro()+'<section class="page-body"><div class="container">'+
 navTrail([{t:L('ماذا تعرف عن صحتك؟','Health Knowledge'),r:null}])+
 '<div class="ks-health-overview-card"><div class="ks-health-overview-icon" aria-hidden="true">♡</div>'+
 '<div><span class="eyebrow">'+L('المقال الأول • الصحة النفسية والجسدية','ARTICLE 01 • MIND & BODY')+'</span>'+
 '<h2>'+L('علاج الاكتئاب والقلق','Depression and Anxiety')+'</h2>'+
 '<p>'+L('كيف يمكن أن تتشابه بعض أعراض الاكتئاب مع اضطرابات جسدية؟ وما التحاليل التي قد يناقشها المريض مع الطبيب؟','When can physical conditions resemble depression, and which tests might a clinician consider?')+'</p>'+
 '<a class="ks-health-button" href="'+route(articleRoute)+'">'+L('افتح المقال','Open article')+' ↗</a></div></div>'+
 '</div></section></main>';
}
function sourcePanel(){
 const url=library.sourceDriveUrl;
 return '<aside class="ks-health-source">'+
 '<div class="ks-health-source-heading"><span aria-hidden="true">▤</span><h3>'+L('نسخة المقال ومرجعه','Article source & reference')+'</h3></div>'+
 '<p>'+L('النسخة الأصلية المعتمدة للأرشفة: ملف Word باسم عبدالكريم بن إبراهيم الصعب، مع المصادر والملاحظات الطبية.','Canonical archive copy: a Word document credited to Abdulkarim bin Ibrahim Al Saab, with medical references and editorial notes.')+'</p>'+
 '<p class="ks-health-source-filename"><bdi>'+ae(library.sourceFile)+'</bdi></p>'+
 (url?'<a class="ks-health-source-link" href="'+ae(url)+'" target="_blank" rel="noopener noreferrer">'+L('افتح الأصل في Google Drive','Open the original on Google Drive')+' ↗</a>':
 '<p class="ks-health-awaiting">'+L('رابط Google Drive لم يُفعّل بعد؛ النسخة لم تُرفع إلى المجلد المحدد. يمكن قراءة المقال كاملًا داخل الموقع.','Google Drive link pending: the source has not yet been uploaded to a selected folder. The article can be read in full here.')+'</p>')+
 '</aside>';
}
function preview(){
 const img='<img src="assets/health-depression-symbolic.svg" alt="'+L('رسم رمزي عن الترابط بين الدماغ وصحة الجسم والفحوص الطبية','Symbolic illustration of mental and physical health and laboratory assessment')+'" loading="eager">';
 return '<main class="ks-health-main">'+
 '<section class="ks-health-article-head"><div class="container">'+
 '<span class="eyebrow">KARIM SAAB / HEALTH ARTICLE 01</span>'+
 '<h1>'+L('علاج الاكتئاب والقلق','Depression and Anxiety')+'</h1>'+
 '<p>'+L('هل الاكتئاب دائمًا مرضًا نفسيًا؟ قراءة في الأسباب الجسدية المحتملة والفحوص المناسبة ودور الطبيب النفسي.','Is depression always a purely psychological condition? Understanding possible physical contributors, appropriate testing, and mental healthcare.')+'</p></div></section>'+
 '<section class="page-body"><div class="container">'+
 navTrail([{t:L('ماذا تعرف عن صحتك؟','Health Knowledge'),r:originRoute},{t:L('علاج الاكتئاب والقلق','Depression and Anxiety'),r:null}])+
 '<div class="ks-health-feature-grid"><div class="ks-health-feature-image">'+img+
 '<div class="ks-health-feature-caption"><span class="eyebrow">'+L('مقتطف من المقال','FROM THE ARTICLE')+'</span>'+
 '<h2>'+L('هل الاكتئاب دائمًا مرضًا نفسيًا؟','Is depression always a mental illness?')+'</h2>'+
 '<p>'+L('قد تستيقظ في أحد الأيام وأنت تشعر بضيق غريب في صدرك؛ لا شيء يسعدك، ولا تعرف لماذا تريد البكاء. قد تتشابه بعض الأعراض مع قصور الغدة الدرقية وفقر الدم ونقص بعض المغذيات؛ لكن التشخيص لا يقوم على التخمين.','Low mood, exhaustion, or an urge to cry can overlap with symptoms of thyroid disease, anemia, or nutritional deficiencies. These possibilities deserve proper medical assessment, not guesswork.')+'</p>'+
 '</div></div>'+
 '<div class="ks-health-feature-info">'+
 '<span class="eyebrow">'+L('بقلم عبدالكريم بن إبراهيم الصعب','By Abdulkarim bin Ibrahim Al Saab')+'</span>'+
 '<h2>'+L('ماذا ستقرأ في المقال؟','Inside this article')+'</h2>'+
 '<ul><li>'+L('متى تتشابه الأعراض النفسية والجسدية؟','How physical and mental symptoms can overlap')+'</li>'+
 '<li>'+L('التحاليل ورموزها الطبية بالعربية والإنجليزية','Laboratory tests and medical abbreviations')+'</li>'+
 '<li>'+L('الغدة الدرقية والحديد وفيتامين B12','Thyroid, iron and vitamin B12')+'</li>'+
 '<li>'+L('ماذا تقول الدراسات عن فيتامين د والمغنيسيوم؟','Evidence on vitamin D and magnesium')+'</li>'+
 '<li>'+L('متى تكون زيارة الطبيب النفسي ضرورية؟','When mental health care is needed')+'</li>'+
 '<li>'+L('ستة مراجع علمية وملاحظات طبية','Six references and clinical notes')+'</li></ul>'+
 sourcePanel()+'</div></div>'+
 '<div class="ks-health-actions"><a class="ks-health-button ks-health-button-strong" href="'+route(readRouteName)+'">'+L('اقرأ المقال كاملًا داخل الموقع','Read the full article on this site')+' ↗</a>'+
 '<a class="ks-health-button ks-health-button-outline" href="'+route(originRoute)+'">'+L('بقية مقالات الصحة','More health articles')+'</a></div>'+
 '<p class="ks-health-disclaimer">'+L('محتوى للتثقيف الصحي وليس بديلًا عن التشخيص أو العلاج.','For health education only; not a substitute for diagnosis or treatment.')+'</p>'+
 '</div></section></main>';
}
function stylize(s){
 const safe=ae(s);
 return safe.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>')
 .replace(/\*([^*]+)\*/g,'<em>$1</em>')
 .replace(/(https:\/\/[^\s<]+)/g,(u)=>'<a href="'+u.replace(/[.,؛،]$/,'')+'" target="_blank" rel="noopener noreferrer">'+u+'</a>');
}
function mdToHtml(source){
 const lines=String(source||'').split(/\r?\n/);
 let out='',paragraph=[],inList=false;
 function flushP(){if(paragraph.length){out+='<p>'+stylize(paragraph.join(' '))+'</p>';paragraph=[];}}
 function closeList(){if(inList){out+='</ol>';inList=false;}}
 for(let i=0;i<lines.length;i++){
  const l=lines[i].trim();
  if(!l){flushP();closeList();continue;}
  if(l.startsWith('|')&&l.endsWith('|')){
   flushP();closeList();let entries=[];
   while(i<lines.length && lines[i].trim().startsWith('|')){entries.push(lines[i].trim().slice(1,-1).split('|').map(v=>v.trim()));i++}i--;
   entries=entries.filter(a=>!a.every(x=>/^:?-{2,}:?$/.test(x)));
   if(entries.length){out+='<div class="ks-health-table-scroll"><table><thead><tr>'+entries[0].map(x=>'<th>'+stylize(x)+'</th>').join('')+'</tr></thead><tbody>'+
    entries.slice(1).map(row=>'<tr>'+row.map(x=>'<td>'+stylize(x)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';}
   continue;
  }
  const heading=l.match(/^(#{1,3})\s+(.+)$/);
  if(heading){flushP();closeList();if(heading[1].length>1)out+='<h2>'+stylize(heading[2])+'</h2>';continue;}
  const list=l.match(/^\d+\.\s+(.+)$/);
  if(list){flushP();if(!inList){out+='<ol>';inList=true;}out+='<li>'+stylize(list[1])+'</li>';continue;}
  closeList();paragraph.push(l);
 }
 flushP();closeList();return out;
}
function fullArticle(){
 const txt=library[state.lang]||library.ar||'';
 return '<main class="ks-health-main">'+
 '<section class="ks-health-article-head"><div class="container">'+
 '<span class="eyebrow">KARIM SAAB / HEALTH KNOWLEDGE • V1.0</span>'+
 '<h1>'+L('هل الاكتئاب دائمًا مرضًا نفسيًا؟','Is Depression Always a Mental Illness?')+'</h1>'+
 '<p>'+L('النص الكامل مع رموز التحاليل والملاحظات والمراجع العلمية.','Complete article, laboratory abbreviations, medical notes and references.')+'</p></div></section>'+
 '<section class="page-body"><div class="container">'+
 navTrail([{t:L('ماذا تعرف عن صحتك؟','Health Knowledge'),r:originRoute},{t:L('علاج الاكتئاب والقلق','Depression and Anxiety'),r:articleRoute},{t:L('المقال الكامل','Full article'),r:null}])+
 '<div class="ks-health-reader-grid"><article class="ks-health-reading" dir="'+(state.lang==='ar'?'rtl':'ltr')+'">'+
 '<p class="ks-health-byline">'+L('بقلم عبدالكريم بن إبراهيم الصعب','By Abdulkarim bin Ibrahim Al Saab')+' • 10/11/2026</p>'+
 mdToHtml(txt)+
 '</article>'+sourcePanel()+'</div>'+
 '<div class="ks-health-actions"><a class="ks-health-button" href="'+route(articleRoute)+'">'+L('العودة لملخص المقال','Back to summary')+'</a></div>'+
 '</div></section></main>';
}
function mountHealth(){
 const r=(state.route||'').split('?')[0];
 let html=null;
 if(r===originRoute)html=overview();
 else if(r===articleRoute)html=preview();
 else if(r===readRouteName)html=fullArticle();
 if(!html)return;
 const main=document.querySelector('#app > main');
 if(main)main.outerHTML=html;
 const title=document.querySelector('#app > main h1');
 if(title){document.title=title.textContent+' | KARIM SAAB';const m=document.querySelector('meta[name="description"]');if(m)m.content=L('مقال توعوي حول الاكتئاب والقلق والأسباب الجسدية المحتملة، بقلم عبدالكريم بن إبراهيم الصعب.','An evidence-informed article on depression, anxiety and possible medical contributors by KARIM SAAB.');}
}
window.addEventListener('hashchange',mountHealth);
mountHealth();
})();