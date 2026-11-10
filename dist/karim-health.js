/* KARIM SAAB — Health Knowledge V1: bilingual, additive, review branch.
 * Editorial mirror: canonical signed Word article remains a separate Drive archive.
 * Do not expose a Drive link until the document has actually been archived.
 */
(function(){
'use strict';
var driveFileUrl = 'https://docs.google.com/document/d/1Y-pXXYnV8qt0odbFfWUahOm3HgKHxrRZ/edit?usp=drivesdk&ouid=105264344871183356483&rtpof=true&sd=true'; // Verified original Word document in the owner's Google Drive archive.
var articleRoute = 'about/health/depression-anxiety';
var fullRoute = articleRoute + '/full';
var ar = function(){return state.lang==='ar';};
var L = function(a,e){return ar()?a:e;};
var safe = function(s){return esc(String(s));};
var paragraph = function(s){return '<p>'+safe(s).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')+'</p>';};
var paragraphs = function(xs){return xs.map(paragraph).join('');};
var imgUrl = 'assets/health-depression-illustration.svg';
var sectionData = [
{
arTitle:'ما المقصود بعبارة «الاكتئاب العضوي»؟',enTitle:'What does “organic depression” mean?',
ar:[
'«الاكتئاب العضوي» تعبير شائع، وليس اسمًا مناسبًا لكل شعور بالحزن يصاحبه نقص غذائي. وفي التصنيف السريري توجد حالة تسمّى **الاضطراب الاكتئابي الناجم عن حالة طبية أخرى (Depressive Disorder Due to Another Medical Condition)**؛ ويقتضي تشخيصها وجود دليل طبي على صلة سببية بين المرض الجسدي والأعراض النفسية، لا مجرد ظهور التحليل منخفضًا أو مرتفعًا.',
'كما أن الاكتئاب قد ينشأ عن تداخل عوامل بيولوجية ونفسية واجتماعية، وقد يوجد مع مرض جسدي في الوقت نفسه. لذا فإن أفضل طريق هو تقييم الإنسان كله، لا الاكتفاء بالتحاليل ولا تجاهلها [1، 3].'
],
en:[
'“Organic depression” is a colloquial expression, not a diagnosis assigned to every person experiencing low mood and a nutrient deficiency. **Depressive Disorder Due to Another Medical Condition** requires clinical evidence linking a medical condition to the mood symptoms—not merely an abnormal blood result.',
'Depression can involve biological, psychological and social factors, and can coexist with physical illness. Good care considers the whole person rather than relying solely on laboratory tests or dismissing them [1, 3].'
]
},
{
arTitle:'أي تحاليل تستحق المناقشة مع الطبيب؟',enTitle:'Which tests might be worth discussing with your doctor?',
ar:[
'لا توجد «باقة تحاليل اكتئاب» تصلح لجميع الناس. يبدأ الطبيب عادةً بالتاريخ المرضي، ومراجعة الأدوية، والنوم، وطبيعة الأعراض، ثم يختار الفحوص اللازمة.',
'ويُعد **تعداد الدم الكامل CBC** و**الهرمون المحفّز للغدة الدرقية TSH** من الفحوص التي قد تساعد في كشف أسباب قابلة للعلاج مثل فقر الدم وقصور الغدة الدرقية؛ أما البقية فتُطلب بحسب الحاجة وعوامل الخطورة [1].'
],
en:[
'There is no universal “depression blood-test panel.” Clinicians review medical history, medicines, sleep and symptoms before deciding which tests are appropriate.',
'A **complete blood count (CBC)** and **thyroid-stimulating hormone (TSH)** may help identify treatable causes such as anemia or thyroid dysfunction; additional tests depend on symptoms and individual risk factors [1].'
]
},
{
arTitle:'الغدة الدرقية: حين تتشابه الأعراض',enTitle:'Thyroid problems can mimic depression',
ar:[
'قد يصاحب قصور الغدة الدرقية خمولٌ وإرهاقٌ وبطءٌ في التفكير واضطرابات في المزاج. لذلك من المنطقي تقييم وظائف الغدة عند وجود مؤشرات مناسبة. وإذا ثبت القصور، فقد يساعد علاجه في تحسّن الأعراض المرتبطة به؛ لكن علاج الغدة لا يغني بالضرورة عن علاج اكتئاب مستقل إن كان موجودًا [1].'
],
en:[
'Hypothyroidism may cause fatigue, low energy, slowed thinking and mood changes. Testing can be appropriate when the clinical picture suggests a thyroid disorder. Treating confirmed thyroid disease may improve related symptoms, but does not automatically replace treatment for a coexisting depressive disorder [1].'
]
},
{
arTitle:'الحديد وفقر الدم: التعب ليس دائمًا كسلًا',enTitle:'Iron and anemia: fatigue is not necessarily laziness',
ar:[
'يمكن لفقر الدم أو نقص الحديد أن يسببا إجهادًا وضعفًا في النشاط والتركيز، وهي أعراض قد يصفها صاحبها على أنها فتور نفسي.',
'وأهم ما يجب تصحيحه هنا أن عبارة «تحليل الحديد بكل أنواعه» ليست طلبًا طبيًا محددًا؛ فقد يبدأ الطبيب بصورة الدم ومخزون الحديد، ويضيف قياسات أخرى عند الحاجة. كما أن ارتفاع Ferritin أحيانًا مع الالتهاب قد يستدعي تفسيرًا أوسع، فلا تُقرأ النتائج منفصلةً عن الحالة [6].'
],
en:[
'Iron deficiency or anemia can cause exhaustion, reduced activity and impaired concentration—symptoms that can resemble emotional depletion.',
'“All iron tests” is not a precise medical order. A clinician may begin with a CBC and ferritin, adding other tests when appropriate. Ferritin may also rise during inflammation, so it must be interpreted in clinical context [6].'
]
},
{
arTitle:'فيتامين ب12 والفولات: نقطة لا ينبغي نسيانها',enTitle:'Vitamin B12 and folate: important missing pieces',
ar:[
'لفيتامين B12 دور أساسي في سلامة الأعصاب وتكوين خلايا الدم. وقد يرتبط نقصه بمشكلات الذاكرة والتركيز وتغيرات المزاج، ومنها أعراض الاكتئاب أو القلق. والمهم أن **غياب فقر الدم لا يستبعد نقص B12**، وفق إرشادات المعهد البريطاني NICE [2].',
'وتزداد أهمية تقييم B12 والفولات والحديد والفيتامينات الأخرى لدى من خضعوا لجراحات السمنة، وخصوصًا تحويل المسار، لأن بعض حالات نقص العناصر قد تظهر بعد سنوات وتستلزم متابعة غذائية طويلة الأمد [6].',
'ولا ينبغي تناول جرعات علاجية عالية من حمض الفوليك قبل تقييم احتمال نقص B12؛ فقد تخفي بعض العلامات الدموية بينما تستمر المشكلة العصبية [6].'
],
en:[
'Vitamin B12 helps maintain the nervous system and supports healthy blood-cell production. Deficiency may affect memory, concentration and mood. **The absence of anemia does not rule out B12 deficiency**, according to NICE [2].',
'People who have undergone bariatric surgery, particularly gastric bypass, may require long-term nutritional monitoring because deficiencies can emerge years after surgery [6].',
'High-dose folic acid should not be started without considering B12 status, because some blood abnormalities may improve while neurological problems continue [6].'
]
},
{
arTitle:'فيتامين د والمغنيسيوم: ماذا تثبت الأبحاث؟',enTitle:'Vitamin D and magnesium: what does the research show?',
ar:[
'أظهرت مراجعة علمية منشورة عام 2024، شملت **31 تجربة عشوائية و24,189 مشاركًا**، أن مكملات فيتامين د ارتبطت بتحسّن محدود في درجات الأعراض الاكتئابية في بعض الدراسات، لكنها **لم تُظهر فائدة واضحة في أعراض القلق**، وكانت نتائج التجارب متفاوتة بدرجة كبيرة. هذه النتيجة لا تعني أن كل اكتئاب سببه نقص فيتامين د، ولا تبرر تناول جرعات مرتفعة دون متابعة طبية [4].',
'أما المغنيسيوم، فقد وجدت مراجعة لتجارب سريرية شملت **سبع تجارب و325 مشاركًا** تحسّنًا في درجات الاكتئاب مع المكملات، إلا أن قاعدة الأدلة ما زالت محدودة، ولا يصح تقديم المغنيسيوم علاجًا مستقلًا مضمونًا للاكتئاب [5].'
],
en:[
'A 2024 review of **31 randomized trials with 24,189 participants** found a limited average improvement in depressive symptom scores in some vitamin D studies, with **no clear improvement in anxiety symptoms** and substantial variation across studies. These findings do not establish that all depression comes from vitamin D deficiency or justify high-dose self-treatment [4].',
'A separate review of **seven trials involving 325 participants** found improved depression scores with magnesium supplementation, but the evidence remains limited and does not establish magnesium as a guaranteed standalone treatment [5].'
]
},
{
arTitle:'لماذا لا تكفي عبارة «تحاليلك طبيعية»؟',enTitle:'Why “your results are normal” may not be the full picture',
ar:[
'المدى المرجعي الذي يطبعه المختبر يساعد على تفسير النتيجة، لكنه ليس حكمًا نهائيًا على الصحة. فقد تكون النتيجة ضمن الحدود المرجعية مع وجود أعراض تحتاج متابعة، وقد تكون نتيجة قريبة من الطرف الأدنى طبيعية تمامًا لشخص آخر. التفسير يحتاج النظر إلى العمر، والتاريخ المرضي، والأدوية، ووظائف الأعضاء، والأعراض، وعوامل الخطورة.',
'وفي المقابل، لا يجوز إقناع المريض بأن كل رقم في أسفل النطاق الطبيعي يعني نقصًا يحتاج حقنًا أو مكملات؛ فالعلاج دون تشخيص قد يضر أو يؤخر اكتشاف المشكلة الحقيقية.'
],
en:[
'A laboratory reference range supports interpretation but is not a complete medical verdict. A result can fall within range while symptoms still warrant investigation, and a low-normal value can be perfectly acceptable in another person. Age, history, medications, organ function and risk factors all matter.',
'Conversely, not every low-normal value represents a deficiency requiring injections or supplements. Treating without a diagnosis can cause harm or delay the correct diagnosis.'
]
},
{
arTitle:'قبل المختبر أم الطبيب النفسي؟ كيف نبدأ التقييم الصحيح؟',enTitle:'Lab first or mental-health specialist first? Start with an appropriate assessment',
ar:[
'هنا أهم تصحيح في الفكرة الأصلية: **لا أنصح بأن ينتظر الإنسان نتائج كل الفحوص أو انتهاء علاج النقص قبل مراجعة مختص نفسي.**',
'يمكن البدء بطبيب أسرة أو باطنية ليقيّم الأسباب الجسدية، وبالتوازي طلب التقييم النفسي إذا كانت الأعراض مستمرة أو شديدة أو تؤثر في العمل والعلاقات والنوم. فالطبيب النفسي ليس «الخيار الأخير»، ولا تعني زيارته أن الطبيب يتجاهل الجسد [1، 3].',
'وإذا استمر انخفاض المزاج أو فقدان المتعة معظم الأيام نحو أسبوعين أو أكثر، فهذا سبب مهم لطلب التقييم. أما إذا ظهرت **أفكار لإيذاء النفس أو الانتحار** فيجب طلب مساعدة طبية عاجلة فورًا.',
'وإذا كان «ضيق الصدر» يعني ألمًا صدريًا شديدًا أو ضغطًا مفاجئًا، خصوصًا مع ضيق النفس أو التعرّق أو الإغماء، فيجب التعامل معه كاحتمال طارئ جسدي، لا افتراض أنه قلق نفسي.'
],
en:[
'The key correction is this: **Do not wait for every test result or for deficiencies to be corrected before seeing a mental-health professional.**',
'A primary-care clinician can examine physical causes while mental-health assessment proceeds in parallel, especially when symptoms are persistent, severe or affecting daily functioning [1, 3].',
'Low mood or loss of pleasure on most days for roughly two weeks warrants assessment. **Thoughts of self-harm or suicide require urgent help.**',
'Sudden or severe chest pain or pressure—especially with breathlessness, sweating or fainting—must be treated as a potential physical emergency rather than automatically attributed to anxiety.'
]
},
{
arTitle:'بين الطمأنينة الروحية والاستغلال بالخوف',enTitle:'Spiritual comfort must not become exploitation',
ar:[
'من حق الإنسان أن يستعين بالدعاء والذكر والرقية المشروعة طلبًا للطمأنينة، لكن لا يملك أحد أن يجزم من الأعراض وحدها بأن صاحبها مصاب بعين أو سحر أو مسّ، أو أن يطالبه بترك العلاج.',
'المشكلة ليست في المساندة الروحية، بل في **استغلال خوف المريض** وبيع تشخيصات غيبية جازمة دون دليل، أو صرفه عن الرعاية الطبية.',
'وبالمقابل، لا يصح أن نردّ كل تجربة إنسانية إلى نقص المعادن والفيتامينات. احترام المريض يقتضي ألا نسخر من معتقده، وألا نُخيفه، وألا نحرمه العلاج المبني على الأدلة.'
],
en:[
'People may draw comfort from prayer and other religious practices. However, symptoms alone cannot establish a supernatural explanation, and no one should use such claims to discourage medical care.',
'The concern is **exploiting a frightened patient**, charging for unsupported claims or steering someone away from evidence-based treatment.',
'It is equally wrong to assume every emotional experience is merely a mineral or vitamin deficiency. Respectful care does not ridicule beliefs, intensify fear or withhold treatment.'
]
},
{
arTitle:'الخلاصة',enTitle:'Conclusion',
ar:[
'إذا شعرت بحزنٍ غامض أو رغبةٍ في البكاء أو ضيقٍ متكرر، فلا تتعجل في تفسير ما يحدث لك. اطلب تقييمًا مهنيًا يراعي **الجسد والنفس معًا**، وناقش التحاليل التي تلائم ظروفك، وعالج أي اضطراب مثبت؛ لكن لا تفترض أن علاج النقص سيزيل الاكتئاب في كل الحالات، ولا تؤخر الرعاية النفسية حين تحتاجها.',
'**ليس كل ضيق اكتئابًا، وليس كل اكتئاب نقص فيتامين، وليس كل ما نعجز عن تفسيره دليلًا على سبب غيبي. أعطِ جسدك حقه من الفحص، ونفسك حقها من العلاج، وعقلك حقه من المعرفة.**'
],
en:[
'If you experience unexplained sadness, frequent urges to cry or recurring distress, avoid jumping to conclusions. Seek an assessment that considers **body and mind together**, discuss testing appropriate to your circumstances, treat confirmed conditions and do not delay mental-health care when needed.',
'**Not all distress is depression. Not all depression is a vitamin deficiency. And an unexplained experience is not evidence of a supernatural cause. Give your body the examination it needs, your mind the care it needs and your judgment the benefit of reliable knowledge.**'
]
}
];
var tests=[
['تعداد الدم الكامل','Complete Blood Count','CBC'],
['الهرمون المحفّز للغدة الدرقية','Thyroid-Stimulating Hormone','TSH'],
['الثيروكسين الحر','Free Thyroxine','FT4 / Free T4'],
['مخزون الحديد','Serum Ferritin','Ferritin'],
['حديد الدم','Serum Iron','Fe'],
['السعة الكلية لارتباط الحديد','Total Iron-Binding Capacity','TIBC'],
['تشبّع الترانسفيرين','Transferrin Saturation','TSAT'],
['فيتامين ب12','Vitamin B12 / Cobalamin','B12'],
['الفولات (فيتامين ب9)','Serum Folate','Folate / B9'],
['فيتامين د','25-Hydroxy Vitamin D','25(OH)D'],
['المغنيسيوم في الدم','Serum Magnesium','Mg'],
['السكر التراكمي','Hemoglobin A1c','HbA1c'],
['سكر البلازما الصائم','Fasting Plasma Glucose','FPG']
];
var notes=[
['مصطلح «الاكتئاب العضوي» يحتاج تدقيقًا: الاضطراب الاكتئابي الناجم عن حالة طبية أخرى تشخيص مستقل يتطلب إثبات علاقة سببية، وليس مرادفًا تلقائيًا لأي نقص غذائي.','The colloquial term “organic depression” requires care: depression due to a medical condition is a distinct diagnosis requiring evidence of causation.'],
['تسلسل الرعاية: لا يوجد أساس علمي لاشتراط فحوص طبيعية أولًا ثم السماح بزيارة الطبيب النفسي؛ التقييم الجسدي والنفسي قد يكون متزامنًا [1، 3].','Physical and mental-health assessments may take place in parallel; normal blood tests are not a prerequisite for psychiatric care [1, 3].'],
['التحاليل ليست وصفة للجميع: CBC وTSH قد يكونان منطقيين في التقييم؛ أما الحديد الكامل، والفولات، وفيتامين د، والمغنيسيوم، والسكر فتُختار حسب القصة السريرية [1].','CBC and TSH may be useful; other tests are guided by clinical symptoms and risk factors [1].'],
['B12 عنصر أساسي أغفلته الصياغة الأولى: قد تحدث أعراض عصبية ونفسية حتى دون فقر دم، وتزداد أهمية المتابعة بعد تحويل المسار وجراحات السمنة [2، 6].','Vitamin B12 deficiency can cause neurological and psychological symptoms without anemia, including years after some bariatric operations [2, 6].'],
['لا نساوي الارتباط بالسببية: دراسات فيتامين د والمغنيسيوم تدعم إمكان التحسّن في ظروف معينة، لكنها لا تجعل المكملات علاجًا شافيًا لكل حالة اكتئاب [4، 5].','Supplement studies do not prove that all depression is due to deficiencies or that supplements reliably cure it [4, 5].'],
['الأعراض التحذيرية لا تنتظر التحاليل: الأفكار الانتحارية تتطلب تدخلًا عاجلًا؛ والألم الصدري الحاد قد يكون حالة طبية طارئة.','Self-harm thoughts need urgent support; acute chest pain may be a medical emergency.'],
['الرقية والدعاء: يُحترم اللجوء الروحي، لكن لا يصح استخدامه لتشخيص مرض أو منع العلاج أو استغلال المريض ماليًا.','Religious support may be meaningful, but should not replace diagnosis and treatment or be used to exploit patients.']
];
var sources=[
['CANMAT (2024) — 2023 Update on Clinical Guidelines for Management of Major Depressive Disorder in Adults','https://pmc.ncbi.nlm.nih.gov/articles/PMC11351064/'],
['NICE (2024) — Vitamin B12 deficiency in over 16s: diagnosis and management (NG239)','https://www.nice.org.uk/guidance/ng239/chapter/recommendations'],
['NICE (2022) — Depression in adults: treatment and management (NG222)','https://www.nice.org.uk/guidance/ng222/chapter/recommendations'],
['Ghaemi et al. (2024) — The effect of vitamin D supplementation on depression: systematic review and dose-response meta-analysis','https://pmc.ncbi.nlm.nih.gov/articles/PMC11650176/'],
['Magnesium supplementation and depression: systematic review and meta-analysis (2024), PMID 38213402','https://pubmed.ncbi.nlm.nih.gov/38213402/'],
['BOMSS (2020) — Guidelines on biochemical monitoring and micronutrient replacement after bariatric surgery','https://pmc.ncbi.nlm.nih.gov/articles/PMC7583474/']
];
function breadcrumbs(full){
 var parts=[[L('الرئيسية','Home'),path('')],[L('من أنا','About Me'),path('about')],[L('ماذا تعرف عن صحتك؟','What Do You Know About Your Health?'),path('about/health')]];
 if(full||state.route===articleRoute)parts.push([L('علاج الاكتئاب والقلق','Depression & Anxiety'),path(articleRoute)]);
 return '<nav class="ks-health-crumbs" aria-label="'+L('مسار الصفحة','Breadcrumb')+'">'+parts.map(function(p){return '<a href="'+p[1]+'">'+safe(p[0])+'</a>';}).join(' <span aria-hidden="true">›</span> ')+'</nav>';
}
function sourceState(){
 return driveFileUrl?'<div class="ks-health-source-meta"><a class="ks-health-btn secondary" target="_blank" rel="noopener noreferrer" href="'+safe(driveFileUrl)+'">'+L('فتح النسخة الأصلية في Google Drive','Open original on Google Drive')+' ↗</a><p class="ks-health-source-access">'+L('النسخة الأصلية محفوظة في أرشيف عبدالكريم. فتح رابط Google Drive للزوار يخضع لصلاحيات مشاركة الملف، بينما يتاح المقال كاملًا للقراءة في الموقع.','The original is stored in Abdulkarim’s archive. Google Drive access follows the document sharing permissions; the full article is readable on this website.')+'</p></div>':'<p class="ks-health-status" role="status">'+L('رابط النسخة الأصلية غير متاح حاليًا.','The original file link is currently unavailable.')+'</p>';
}
function startPage(){
 return '<main class="ks-health-main" dir="'+L('rtl','ltr')+'"><div class="ks-health-wrap">'+breadcrumbs(false)+
 '<div class="ks-health-kicker">KARIM SAAB / HEALTH KNOWLEDGE</div><h1>'+L('ماذا تعرف عن صحتك؟','What Do You Know About Your Health?')+'</h1>'+
 '<p class="ks-health-lead">'+L('مقالات مبنية على مصادر طبية موثوقة، تساعد على فهم العلاقة بين الصحة الجسدية والنفسية دون تهويل أو تشخيص ذاتي.','Evidence-informed articles exploring physical and mental health without alarmism or self-diagnosis.')+'</p>'+
 '<a class="ks-health-panel ks-health-article-card" href="'+path(articleRoute)+'"><span class="ks-health-icon" aria-hidden="true">♡</span><span style="flex:1"><strong>'+L('علاج الاكتئاب والقلق','Depression & Anxiety: Understanding Care')+'</strong><small>'+L('هل يمكن أن تتشابه أعراض الاكتئاب مع اضطرابات الغدة أو فقر الدم ونقص بعض العناصر؟ اقرأ المقال والمصادر.','Can thyroid disorders, anemia or nutrient deficiency overlap with depression symptoms? Read the article and sources.')+'</small></span><span class="ks-health-linkmark" aria-hidden="true">↗</span></a>'+
 '</div></main>';
}
function previewPage(){
 var intro=L('قد تمر عليك أيام تشعر فيها بضيق في صدرك، وحزن لا تعرف سببه، ورغبة في البكاء دون حدث واضح. وقد ترتبط بعض هذه الأعراض باضطرابات جسدية مثل قصور الغدة الدرقية أو فقر الدم أو نقص B12، لكن ليس كل اكتئاب سببه نقص غذائي.','You may experience chest tightness, unexplained sadness or urges to cry. Some symptoms can overlap with thyroid disorders, anemia or B12 deficiency, but not all depression is caused by nutritional deficiencies.');
 var bullets=ar()?['ما المقصود بالاكتئاب المرتبط بالأسباب الجسدية؟','التحاليل وأسماؤها واختصاراتها الطبية','الغدة الدرقية والحديد وفيتامين B12','فيتامين د والمغنيسيوم: ماذا تقول الدراسات؟','متى تكون مراجعة الطبيب النفسي ضرورية؟']:['Depression related to medical conditions','Tests, names and abbreviations','Thyroid, iron and vitamin B12','Vitamin D and magnesium: the evidence','When to seek mental-health care'];
 return '<main class="ks-health-main" dir="'+L('rtl','ltr')+'"><div class="ks-health-wrap">'+breadcrumbs(false)+
 '<div class="ks-health-kicker">KARIM SAAB / HEALTH ARTICLE</div><h1>'+L('علاج الاكتئاب والقلق','Depression & Anxiety: Understanding Care')+'</h1><p class="ks-health-lead">'+
 L('كيف نميّز بين الأسباب النفسية والجسدية، وأهم التحاليل التي تستحق النقاش مع الطبيب.','How to evaluate possible psychological and physical contributors, and which tests to discuss with a clinician.')+
 '</p><p class="ks-health-author">'+L('بقلم: عبدالكريم بن إبراهيم الصعب • 10 نوفمبر 2026','By Abdulkarim bin Ibrahim Al Saab • 10 November 2026')+'</p>'+
 '<div class="ks-health-grid"><section class="ks-health-panel ks-health-visual"><img src="'+imgUrl+'" alt="'+L('رسم رمزي يوضح التداخل بين الحالة النفسية وفحوص الفيتامينات والغدة والحديد','Symbolic illustration of mental health and physical health tests')+'"><div class="ks-health-imagecopy"><h2>'+L('هل الاكتئاب دائمًا مرضًا نفسيًا؟','Is depression always a psychiatric condition?')+'</h2>'+paragraph(intro)+'</div></section>'+
 '<aside class="ks-health-panel ks-health-facts"><h2>'+L('محتوى المقال','Inside the article')+'</h2><ul>'+bullets.map(function(t){return '<li>'+safe(t)+'</li>';}).join('')+'</ul><p>'+L('يتضمن النص الأصلي جدولًا طبيًا للمختبرات وستة مراجع علمية وملاحظات تحريرية.','The source includes a medical test table, six scientific references and editorial notes.')+'</p></aside></div>'+
 '<div class="ks-health-cta"><a class="ks-health-btn" href="'+path(fullRoute)+'">'+L('اقرأ المقال كاملًا داخل الموقع','Read the complete article on this site')+' ↗</a>'+sourceState()+'</div></div></main>';
}
function testTable(){
 return '<div class="ks-health-tablewrap"><table><thead><tr><th>'+L('التحليل بالعربية','Test (Arabic)')+'</th><th>'+L('الاسم الطبي بالإنجليزية','English test name')+'</th><th>'+L('الرمز','Abbreviation')+'</th></tr></thead><tbody>'+
 tests.map(function(t){return '<tr><td>'+safe(t[0])+'</td><td dir="ltr">'+safe(t[1])+'</td><td dir="ltr">'+safe(t[2])+'</td></tr>';}).join('')+'</tbody></table></div>';
}
function fullPage(){
 var introduction = ar()?[
 'قد تستيقظ في أحد الأيام وأنت تشعر بضيق غريب في صدرك؛ لا شيء يسعدك، ولا تعرف لماذا تريد البكاء. تصبح سريع الانفعال، تفقد حماسك، وتتساءل: هل أصبت بالاكتئاب؟ وقد يقول لك أحدهم: «اذهب إلى طبيب نفسي»، بينما يربط شخص آخر هذه المشاعر مباشرةً بالعين أو السحر أو المسّ، من غير تشخيص أو دليل.',
 'وسط هذه التفسيرات المتسرعة، هناك سؤال يستحق أن نطرحه: **هل يمكن أن تكون وراء بعض أعراض الحزن والقلق مشكلة جسدية قابلة للاكتشاف والعلاج؟** نعم، في بعض الحالات. فقد تتشابه أعراض قصور الغدة الدرقية وفقر الدم ونقص بعض المغذيات مع أعراض الاكتئاب، أو تزيد العبء على شخص يعاني اضطرابًا نفسيًا بالفعل. لكن لا يصح أن نقفز من هذه الحقيقة إلى نتيجة خاطئة مفادها أن كل اكتئاب سببه نقص فيتامين أو معدن [1، 2].'
 ]:[
 'Some mornings you may feel chest tightness, unexplained sadness or the urge to cry. Others may immediately describe it as a psychiatric disorder, while someone else may assign a supernatural cause without evidence.',
 '**Could a diagnosable physical problem contribute to some symptoms of sadness or anxiety?** Sometimes, yes. Thyroid dysfunction, anemia or certain deficiencies can overlap with depressive symptoms, but that does not mean all depression stems from low vitamins or minerals [1, 2].'
 ];
 var subtitle=L('ضيق الصدر، والحزن المفاجئ، والرغبة في البكاء قد تتداخل فيها عوامل نفسية وجسدية؛ والتشخيص الصحيح لا يقوم على التخمين أو التخويف.','Chest tightness, sudden sadness and crying may involve both psychological and physical factors. Diagnosis should not rely on guesswork or fear.');
 var content=sectionData.map(function(sec,i){
 return '<section><h2>'+safe(ar()?sec.arTitle:sec.enTitle)+'</h2>'+paragraphs(ar()?sec.ar:sec.en)+
 (i===1?testTable()+'<p><strong>'+L('تنبيه:','Note:')+'</strong> '+L('لا تعني هذه القائمة أن عليك طلب جميع الفحوص دفعة واحدة، أو أن كل نتيجة عند أدنى الحد الطبيعي تحتاج إلى علاج.','This list does not mean everyone requires all these tests or that every low-normal result needs treatment.')+'</p>':'')+'</section>';
 }).join('');
 var noteList='<section><h2>'+L('الملاحظات الطبية والتحريرية','Medical and editorial notes')+'</h2><ol>'+notes.map(function(n){return '<li>'+safe(n[ar()?0:1])+'</li>';}).join('')+'</ol></section>';
 var sourceList='<section><h2>'+L('المصادر والمراجع العلمية','Scientific references')+'</h2><ol class="ks-health-source-list">'+sources.map(function(s){return '<li><a target="_blank" rel="noopener noreferrer" href="'+safe(s[1])+'">'+safe(s[0])+'</a></li>';}).join('')+'</ol></section>';
 return '<main class="ks-health-main" dir="'+L('rtl','ltr')+'"><div class="ks-health-wrap">'+breadcrumbs(true)+
 '<article class="ks-health-full"><a class="ks-health-back" href="'+path(articleRoute)+'">'+L('العودة إلى ملخص المقال','Back to article preview')+' ↩</a><div class="ks-health-kicker">KARIM SAAB / FULL ARTICLE</div>'+
 '<h1 style="color:#162f46">'+L('هل الاكتئاب دائمًا مرضًا نفسيًا؟ حين يستحق الجسد أن نفحصه أيضًا','Is depression always psychological? When physical health also deserves attention')+'</h1>'+
 '<p><strong>'+safe(subtitle)+'</strong></p><p>'+L('بقلم: عبدالكريم بن إبراهيم الصعب','By Abdulkarim bin Ibrahim Al Saab')+'</p>'+paragraphs(introduction)+content+noteList+sourceList+
 '<p class="ks-health-note">'+L('تنويه طبي: هذا المقال للتثقيف الصحي ولا يشخّص حالة فردية ولا يوصي بإجراء جميع التحاليل أو تناول مكملات دون تقييم طبي. أُعدت النسخة الأصلية في 10 نوفمبر 2026.','Medical notice: This article is educational, not personal diagnosis or advice to order every test or take supplements without medical assessment. The source was prepared on 10 November 2026.')+'</p>'+sourceState()+'</article></div></main>';
}
function mount(){
 var r=(state.route||'').split('?')[0];
 if(r!=='about/health'&&r!==articleRoute&&r!==fullRoute)return;
 var main=document.querySelector('#app > main');
 if(!main)return;
 main.outerHTML = r==='about/health'?startPage():r===articleRoute?previewPage():fullPage();
 var heading=document.querySelector('#app > main h1');
 if(heading)document.title=heading.textContent.trim()+' | KARIM SAAB';
 var desc=document.querySelector('meta[name="description"]');
 if(desc)desc.content=L('مقالات توعوية عن العلاقة بين الصحة النفسية والجسدية، تشمل التحاليل والمصادر الموثوقة.','Evidence-informed articles on mental and physical health and relevant laboratory investigations.');
}
var priorRender=render;
window.removeEventListener('hashchange',priorRender);
render=function(){priorRender();mount();};
window.addEventListener('hashchange',render);
render();
})();