function pendingPage(){const t=state.lang==='ar'?'المحتوى قيد المراجعة':'Content under review';return `<main>${pageHeader(t,'')}<section class="page-body"><div class="container"><p>${t}</p><a href="${path()}">${text('nav')[0]}</a></div></section></main>`;}
'use strict';
/* KARIM SAAB prototype — original bilingual editorial travel website. All sample imagery is illustrative. */
const COPY = {
  ar: {
    nav:['الرئيسية','من أنا','مغامراتي','كتبي','تسوق','المزيد'],top:'من قلب الصحراء إلى العالم | أترك أثراً قبل أن تغادر / Around the World by Bicycle',
    heroH:'من قلب الصحراء إلى العالم',heroAlt:'From the Heart of the Desert to the World',heroSub:'رحلات بالدراجة، وطرق بعيدة، ومسارات جبلية... وحكايات من قلب التجربة.',
    explore:'استكشف رحلاتي',seeStories:'الأفلام والقصص',scroll:'اكتشف المزيد',heroEyebrow:'رحلات • مغامرات • قصص إنسانية',
    journeyEyebrow:'DISCOVER THE JOURNEYS',journeyH:'الطريق بداية الحكاية',journeySub:'من مسارات الدراجة في أوروبا إلى الجبال والقمم؛ لكل طريق تجربته وصوره وقصصه.',
    cycling:'رحلات الدراجة',hiking:'الهايكنج والقمم',cyclingSub:'دروب أوروبا والقرى والمناظر الطبيعية',hikingSub:'مسارات جبلية وتجارب استكشاف',discover:'اكتشف',
    introEyebrow:'THE STORY BEHIND THE ROAD',introH:'لا أسافر لأصل فقط... بل لأفهم الطريق',introP:'في كل رحلة تفاصيل لا تظهر على الخريطة: وجوه، وقرى، وطبيعة، ولقاءات تتحول إلى قصص تستحق التوثيق. هنا أجمع التجارب والمشاهدات والأفلام في مكان واحد.',introQuote:'مسافات تُقطع... وحكايات تبقى.',
    storiesEyebrow:'JOURNAL & DOCUMENTARIES',storiesH:'أفلام وقصص من الطريق',storiesSub:'مساحة للكتابة والتوثيق البصري، تحمل المواقف الإنسانية والأماكن كما عاشها صاحب التجربة.',browseStories:'استعرض القصص',read:'اقرأ القصة',
    aboutEyebrow:'ABOUT KARIM SAAB',aboutH:'عبدالكريم بن إبراهيم الصعب',aboutP:'شغفٌ برحلات الدراجة والجبال، واهتمام بتوثيق تجارب السفر والثقافات والناس. هذا الموقع أرشيف شخصي متجدد لما يُرى على الطريق وما يُتعلّم منه.',aboutQuote:'المغامرة ليست فقط الوصول إلى مكان جديد، بل العودة منه بنظرة مختلفة.',aboutLink:'تعرّف عليّ',
    projectEyebrow:'A DIFFERENT CHAPTER',projectH:'المشاريع: جانب آخر من الرحلة',projectP:'إلى جانب المغامرات، هناك اهتمام بالمبادرات السياحية والضيافة والعقار. صفحة مستقلة للتعريف بالأعمال دون أن تطغى على قصة السفر.',projectLink:'استكشف المشاريع',
    footerText:'موقع شخصي للرحلات والمغامرات والقصص والتجارب، مع نافذة مختصرة على المشاريع.',demo:'نسخة تجريبية • الصور توضيحية وليست توثيقًا للرحلات أو المشاريع • لم يُنشر الموقع على النطاق الرسمي',
    search:'بحث',searchPlaceholder:'ابحث في الرحلات والقصص والمشاريع',searchGo:'بحث',all:'الكل',journeys:'مغامراتي',stories:'الأفلام والقصص',projects:'المشاريع',about:'من أنا',contact:'تواصل',
    journeysDesc:'تصفّح الرحلات حسب نوع النشاط. البيانات التفصيلية، المسافات والخرائط تُضاف عند توثيقها.',storiesDesc:'قصص تحريرية أولية توضّح أسلوب العرض. يُستبدل بها المحتوى الأصلي قبل النشر.',projectsDesc:'تعريف مختصر بجانب المشاريع والأعمال. أسماء المشاريع وحالتها النهائية تُراجع قبل النشر.',aboutDesc:'منصة شخصية تجمع السفر والتوثيق والاستكشاف.',
    contactDesc:'نرحب بالتواصل حول الرحلات والمحتوى والتعاون المهني. سيتم ربط نموذج التواصل بوسيلة رسمية قبل النشر.',
    labelType:'النوع',labelRegion:'المنطقة',labelStatus:'حالة المحتوى',draft:'تصميم أولي — يحتاج بيانات وصور أصلية',detailBody:'هذه صفحة تفصيلية نموذجية لعرض القصة والصور والأفلام والمراحل المرتبطة بها. لن تُنشر أرقام المسافات أو المواعيد أو تفاصيل المسارات إلا بعد مراجعة المصادر والمواد الأصلية.',
    detailSub:'القالب مهيأ لاستقبال الصور الأصلية والخريطة والمراحل والأفلام والقصص المرتبطة بهذه التجربة.',detailNext:'استكشف المزيد',back:'العودة إلى القائمة',
    allJourneys:'كل الرحلات',filterCycle:'الدراجة',filterHike:'الهايكنج',items:'نتائج',noResults:'لم نجد نتائج مطابقة. جرب كلمة أخرى.',
    aboutMoreH:'توثيق الرحلة قبل أن تصبح مجرد ذكرى',aboutMoreP:'المحتوى هنا لا يسعى إلى المبالغة أو الإثارة المصطنعة. الأولوية لصدق التجربة، والاهتمام بالتفاصيل، ونقل المعرفة لمن يريد الاستكشاف.',
    contactPersonal:'الرحلات والتعاون الإعلامي',contactBusiness:'التواصل المهني والمشاريع',contactPending:'للتواصل الرسمي: alsaabb@gmail.com. يمكنك أيضًا استخدام روابط واتساب وتيك توك الموجودة في قسم مواقع التواصل.',
    searchRes:'نتائج البحث',searchFor:'نتائج مرتبطة بـ',photoNotice:'صورة توضيحية — ليست من أرشيف الرحلة',share:'نسخ رابط الصفحة',copied:'تم نسخ الرابط',
    categoryCycle:'CYCLING / EUROPE',categoryHike:'HIKING / SAUDI ARABIA',categoryStory:'STORIES / JOURNAL',projectTag:'HOSPITALITY / PROJECTS',
    linksTitle:'روابط التواصل الاجتماعي',linksIntro:'حساباتي ومنصاتي الاجتماعية في مكان واحد. الروابط مأخوذة من ملفات حسابات التواصل، وأضفت قناة YouTube بالرابط الذي زودتني به. يرجى مراجعة صلاحية الحسابات قبل النشر العام.',linksView:'جميع الروابط',linksMore:'روابط إضافية من الأرشيف',linksNote:'روابط من ملفاتك، باستثناء YouTube الذي أرسلته مباشرة. تأكد من صلاحية بقية الروابط قبل إطلاق الموقع.',socialFollow:'تابعني على المنصات',
    siteMap:'خريطة الموقع',privacy:'الخصوصية',privacyText:'هذه معاينة ثابتة لا تتطلب تسجيل دخول ولا تجمع بيانات نموذجية. قد يتغيّر ذلك عند إضافة أدوات تحليل أو نماذج اتصال مستقبلًا.',
  },
  en: {
    nav:['Home','About Me','My Adventures','My Books','Shop','More'],top:'From the Heart of the Desert to the World | Leave an Impact Before You Go / Around the World by Bicycle',
    heroH:'From the Heart of the Desert to the World',heroAlt:'من قلب الصحراء إلى العالم',heroSub:'Cycling journeys, distant roads and mountain trails — human stories from the journey itself.',
    explore:'Explore journeys',seeStories:'Films & stories',scroll:'Scroll to explore',heroEyebrow:'JOURNEYS • ADVENTURES • HUMAN STORIES',
    journeyEyebrow:'DISCOVER THE JOURNEYS',journeyH:'Every road begins a story',journeySub:'From European cycling routes to mountain trails, every journey has its own people, scenes and stories.',
    cycling:'Cycling journeys',hiking:'Hiking & summits',cyclingSub:'Across European roads, villages and landscapes',hikingSub:'Mountain trails and explorations',discover:'Discover',
    introEyebrow:'THE STORY BEHIND THE ROAD',introH:'I travel not just to arrive, but to understand the road',introP:'Some moments never appear on a map: faces, villages, landscapes and encounters that become stories worth sharing. This is where those experiences, observations and films come together.',introQuote:'The distance passes. The stories stay.',
    storiesEyebrow:'JOURNAL & DOCUMENTARIES',storiesH:'Films & stories from the road',storiesSub:'A home for writing and visual storytelling, with people and places at the heart of the journey.',browseStories:'Browse stories',read:'Explore story',
    aboutEyebrow:'ABOUT KARIM SAAB',aboutH:'Karim Saab',aboutP:'A passion for cycling, mountains and the people and cultures encountered along the way. This site is an evolving personal archive of journeys and what they teach us.',aboutQuote:'Adventure is not only reaching somewhere new, but coming home with a different perspective.',aboutLink:'About Karim',
    projectEyebrow:'A DIFFERENT CHAPTER',projectH:'Projects: another part of the journey',projectP:'Alongside exploration is an interest in tourism, hospitality and real estate. A dedicated space introduces this professional work without overshadowing the journeys.',projectLink:'Explore projects',
    footerText:'A personal home for journeys, adventures and stories, with a concise introduction to professional projects.',demo:'Preview site • Illustrative visuals, not documented trips or properties • Not published on the official domain',
    search:'Search',searchPlaceholder:'Search journeys, stories and projects',searchGo:'Search',all:'All',journeys:'My Adventures',stories:'Films & Stories',projects:'Projects',about:'About',contact:'Contact',
    journeysDesc:'Browse by activity. Route maps, dates and distances will appear only when documented and verified.',storiesDesc:'Editorial story examples demonstrate the layout. Original works will replace them before launch.',projectsDesc:'A concise introduction to business and projects. Details and project status require final approval.',aboutDesc:'An independent personal home for travel, storytelling and exploration.',
    contactDesc:'For journeys, storytelling and professional collaboration. Official contact channels will be added before launch.',
    labelType:'Type',labelRegion:'Region',labelStatus:'Content status',draft:'Preview content — awaiting original materials and review',detailBody:'This is a sample journey-detail template for the narrative, photos, films and related route stages. Distances, schedules and trail conditions will never be presented as facts without source verification.',
    detailSub:'The page is ready for original photos, route information, journey stages and related films and stories.',detailNext:'Explore more',back:'Back to the collection',
    allJourneys:'All journeys',filterCycle:'Cycling',filterHike:'Hiking',items:'Results',noResults:'No matching results. Try another term.',
    aboutMoreH:'Documenting the journey before it becomes just a memory',aboutMoreP:'The work here values truthful experiences over exaggeration, attention to detail over spectacle, and sharing what can help other explorers.',
    contactPersonal:'Travel & editorial collaborations',contactBusiness:'Business & project inquiries',contactPending:'Verified contact details will be added before launch. No visitor data is collected through a demo form.',
    searchRes:'Search results',searchFor:'Results matching',photoNotice:'Illustrative photo — not from the actual journey',share:'Copy page link',copied:'Link copied',
    categoryCycle:'CYCLING / EUROPE',categoryHike:'HIKING / SAUDI ARABIA',categoryStory:'STORIES / JOURNAL',projectTag:'HOSPITALITY / PROJECTS',
    linksTitle:'Social media & links',linksIntro:'Connect with me across my social channels. The links were retrieved from your account documents; the YouTube channel link was provided directly by you. Please verify all profiles before publishing.',linksView:'All links',linksMore:'More saved links',linksNote:'Source URLs from your documents, except YouTube which you supplied directly. Confirm the other profiles are still active before launch.',socialFollow:'Find me online',
    siteMap:'Site map',privacy:'Privacy',privacyText:'This static preview has no login and collects no contact-form data. This may change when analytics or contact systems are added later.',
  }
};
const journeys = [
  {
    "slug": "legacy-5",
    "type": "cycling",
    "img": "cycling.webp",
    "region": [
      "فرنسا",
      "France"
    ],
    "title": [
      "فرنسا France",
      "France"
    ],
    "desc": [
      "كانت باريس نقطة البداية، وكان الطريق نحو أمستردام وجهة أطمح إلى بلوغها. بدأت المغامرة حين قررت أن أصحب دراجتي وأسافر وحدي، رغم أنني لم أكن دراجًا محترفًا.",
      "Paris was my starting point, and Amsterdam was the destination I hoped to reach. I took my bicycle with me despite having no experience of such a journey."
    ],
    "sourceUrl": "https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%B1%D8%AD%D9%84%D8%A7%D8%AA%D9%8A-%D8%A8%D8%A7%D9%84%D8%AF%D8%B1%D8%A7%D8%AC%D8%A9/%D9%81%D8%B1%D9%86%D8%B3%D8%A7-2018-france",
    "status": "index_only",
    "sourceNote": [
      "",
      ""
    ],
    "verified_intro": true
  },
  {
    "slug": "legacy-6",
    "type": "cycling",
    "img": "cycling.webp",
    "region": [
      "بلجيكا",
      "Belgium"
    ],
    "title": [
      "بلجيكا Belgium",
      "Belgium"
    ],
    "desc": [
      "بلجيكا صفحة من أرشيف رحلات الدراجة. وراء اسم البلد قصة طريق تستحق أن تُحكى بصوت صاحبها؛ هنا نجمع ما ثبت من مادتها ونترك التفاصيل المجهولة بلا افتراضات.",
      "Belgium appears in the original cycling archive. Behind the destination lies a road story worth telling in its traveler’s own words; confirmed material is preserved without invented details."
    ],
    "sourceUrl": "https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%B1%D8%AD%D9%84%D8%A7%D8%AA%D9%8A-%D8%A8%D8%A7%D9%84%D8%AF%D8%B1%D8%A7%D8%AC%D8%A9/%D8%A8%D9%84%D8%AC%D9%8A%D9%83%D8%A7-2018-belgium",
    "status": "index_only",
    "sourceNote": [
      "",
      ""
    ],
    "verified_intro": true
  },
  {
    "slug": "legacy-7",
    "type": "cycling",
    "img": "cycling.webp",
    "region": [
      "هولندا",
      "Netherlands"
    ],
    "title": [
      "هولندا Netherlands",
      "Netherlands"
    ],
    "desc": [
      "هولندا من الوجهات المسجلة في أرشيف الرحلات. تجمع هذه الصفحة مرجعها الأصلي وتفتح الباب لكتابة تفاصيلها من الصور والملاحظات الموثقة.",
      "The Netherlands is listed in the original journey archive. Its source is retained here, ready for a more complete account grounded in photographs and firsthand notes."
    ],
    "sourceUrl": "https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%B1%D8%AD%D9%84%D8%A7%D8%AA%D9%8A-%D8%A8%D8%A7%D9%84%D8%AF%D8%B1%D8%A7%D8%AC%D8%A9/%D9%87%D9%88%D9%84%D9%86%D8%AF%D8%A7-2018-nederland",
    "status": "index_only",
    "sourceNote": [
      "",
      ""
    ],
    "verified_intro": true
  },
  {
    "slug": "legacy-8",
    "type": "cycling",
    "img": "cycling.webp",
    "region": [
      "اليونان",
      "Greece"
    ],
    "title": [
      "اليونان Greece",
      "Greece"
    ],
    "desc": [
      "لليونان حضور في سجل رحلاتي بالدراجة. هذا سجل الوجهة ونافذتها إلى المادة الأصلية؛ أما أسماء الطرق والمواقف فلم أضف منها شيئًا بلا توثيق.",
      "Greece features in my cycling archive. This is the destination record and its original reference; no routes or personal encounters have been added without evidence."
    ],
    "sourceUrl": "https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%B1%D8%AD%D9%84%D8%A7%D8%AA%D9%8A-%D8%A8%D8%A7%D9%84%D8%AF%D8%B1%D8%A7%D8%AC%D8%A9/%D8%A7%D9%84%D9%8A%D9%88%D9%86%D8%A7%D9%86-2019-greece",
    "status": "index_only",
    "sourceNote": [
      "",
      ""
    ],
    "verified_intro": true
  },
  {
    "slug": "legacy-9",
    "type": "cycling",
    "img": "cycling.webp",
    "region": [
      "فنلندا",
      "Finland"
    ],
    "title": [
      "فنلندا Finland",
      "Finland"
    ],
    "desc": [
      "فنلندا إحدى محطات أرشيف الدراجة في شمال أوروبا. لا تختصر البلدان في خريطة واحدة؛ ولكل رحلة حكاية سنوثقها بالمادة الأصلية حين تتوافر.",
      "Finland is one of the Northern European destinations in the cycling archive. Every journey deserves its own verified account rather than a story inferred from a map."
    ],
    "sourceUrl": "https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%B1%D8%AD%D9%84%D8%A7%D8%AA%D9%8A-%D8%A8%D8%A7%D9%84%D8%AF%D8%B1%D8%A7%D8%AC%D8%A9/%D9%81%D9%86%D9%84%D9%86%D8%AF%D8%A7-2019-finland",
    "status": "index_only",
    "sourceNote": [
      "",
      ""
    ],
    "verified_intro": true
  },
  {
    "slug": "legacy-10",
    "type": "cycling",
    "img": "cycling.webp",
    "region": [
      "السويد",
      "Sweden"
    ],
    "title": [
      "السويد Sweden",
      "Sweden"
    ],
    "desc": [
      "السويد اسم آخر في سلسلة وجهات الدراجة المسجلة. بين اسم البلد والذكرى مساحة للتفاصيل الحقيقية التي تحفظها الصور والشهادات، لا الخيال.",
      "Sweden is another recorded cycling destination. The journey’s real details belong to photographs and firsthand testimony, not to imagined scenes."
    ],
    "sourceUrl": "https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%B1%D8%AD%D9%84%D8%A7%D8%AA%D9%8A-%D8%A8%D8%A7%D9%84%D8%AF%D8%B1%D8%A7%D8%AC%D8%A9/%D8%A7%D9%84%D8%B3%D9%88%D9%8A%D8%AF2019-sweden",
    "status": "index_only",
    "sourceNote": [
      "",
      ""
    ],
    "verified_intro": true
  },
  {
    "slug": "legacy-11",
    "type": "cycling",
    "img": "cycling.webp",
    "region": [
      "النرويج",
      "Norway"
    ],
    "title": [
      "النرويج Norway",
      "Norway"
    ],
    "desc": [
      "النرويج وجهة مدرجة في أرشيف مغامرات الدراجة. الطريق الحقيقي أهم من المبالغة فيه؛ لذلك نحتفظ بالمصدر حتى تُروى التجربة كما حدثت.",
      "Norway appears in the cycling adventures archive. The actual road matters more than embellishment, so the original source is preserved for a faithful future account."
    ],
    "sourceUrl": "https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%B1%D8%AD%D9%84%D8%A7%D8%AA%D9%8A-%D8%A8%D8%A7%D9%84%D8%AF%D8%B1%D8%A7%D8%AC%D8%A9/%D8%A7%D9%84%D9%86%D8%B1%D9%88%D9%8A%D8%AC-2019-norway",
    "status": "index_only",
    "sourceNote": [
      "",
      ""
    ],
    "verified_intro": true
  },
  {
    "slug": "legacy-12",
    "type": "cycling",
    "img": "cycling.webp",
    "region": [
      "الدنمارك",
      "Denmark"
    ],
    "title": [
      "الدنمارك Denmark",
      "Denmark"
    ],
    "desc": [
      "الدنمارك من صفحات رحلات الدراجة القديمة. نقدم هنا مدخلًا وثائقيًا مختصرًا ورابط التجربة الأصلية، دون استعارة أحداث من رحلات أخرى.",
      "Denmark has its own entry in the cycling archive. This documentary introduction preserves the original reference without borrowing events from other trips."
    ],
    "sourceUrl": "https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%B1%D8%AD%D9%84%D8%A7%D8%AA%D9%8A-%D8%A8%D8%A7%D9%84%D8%AF%D8%B1%D8%A7%D8%AC%D8%A9/%D8%A7%D9%84%D8%AF%D9%86%D9%85%D8%A7%D8%B1%D9%83-2019-denmark",
    "status": "index_only",
    "sourceNote": [
      "",
      ""
    ],
    "verified_intro": true
  },
  {
    "slug": "legacy-13",
    "type": "cycling",
    "img": "cycling.webp",
    "region": [
      "اليابان",
      "Japan"
    ],
    "title": [
      "اليابان Japan",
      "Japan"
    ],
    "desc": [
      "اليابان من الوجهات المسجلة في أرشيف الدراجة. وهي تجربة ترتبط كذلك بمواد كتابة منفصلة تخضع للمراجعة؛ هذه الصفحة لا تنشر مسودات أو تفاصيل لم تُعتمد.",
      "Japan is recorded in the cycling archive, with separate writing materials under review. This page does not publish unapproved drafts or unverified incidents."
    ],
    "sourceUrl": "https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%B1%D8%AD%D9%84%D8%A7%D8%AA%D9%8A-%D8%A8%D8%A7%D9%84%D8%AF%D8%B1%D8%A7%D8%AC%D8%A9/%D8%A7%D9%84%D9%8A%D8%A7%D8%A8%D8%A7%D9%86-2020-japan",
    "status": "index_only",
    "sourceNote": [
      "",
      ""
    ],
    "verified_intro": true
  },
  {
    "slug": "legacy-14",
    "type": "cycling",
    "img": "cycling.webp",
    "region": [
      "فرنسا",
      "France"
    ],
    "title": [
      "فرنسا France",
      "France"
    ],
    "desc": [
      "تحتفظ صفحة فرنسا الموحدة بأكثر من مدخل تاريخي لهذه الوجهة. يبقى رابط هذا السجل القديم قابلًا للفتح، وتُفصل أحداث كل رحلة عند توثيقها.",
      "The unified France page preserves more than one historical listing. This old entry remains accessible, with each trip’s events kept separate until verified."
    ],
    "sourceUrl": "https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%B1%D8%AD%D9%84%D8%A7%D8%AA%D9%8A-%D8%A8%D8%A7%D9%84%D8%AF%D8%B1%D8%A7%D8%AC%D8%A9/%D9%81%D8%B1%D9%86%D8%B3%D8%A7-2022",
    "status": "index_only",
    "sourceNote": [
      "",
      ""
    ],
    "verified_intro": true
  },
  {
    "slug": "legacy-15",
    "type": "cycling",
    "img": "cycling.webp",
    "region": [
      "انجلترا",
      "England"
    ],
    "title": [
      "إنجلترا England",
      "England"
    ],
    "desc": [
      "إنجلترا واردة ضمن رحلات الدراجة في أرشيف الموقع. نحفظ عنوان الوجهة ومصدرها، ولا نخلط أحداثها برحلات عائلية أو خطط سفر أخرى.",
      "England appears in the original cycling archive. Its source is preserved without confusing the journey with family road trips or other travel plans."
    ],
    "sourceUrl": "https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%B1%D8%AD%D9%84%D8%A7%D8%AA%D9%8A-%D8%A8%D8%A7%D9%84%D8%AF%D8%B1%D8%A7%D8%AC%D8%A9/%D8%A7%D9%86%D8%AC%D9%84%D8%AA%D8%B1%D8%A7-2022",
    "status": "index_only",
    "sourceNote": [
      "",
      ""
    ],
    "verified_intro": true
  },
  {
    "slug": "legacy-16",
    "type": "cycling",
    "img": "cycling.webp",
    "region": [
      "ويلز",
      "Wales"
    ],
    "title": [
      "ويلز Wales",
      "Wales"
    ],
    "desc": [
      "ويلز وجهة مستقلة في أرشيف الرحلات. هذه مساحة لتجميع دليل الرحلة الحقيقي بدل كتابة تفاصيل جغرافية أو شخصية لم ترد في مصادرها.",
      "Wales has a distinct entry in the travel archive. The page is a home for firsthand evidence rather than invented geographical or personal details."
    ],
    "sourceUrl": "https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%B1%D8%AD%D9%84%D8%A7%D8%AA%D9%8A-%D8%A8%D8%A7%D9%84%D8%AF%D8%B1%D8%A7%D8%AC%D8%A9/%D9%88%D9%8A%D9%84%D8%B2-2022",
    "status": "index_only",
    "sourceNote": [
      "",
      ""
    ],
    "verified_intro": true
  },
  {
    "slug": "legacy-17",
    "type": "cycling",
    "img": "cycling.webp",
    "region": [
      "ايرلندا",
      "Ireland"
    ],
    "title": [
      "أيرلندا Ireland",
      "Ireland"
    ],
    "desc": [
      "أيرلندا اسم مسجل بين رحلات الدراجة. هنا يبدأ التوثيق من المصدر الأصلي، ويبقى السرد التفصيلي مرهونًا بما تثبته مواد الرحلة.",
      "Ireland is a recorded cycling destination. Documentation begins with the original reference; detailed storytelling depends on the trip’s actual records."
    ],
    "sourceUrl": "https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%B1%D8%AD%D9%84%D8%A7%D8%AA%D9%8A-%D8%A8%D8%A7%D9%84%D8%AF%D8%B1%D8%A7%D8%AC%D8%A9/%D8%A7%D9%8A%D8%B1%D9%84%D9%86%D8%AF%D8%A7-2022",
    "status": "index_only",
    "sourceNote": [
      "",
      ""
    ],
    "verified_intro": true
  },
  {
    "slug": "legacy-18",
    "type": "cycling",
    "img": "cycling.webp",
    "region": [
      "أسكوتلندا",
      "Scotland"
    ],
    "title": [
      "اسكتلندا Scotland",
      "Scotland"
    ],
    "desc": [
      "اسكتلندا حاضرة في سجل رحلات الدراجة. لا ننسب إلى هذه الصفحة قصة بحيرة لوخ نيس أو غيرها دون ربط واضح بالمصدر الخاص بهذه الرحلة.",
      "Scotland is listed among the cycling journeys. Stories about Loch Ness or other places are not assigned to this trip without a clear source connection."
    ],
    "sourceUrl": "https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%B1%D8%AD%D9%84%D8%A7%D8%AA%D9%8A-%D8%A8%D8%A7%D9%84%D8%AF%D8%B1%D8%A7%D8%AC%D8%A9/%D8%A3%D8%B3%D9%83%D9%88%D8%AA%D9%84%D9%86%D8%AF%D8%A7-2022",
    "status": "index_only",
    "sourceNote": [
      "",
      ""
    ],
    "verified_intro": true
  },
  {
    "slug": "legacy-19",
    "type": "hiking",
    "img": "hiking.webp",
    "region": [
      "السعودية",
      "Saudi Arabia"
    ],
    "title": [
      "جبل يذبل صبحاء",
      "Jabal Yadhbul Subha"
    ],
    "desc": [
      "جبل يذبل صبحاء من الوجهات الجبلية المذكورة في أرشيف المغامرات. يرد بوصفه أعلى قمة في نجد في المصدر القديم؛ وتبقى تفاصيل الصعود مرتبطة بروايته الأصلية.",
      "Jabal Yadhbul Subha is listed in the mountain-adventures archive and described in the original page as Najd’s highest summit. Details of the ascent require its original account."
    ],
    "sourceUrl": "https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%AA%D8%B3%D9%84%D9%82-%D8%A7%D9%84%D8%AC%D8%A8%D8%A7%D9%84/%D8%A7%D9%84%D8%B3%D8%B9%D9%88%D8%AF%D9%8A%D8%A9/%D8%AC%D8%A8%D9%84-%D9%8A%D8%B0%D8%A8%D9%84-%D8%B5%D8%A8%D8%AD%D8%A7%D8%A1-%D8%A3%D8%B9%D9%84%D9%89-%D9%82%D9%85%D8%A9-%D9%81%D9%8A-%D9%86%D8%AC%D8%AF",
    "status": "index_only",
    "sourceNote": [
      "تسلق أعلى قمة جبل في نجد. تتضمن صفحة الأرشيف صورًا ووسوم مغامرات عبدالكريم.",
      "A page about ascending the highest mountain summit in Najd, featuring photos and adventure tags."
    ],
    "verified_intro": true
  },
  {
    "slug": "legacy-20",
    "type": "hiking",
    "img": "hiking.webp",
    "region": [
      "السعودية",
      "Saudi Arabia"
    ],
    "title": [
      "أم سدرة",
      "Umm Sidra"
    ],
    "desc": [
      "أم سدرة اسم من أرشيف الرحلات الجبلية. نجمع هنا اسم الموقع ورابطه الأصلي، بعيدًا عن اختلاق زمن الرحلة أو مسار الصعود.",
      "Umm Sidra appears in the mountain-journey archive. Its original listing is preserved without inventing dates, routes or an ascent narrative."
    ],
    "sourceUrl": "https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%AA%D8%B3%D9%84%D9%82-%D8%A7%D9%84%D8%AC%D8%A8%D8%A7%D9%84/%D8%A7%D9%84%D8%B3%D8%B9%D9%88%D8%AF%D9%8A%D8%A9/%D8%A7%D9%85-%D8%B3%D8%AF%D8%B1%D9%87-sedra",
    "status": "index_only",
    "sourceNote": [
      "",
      ""
    ],
    "verified_intro": true
  },
  {
    "slug": "legacy-21",
    "type": "hiking",
    "img": "hiking.webp",
    "region": [
      "السعودية",
      "Saudi Arabia"
    ],
    "title": [
      "شطب",
      "Shatb"
    ],
    "desc": [
      "شطب إحدى وجهات المغامرات الجبلية الموجودة في الأرشيف. نحتفظ بهذه المادة باسمها، ونفسح المجال للتوثيق الحقيقي لاحقًا.",
      "Shatb is one of the mountain destinations in the archive. Its identity is preserved while the full firsthand record awaits documentation."
    ],
    "sourceUrl": "https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%AA%D8%B3%D9%84%D9%82-%D8%A7%D9%84%D8%AC%D8%A8%D8%A7%D9%84/%D8%A7%D9%84%D8%B3%D8%B9%D9%88%D8%AF%D9%8A%D8%A9/%D8%B4%D8%B7%D8%A8-shatb",
    "status": "index_only",
    "sourceNote": [
      "",
      ""
    ],
    "verified_intro": true
  },
  {
    "slug": "legacy-22",
    "type": "hiking",
    "img": "hiking.webp",
    "region": [
      "السعودية",
      "Saudi Arabia"
    ],
    "title": [
      "جبل ثهلان",
      "Mount Thahlan"
    ],
    "desc": [
      "ثهلان من الجبال التي ظهرت في سجل الرحلات. وراء كل اسم جبل رحلة مستقلة؛ ولا نستبدل أحداثها بوصف عام يوهم بأنه شهادة شخصية.",
      "Mount Thahlan appears in the mountain-travel records. Each mountain has its own journey, and a general description must not masquerade as a firsthand story."
    ],
    "sourceUrl": "https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%AA%D8%B3%D9%84%D9%82-%D8%A7%D9%84%D8%AC%D8%A8%D8%A7%D9%84/%D8%A7%D9%84%D8%B3%D8%B9%D9%88%D8%AF%D9%8A%D8%A9/%D8%AB%D9%87%D9%84%D8%A7%D9%86-thahlan",
    "status": "index_only",
    "sourceNote": [
      "",
      ""
    ],
    "verified_intro": true
  },
  {
    "slug": "legacy-23",
    "type": "hiking",
    "img": "hiking.webp",
    "region": [
      "السعودية",
      "Saudi Arabia"
    ],
    "title": [
      "جبلة",
      "Jabalah"
    ],
    "desc": [
      "جبلة وجهة محفوظة في أرشيف الجبال. هذه الصفحة تجمع الاسم والمصدر، وتفصل بين سجل المكان وبين الوقائع التي لم تُوثّق كتابيًا بعد.",
      "Jabalah is retained in the mountain archive. This page separates the destination record from the personal events that have not yet been documented."
    ],
    "sourceUrl": "https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%AA%D8%B3%D9%84%D9%82-%D8%A7%D9%84%D8%AC%D8%A8%D8%A7%D9%84/%D8%A7%D9%84%D8%B3%D8%B9%D9%88%D8%AF%D9%8A%D8%A9/%D8%AC%D8%A8%D9%84%D9%87",
    "status": "index_only",
    "sourceNote": [
      "",
      ""
    ],
    "verified_intro": true
  }
];
const VERIFIED_JOURNEY_ARTICLES = {
  "legacy-5": {
    "ar": [
      "لم يسبق لي أن سافرت وحدي من مدينة إلى أخرى، فكيف قررت أن أعبر من دولة إلى دولة على دراجة هوائية؟",
      "لم أكن درّاجًا محترفًا، ولم تكن لدي خبرة سابقة بمثل هذه الرحلات. كنت مقبلًا على مغامرة في بلدان لا تتحدث لغتي، وعلى طرق لا أعرف ما ينتظرني فيها.",
      "لكنني كنت أؤمن بأن بعض التجارب لا تبدأ عندما نكون مستعدين تمامًا، بل عندما نمتلك الشجاعة لنخطو خطوتنا الأولى.",
      "في الخامس من مايو عام 2018، توكلت على الله وحده، وغادرت الرياض متجهًا إلى باريس. شحنت دراجتي الهوائية معي على متن الطائرة، دون أن أدرك تمامًا حجم التجربة التي كنت مقبلًا عليها.",
      "ومن باريس بدأت رحلتي الحقيقية، متجهًا نحو المجهول. كانت الوجهة التي أطمح للوصول إليها هي أمستردام، عاصمة هولندا.",
      "لم تكن المسألة مجرد انتقال بين مدينتين أو عبور حدود دولتين؛ كانت اختبارًا لشجاعتي وقدرتي على الاعتماد على نفسي، وفرصة لاكتشاف العالم خارج حدود ما اعتدت عليه.",
      "كنت أعرف نقطة البداية، وأعرف الوجهة التي أريد الوصول إليها، لكنني لم أكن أعرف ما الذي سيحدث بينهما.",
      "شهدت الرحلة أحداثًا كثيرة ومواقف تستحق أن تُروى. حاولت أن أوثّق بالكاميرا ما استطعت من تفاصيلها، رغم محدودية خبرتي آنذاك في التصوير والإخراج.",
      "ومع كل تجربة جديدة، ازددت اقتناعًا بأن المغامرة الحقيقية ليست في قطع المسافات وحدها، بل في اكتشاف الإنسان لقدرات لم يكن يعلم أنها موجودة داخله.",
      "هذه الرحلة لم تكن سوى البداية. وأطمح، بإذن الله، إلى تطوير أسلوبي في التصوير والتوثيق خلال رحلاتي القادمة، حتى لا تظل تلك التجارب مجرد ذكريات شخصية، بل تصبح قصصًا حقيقية يمكن للآخرين مشاهدتها والتعلم منها.",
      "فإن استطاعت مغامرتي أن تمنح إنسانًا واحدًا الشجاعة ليبدأ رحلته الخاصة، فقد تركت أثرًا يستحق أن يُروى.",
      "وأرجو من الله تعالى أن يجعل ما أقدمه من تجارب ومعرفة مصدر نفع وإلهام لمن يأتي بعدي، وأن يبقى أثره الطيب حتى بعد رحيلي عن هذه الدنيا، وأن يجعله في ميزان حسناتي."
    ],
    "en": [
      "I had never traveled alone from one city to another. So how did I find myself preparing to cycle across national borders?",
      "I was not an experienced cyclist, and I had never attempted a journey like this. I was heading into countries where I did not speak the language, along roads whose challenges I could not predict.",
      "Yet I believed that some experiences begin not when we feel perfectly prepared, but when we find the courage to take the first step.",
      "On 5 May 2018, putting my trust in God, I left Riyadh for Paris. I took my bicycle on the plane, with only a limited idea of the scale of the adventure ahead.",
      "Paris was the starting point of the cycling journey. My hoped-for destination was Amsterdam, the capital of the Netherlands.",
      "This was about more than traveling between cities or crossing borders. It was a test of my courage and independence, and a chance to experience a world beyond what I knew.",
      "I knew where I was starting and where I wanted to go. What lay between those two points was unknown.",
      "The journey brought many events and stories worth telling. I documented what I could with my camera, although my filming and storytelling skills were still developing.",
      "With every new experience, I became more convinced that the real adventure is not only the distance traveled, but discovering abilities within ourselves that we did not know we had.",
      "That journey was only the beginning. God willing, I hope to improve the way I film and document future travels, so these experiences become stories others can watch and learn from.",
      "If my journey gives even one person the courage to begin their own, then it has left something meaningful behind.",
      "I pray that the knowledge and experiences I share will benefit and inspire others, and that their good influence will remain after I am gone."
    ]
  },
  "legacy-6": {
    "ar": [
      "بلجيكا صفحة من أرشيف رحلات الدراجة. وراء اسم البلد قصة طريق تستحق أن تُحكى بصوت صاحبها؛ هنا نجمع ما ثبت من مادتها ونترك التفاصيل المجهولة بلا افتراضات."
    ],
    "en": [
      "Belgium appears in the original cycling archive. Behind the destination lies a road story worth telling in its traveler’s own words; confirmed material is preserved without invented details."
    ]
  },
  "legacy-7": {
    "ar": [
      "هولندا من الوجهات المسجلة في أرشيف الرحلات. تجمع هذه الصفحة مرجعها الأصلي وتفتح الباب لكتابة تفاصيلها من الصور والملاحظات الموثقة."
    ],
    "en": [
      "The Netherlands is listed in the original journey archive. Its source is retained here, ready for a more complete account grounded in photographs and firsthand notes."
    ]
  },
  "legacy-8": {
    "ar": [
      "لليونان حضور في سجل رحلاتي بالدراجة. هذا سجل الوجهة ونافذتها إلى المادة الأصلية؛ أما أسماء الطرق والمواقف فلم أضف منها شيئًا بلا توثيق."
    ],
    "en": [
      "Greece features in my cycling archive. This is the destination record and its original reference; no routes or personal encounters have been added without evidence."
    ]
  },
  "legacy-9": {
    "ar": [
      "فنلندا إحدى محطات أرشيف الدراجة في شمال أوروبا. لا تختصر البلدان في خريطة واحدة؛ ولكل رحلة حكاية سنوثقها بالمادة الأصلية حين تتوافر."
    ],
    "en": [
      "Finland is one of the Northern European destinations in the cycling archive. Every journey deserves its own verified account rather than a story inferred from a map."
    ]
  },
  "legacy-10": {
    "ar": [
      "السويد اسم آخر في سلسلة وجهات الدراجة المسجلة. بين اسم البلد والذكرى مساحة للتفاصيل الحقيقية التي تحفظها الصور والشهادات، لا الخيال."
    ],
    "en": [
      "Sweden is another recorded cycling destination. The journey’s real details belong to photographs and firsthand testimony, not to imagined scenes."
    ]
  },
  "legacy-11": {
    "ar": [
      "النرويج وجهة مدرجة في أرشيف مغامرات الدراجة. الطريق الحقيقي أهم من المبالغة فيه؛ لذلك نحتفظ بالمصدر حتى تُروى التجربة كما حدثت."
    ],
    "en": [
      "Norway appears in the cycling adventures archive. The actual road matters more than embellishment, so the original source is preserved for a faithful future account."
    ]
  },
  "legacy-12": {
    "ar": [
      "الدنمارك من صفحات رحلات الدراجة القديمة. نقدم هنا مدخلًا وثائقيًا مختصرًا ورابط التجربة الأصلية، دون استعارة أحداث من رحلات أخرى."
    ],
    "en": [
      "Denmark has its own entry in the cycling archive. This documentary introduction preserves the original reference without borrowing events from other trips."
    ]
  },
  "legacy-13": {
    "ar": [
      "اليابان من الوجهات المسجلة في أرشيف الدراجة. وهي تجربة ترتبط كذلك بمواد كتابة منفصلة تخضع للمراجعة؛ هذه الصفحة لا تنشر مسودات أو تفاصيل لم تُعتمد."
    ],
    "en": [
      "Japan is recorded in the cycling archive, with separate writing materials under review. This page does not publish unapproved drafts or unverified incidents."
    ]
  },
  "legacy-14": {
    "ar": [
      "تحتفظ صفحة فرنسا الموحدة بأكثر من مدخل تاريخي لهذه الوجهة. يبقى رابط هذا السجل القديم قابلًا للفتح، وتُفصل أحداث كل رحلة عند توثيقها."
    ],
    "en": [
      "The unified France page preserves more than one historical listing. This old entry remains accessible, with each trip’s events kept separate until verified."
    ]
  },
  "legacy-15": {
    "ar": [
      "إنجلترا واردة ضمن رحلات الدراجة في أرشيف الموقع. نحفظ عنوان الوجهة ومصدرها، ولا نخلط أحداثها برحلات عائلية أو خطط سفر أخرى."
    ],
    "en": [
      "England appears in the original cycling archive. Its source is preserved without confusing the journey with family road trips or other travel plans."
    ]
  },
  "legacy-16": {
    "ar": [
      "ويلز وجهة مستقلة في أرشيف الرحلات. هذه مساحة لتجميع دليل الرحلة الحقيقي بدل كتابة تفاصيل جغرافية أو شخصية لم ترد في مصادرها."
    ],
    "en": [
      "Wales has a distinct entry in the travel archive. The page is a home for firsthand evidence rather than invented geographical or personal details."
    ]
  },
  "legacy-17": {
    "ar": [
      "أيرلندا اسم مسجل بين رحلات الدراجة. هنا يبدأ التوثيق من المصدر الأصلي، ويبقى السرد التفصيلي مرهونًا بما تثبته مواد الرحلة."
    ],
    "en": [
      "Ireland is a recorded cycling destination. Documentation begins with the original reference; detailed storytelling depends on the trip’s actual records."
    ]
  },
  "legacy-18": {
    "ar": [
      "اسكتلندا حاضرة في سجل رحلات الدراجة. لا ننسب إلى هذه الصفحة قصة بحيرة لوخ نيس أو غيرها دون ربط واضح بالمصدر الخاص بهذه الرحلة."
    ],
    "en": [
      "Scotland is listed among the cycling journeys. Stories about Loch Ness or other places are not assigned to this trip without a clear source connection."
    ]
  },
  "legacy-19": {
    "ar": [
      "جبل يذبل صبحاء من الوجهات الجبلية المذكورة في أرشيف المغامرات. يرد بوصفه أعلى قمة في نجد في المصدر القديم؛ وتبقى تفاصيل الصعود مرتبطة بروايته الأصلية."
    ],
    "en": [
      "Jabal Yadhbul Subha is listed in the mountain-adventures archive and described in the original page as Najd’s highest summit. Details of the ascent require its original account."
    ]
  },
  "legacy-20": {
    "ar": [
      "أم سدرة اسم من أرشيف الرحلات الجبلية. نجمع هنا اسم الموقع ورابطه الأصلي، بعيدًا عن اختلاق زمن الرحلة أو مسار الصعود."
    ],
    "en": [
      "Umm Sidra appears in the mountain-journey archive. Its original listing is preserved without inventing dates, routes or an ascent narrative."
    ]
  },
  "legacy-21": {
    "ar": [
      "شطب إحدى وجهات المغامرات الجبلية الموجودة في الأرشيف. نحتفظ بهذه المادة باسمها، ونفسح المجال للتوثيق الحقيقي لاحقًا."
    ],
    "en": [
      "Shatb is one of the mountain destinations in the archive. Its identity is preserved while the full firsthand record awaits documentation."
    ]
  },
  "legacy-22": {
    "ar": [
      "ثهلان من الجبال التي ظهرت في سجل الرحلات. وراء كل اسم جبل رحلة مستقلة؛ ولا نستبدل أحداثها بوصف عام يوهم بأنه شهادة شخصية."
    ],
    "en": [
      "Mount Thahlan appears in the mountain-travel records. Each mountain has its own journey, and a general description must not masquerade as a firsthand story."
    ]
  },
  "legacy-23": {
    "ar": [
      "جبلة وجهة محفوظة في أرشيف الجبال. هذه الصفحة تجمع الاسم والمصدر، وتفصل بين سجل المكان وبين الوقائع التي لم تُوثّق كتابيًا بعد."
    ],
    "en": [
      "Jabalah is retained in the mountain archive. This page separates the destination record from the personal events that have not yet been documented."
    ]
  }
};

const stories = [];
const projects=[
  {slug:'alsaab-hospitality',type:'project',img:'hospitality.jpg',region:['الضيافة','Hospitality'],title:['فنادق ومنتجعات الصعب','Al Saab Hotels & Resorts'],desc:['مساحة تعريفية أولية لمشاريع الضيافة، رهن اعتماد المعلومات والصور.','A placeholder for hospitality projects, pending verified details and imagery.']},
  {slug:'heritage-hotel',type:'project',img:'journal-desert.webp',region:['التراث والضيافة','Heritage hospitality'],title:['فندق الشعراء التراثي','Al Shuara Heritage Hotel'],desc:['تعريف مبدئي بمشروع ورد اسمه في مواد التخطيط السابقة.','An introductory entry for a project named in earlier planning materials.']},
  {slug:'taif-greece',type:'project',img:'journal-greece.webp',region:['السياحة والعقار','Tourism & property'],title:['مشاريع الطائف واليونان','Taif & Greece projects'],desc:['ملخص تحريري إلى حين مراجعة أسماء المشاريع وحالاتها النهائية.','An editorial placeholder until specific projects and their status are verified.']}
];
const legacyRecords = [{"id":1,"title_ar":"الرئيسية","title_en":"Home","category":"overview","year":"","source_url":"https://sites.google.com/view/karimsaab/%D8%A7%D9%84%D8%B1%D8%A6%D9%8A%D8%B3%D9%8A%D8%A9","extracted_text_ar":"أب - عاشق للمغامرات - محفز - متكمم - رجل أعمال. يتضمن الغلاف عبارة «خبرة نتوارثها منذ عام 1395هـ 1975م»، وروابط إلى حفر الآبار والقطب الشمالي وتسلق أعلى قمة في نجد.","editorial_translation_en":"Father, adventure enthusiast, motivator, entrepreneur. The original homepage also refers to a heritage dating to 1395 AH / 1975 CE, in a business-related context.","content_status":"text_extracted"},{"id":2,"title_ar":"عن الصعب","title_en":"About Al Saab","category":"about","year":"","source_url":"https://sites.google.com/view/karimsaab/%D8%B9%D9%86-%D8%A7%D9%84%D8%B5%D8%B9%D8%A8","extracted_text_ar":"يعرض الموقع القديم معلومات عن الصعب ومشاريع تطوير عقاري وفنادق ومنتجعات؛ التفاصيل التشغيلية تحتاج مراجعة مستقلة.","editorial_translation_en":"The legacy site presents the Al Saab group and references property development, hotels and resorts. Current business status requires review.","content_status":"text_extracted"},{"id":3,"title_ar":"طريقتنا","title_en":"Our approach","category":"about","year":"","source_url":"https://sites.google.com/view/karimsaab/%D8%B9%D9%86-%D8%A7%D9%84%D8%B5%D8%B9%D8%A8/%D8%B7%D8%B1%D9%8A%D9%82%D8%AA%D9%86%D8%A7","extracted_text_ar":"يتضمن الموقع القديم قسمًا بعنوان «طريقتنا في العمل» ومواصفات فنية لمشاريع البناء، منها أعمال الخرسانة والأنظمة الإنشائية.","editorial_translation_en":"The legacy page describes work methods and technical construction specifications, including concrete and structural systems.","content_status":"text_extracted"},{"id":4,"title_ar":"هبوط بالمظلات","title_en":"Parachuting","category":"adventure","year":"","source_url":"https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D9%87%D8%A8%D9%88%D8%B7-%D8%A8%D8%A7%D9%84%D9%85%D8%B8%D9%84%D8%A7%D8%AA","extracted_text_ar":"تصف الصفحة القفز بالمظلة باعتباره من ألعاب الهواء الممتعة، وتضم رابطًا لألبوم صور عبر Google Photos.","editorial_translation_en":"The legacy page introduces parachuting and links to a Google Photos album.","content_status":"text_extracted"},{"id":5,"title_ar":"فرنسا France","title_en":"France","category":"cycling","year":"2018","source_url":"https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%B1%D8%AD%D9%84%D8%A7%D8%AA%D9%8A-%D8%A8%D8%A7%D9%84%D8%AF%D8%B1%D8%A7%D8%AC%D8%A9/%D9%81%D8%B1%D9%86%D8%B3%D8%A7-2018-france","extracted_text_ar":"كانت باريس نقطة البداية، وكان الطريق نحو أمستردام وجهة أطمح إلى بلوغها. بدأت المغامرة حين قررت أن أصحب دراجتي وأسافر وحدي، رغم أنني لم أكن دراجًا محترفًا.","editorial_translation_en":"Paris was my starting point, and Amsterdam was the destination I hoped to reach. I took my bicycle with me despite having no experience of such a journey.","content_status":"text_extracted"},{"id":6,"title_ar":"بلجيكا Belgium","title_en":"Belgium","category":"cycling","year":"2018","source_url":"https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%B1%D8%AD%D9%84%D8%A7%D8%AA%D9%8A-%D8%A8%D8%A7%D9%84%D8%AF%D8%B1%D8%A7%D8%AC%D8%A9/%D8%A8%D9%84%D8%AC%D9%8A%D9%83%D8%A7-2018-belgium","extracted_text_ar":"بلجيكا صفحة من أرشيف رحلات الدراجة. وراء اسم البلد قصة طريق تستحق أن تُحكى بصوت صاحبها؛ هنا نجمع ما ثبت من مادتها ونترك التفاصيل المجهولة بلا افتراضات.","editorial_translation_en":"Belgium appears in the original cycling archive. Behind the destination lies a road story worth telling in its traveler’s own words; confirmed material is preserved without invented details.","content_status":"index_only"},{"id":7,"title_ar":"هولندا Netherlands","title_en":"Netherlands","category":"cycling","year":"2018","source_url":"https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%B1%D8%AD%D9%84%D8%A7%D8%AA%D9%8A-%D8%A8%D8%A7%D9%84%D8%AF%D8%B1%D8%A7%D8%AC%D8%A9/%D9%87%D9%88%D9%84%D9%86%D8%AF%D8%A7-2018-nederland","extracted_text_ar":"هولندا من الوجهات المسجلة في أرشيف الرحلات. تجمع هذه الصفحة مرجعها الأصلي وتفتح الباب لكتابة تفاصيلها من الصور والملاحظات الموثقة.","editorial_translation_en":"The Netherlands is listed in the original journey archive. Its source is retained here, ready for a more complete account grounded in photographs and firsthand notes.","content_status":"index_only"},{"id":8,"title_ar":"اليونان Greece","title_en":"Greece","category":"cycling","year":"2019","source_url":"https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%B1%D8%AD%D9%84%D8%A7%D8%AA%D9%8A-%D8%A8%D8%A7%D9%84%D8%AF%D8%B1%D8%A7%D8%AC%D8%A9/%D8%A7%D9%84%D9%8A%D9%88%D9%86%D8%A7%D9%86-2019-greece","extracted_text_ar":"لليونان حضور في سجل رحلاتي بالدراجة. هذا سجل الوجهة ونافذتها إلى المادة الأصلية؛ أما أسماء الطرق والمواقف فلم أضف منها شيئًا بلا توثيق.","editorial_translation_en":"Greece features in my cycling archive. This is the destination record and its original reference; no routes or personal encounters have been added without evidence.","content_status":"index_only"},{"id":9,"title_ar":"فنلندا Finland","title_en":"Finland","category":"cycling","year":"2019","source_url":"https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%B1%D8%AD%D9%84%D8%A7%D8%AA%D9%8A-%D8%A8%D8%A7%D9%84%D8%AF%D8%B1%D8%A7%D8%AC%D8%A9/%D9%81%D9%86%D9%84%D9%86%D8%AF%D8%A7-2019-finland","extracted_text_ar":"فنلندا إحدى محطات أرشيف الدراجة في شمال أوروبا. لا تختصر البلدان في خريطة واحدة؛ ولكل رحلة حكاية سنوثقها بالمادة الأصلية حين تتوافر.","editorial_translation_en":"Finland is one of the Northern European destinations in the cycling archive. Every journey deserves its own verified account rather than a story inferred from a map.","content_status":"index_only"},{"id":10,"title_ar":"السويد Sweden","title_en":"Sweden","category":"cycling","year":"2019","source_url":"https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%B1%D8%AD%D9%84%D8%A7%D8%AA%D9%8A-%D8%A8%D8%A7%D9%84%D8%AF%D8%B1%D8%A7%D8%AC%D8%A9/%D8%A7%D9%84%D8%B3%D9%88%D9%8A%D8%AF2019-sweden","extracted_text_ar":"السويد اسم آخر في سلسلة وجهات الدراجة المسجلة. بين اسم البلد والذكرى مساحة للتفاصيل الحقيقية التي تحفظها الصور والشهادات، لا الخيال.","editorial_translation_en":"Sweden is another recorded cycling destination. The journey’s real details belong to photographs and firsthand testimony, not to imagined scenes.","content_status":"index_only"},{"id":11,"title_ar":"النرويج Norway","title_en":"Norway","category":"cycling","year":"2019","source_url":"https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%B1%D8%AD%D9%84%D8%A7%D8%AA%D9%8A-%D8%A8%D8%A7%D9%84%D8%AF%D8%B1%D8%A7%D8%AC%D8%A9/%D8%A7%D9%84%D9%86%D8%B1%D9%88%D9%8A%D8%AC-2019-norway","extracted_text_ar":"النرويج وجهة مدرجة في أرشيف مغامرات الدراجة. الطريق الحقيقي أهم من المبالغة فيه؛ لذلك نحتفظ بالمصدر حتى تُروى التجربة كما حدثت.","editorial_translation_en":"Norway appears in the cycling adventures archive. The actual road matters more than embellishment, so the original source is preserved for a faithful future account.","content_status":"index_only"},{"id":12,"title_ar":"الدنمارك Denmark","title_en":"Denmark","category":"cycling","year":"2019","source_url":"https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%B1%D8%AD%D9%84%D8%A7%D8%AA%D9%8A-%D8%A8%D8%A7%D9%84%D8%AF%D8%B1%D8%A7%D8%AC%D8%A9/%D8%A7%D9%84%D8%AF%D9%86%D9%85%D8%A7%D8%B1%D9%83-2019-denmark","extracted_text_ar":"الدنمارك من صفحات رحلات الدراجة القديمة. نقدم هنا مدخلًا وثائقيًا مختصرًا ورابط التجربة الأصلية، دون استعارة أحداث من رحلات أخرى.","editorial_translation_en":"Denmark has its own entry in the cycling archive. This documentary introduction preserves the original reference without borrowing events from other trips.","content_status":"index_only"},{"id":13,"title_ar":"اليابان Japan","title_en":"Japan","category":"cycling","year":"2020","source_url":"https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%B1%D8%AD%D9%84%D8%A7%D8%AA%D9%8A-%D8%A8%D8%A7%D9%84%D8%AF%D8%B1%D8%A7%D8%AC%D8%A9/%D8%A7%D9%84%D9%8A%D8%A7%D8%A8%D8%A7%D9%86-2020-japan","extracted_text_ar":"اليابان من الوجهات المسجلة في أرشيف الدراجة. وهي تجربة ترتبط كذلك بمواد كتابة منفصلة تخضع للمراجعة؛ هذه الصفحة لا تنشر مسودات أو تفاصيل لم تُعتمد.","editorial_translation_en":"Japan is recorded in the cycling archive, with separate writing materials under review. This page does not publish unapproved drafts or unverified incidents.","content_status":"index_only"},{"id":14,"title_ar":"فرنسا France","title_en":"France","category":"cycling","year":"2022","source_url":"https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%B1%D8%AD%D9%84%D8%A7%D8%AA%D9%8A-%D8%A8%D8%A7%D9%84%D8%AF%D8%B1%D8%A7%D8%AC%D8%A9/%D9%81%D8%B1%D9%86%D8%B3%D8%A7-2022","extracted_text_ar":"تحتفظ صفحة فرنسا الموحدة بأكثر من مدخل تاريخي لهذه الوجهة. يبقى رابط هذا السجل القديم قابلًا للفتح، وتُفصل أحداث كل رحلة عند توثيقها.","editorial_translation_en":"The unified France page preserves more than one historical listing. This old entry remains accessible, with each trip’s events kept separate until verified.","content_status":"index_only"},{"id":15,"title_ar":"إنجلترا England","title_en":"England","category":"cycling","year":"2022","source_url":"https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%B1%D8%AD%D9%84%D8%A7%D8%AA%D9%8A-%D8%A8%D8%A7%D9%84%D8%AF%D8%B1%D8%A7%D8%AC%D8%A9/%D8%A7%D9%86%D8%AC%D9%84%D8%AA%D8%B1%D8%A7-2022","extracted_text_ar":"إنجلترا واردة ضمن رحلات الدراجة في أرشيف الموقع. نحفظ عنوان الوجهة ومصدرها، ولا نخلط أحداثها برحلات عائلية أو خطط سفر أخرى.","editorial_translation_en":"England appears in the original cycling archive. Its source is preserved without confusing the journey with family road trips or other travel plans.","content_status":"index_only"},{"id":16,"title_ar":"ويلز Wales","title_en":"Wales","category":"cycling","year":"2022","source_url":"https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%B1%D8%AD%D9%84%D8%A7%D8%AA%D9%8A-%D8%A8%D8%A7%D9%84%D8%AF%D8%B1%D8%A7%D8%AC%D8%A9/%D9%88%D9%8A%D9%84%D8%B2-2022","extracted_text_ar":"ويلز وجهة مستقلة في أرشيف الرحلات. هذه مساحة لتجميع دليل الرحلة الحقيقي بدل كتابة تفاصيل جغرافية أو شخصية لم ترد في مصادرها.","editorial_translation_en":"Wales has a distinct entry in the travel archive. The page is a home for firsthand evidence rather than invented geographical or personal details.","content_status":"index_only"},{"id":17,"title_ar":"أيرلندا Ireland","title_en":"Ireland","category":"cycling","year":"2022","source_url":"https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%B1%D8%AD%D9%84%D8%A7%D8%AA%D9%8A-%D8%A8%D8%A7%D9%84%D8%AF%D8%B1%D8%A7%D8%AC%D8%A9/%D8%A7%D9%8A%D8%B1%D9%84%D9%86%D8%AF%D8%A7-2022","extracted_text_ar":"أيرلندا اسم مسجل بين رحلات الدراجة. هنا يبدأ التوثيق من المصدر الأصلي، ويبقى السرد التفصيلي مرهونًا بما تثبته مواد الرحلة.","editorial_translation_en":"Ireland is a recorded cycling destination. Documentation begins with the original reference; detailed storytelling depends on the trip’s actual records.","content_status":"index_only"},{"id":18,"title_ar":"اسكتلندا Scotland","title_en":"Scotland","category":"cycling","year":"2022","source_url":"https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%B1%D8%AD%D9%84%D8%A7%D8%AA%D9%8A-%D8%A8%D8%A7%D9%84%D8%AF%D8%B1%D8%A7%D8%AC%D8%A9/%D8%A3%D8%B3%D9%83%D9%88%D8%AA%D9%84%D9%86%D8%AF%D8%A7-2022","extracted_text_ar":"اسكتلندا حاضرة في سجل رحلات الدراجة. لا ننسب إلى هذه الصفحة قصة بحيرة لوخ نيس أو غيرها دون ربط واضح بالمصدر الخاص بهذه الرحلة.","editorial_translation_en":"Scotland is listed among the cycling journeys. Stories about Loch Ness or other places are not assigned to this trip without a clear source connection.","content_status":"index_only"},{"id":19,"title_ar":"جبل يذبل صبحاء — أعلى قمة في نجد","title_en":"Jabal Yadhbul Subha","category":"hiking","year":"","source_url":"https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%AA%D8%B3%D9%84%D9%82-%D8%A7%D9%84%D8%AC%D8%A8%D8%A7%D9%84/%D8%A7%D9%84%D8%B3%D8%B9%D9%88%D8%AF%D9%8A%D8%A9/%D8%AC%D8%A8%D9%84-%D9%8A%D8%B0%D8%A8%D9%84-%D8%B5%D8%A8%D8%AD%D8%A7%D8%A1-%D8%A3%D8%B9%D9%84%D9%89-%D9%82%D9%85%D8%A9-%D9%81%D9%8A-%D9%86%D8%AC%D8%AF","extracted_text_ar":"تسلق أعلى قمة جبل في نجد. تتضمن صفحة الأرشيف صورًا ووسوم مغامرات عبدالكريم.","editorial_translation_en":"A page about ascending the highest mountain summit in Najd, featuring photos and adventure tags.","content_status":"text_extracted"},{"id":20,"title_ar":"ام سدره SEDRA","title_en":"Umm Sidra","category":"hiking","year":"","source_url":"https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%AA%D8%B3%D9%84%D9%82-%D8%A7%D9%84%D8%AC%D8%A8%D8%A7%D9%84/%D8%A7%D9%84%D8%B3%D8%B9%D9%88%D8%AF%D9%8A%D8%A9/%D8%A7%D9%85-%D8%B3%D8%AF%D8%B1%D9%87-sedra","extracted_text_ar":"","editorial_translation_en":"","content_status":"index_only"},{"id":21,"title_ar":"شطب SHATB","title_en":"Shatb","category":"hiking","year":"","source_url":"https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%AA%D8%B3%D9%84%D9%82-%D8%A7%D9%84%D8%AC%D8%A8%D8%A7%D9%84/%D8%A7%D9%84%D8%B3%D8%B9%D9%88%D8%AF%D9%8A%D8%A9/%D8%B4%D8%B7%D8%A8-shatb","extracted_text_ar":"","editorial_translation_en":"","content_status":"index_only"},{"id":22,"title_ar":"ثهلان THAHLAN","title_en":"Mount Thahlan","category":"hiking","year":"","source_url":"https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%AA%D8%B3%D9%84%D9%82-%D8%A7%D9%84%D8%AC%D8%A8%D8%A7%D9%84/%D8%A7%D9%84%D8%B3%D8%B9%D9%88%D8%AF%D9%8A%D8%A9/%D8%AB%D9%87%D9%84%D8%A7%D9%86-thahlan","extracted_text_ar":"","editorial_translation_en":"","content_status":"index_only"},{"id":23,"title_ar":"جبله","title_en":"Jabalah","category":"hiking","year":"","source_url":"https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%AA%D8%B3%D9%84%D9%82-%D8%A7%D9%84%D8%AC%D8%A8%D8%A7%D9%84/%D8%A7%D9%84%D8%B3%D8%B9%D9%88%D8%AF%D9%8A%D8%A9/%D8%AC%D8%A8%D9%84%D9%87","extracted_text_ar":"","editorial_translation_en":"","content_status":"index_only"},{"id":24,"title_ar":"شرم الشيخ SHARM","title_en":"Sharm el-Sheikh diving","category":"diving","year":"","source_url":"https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%B9%D8%A7%D9%84%D9%85-%D8%A7%D9%84%D8%A8%D8%AD%D8%A7%D8%B1/%D8%A7%D9%84%D8%BA%D9%88%D8%B5-diving/%D8%B4%D8%B1%D9%85-%D8%A7%D9%84%D8%B4%D9%8A%D8%AE-sharm","extracted_text_ar":"","editorial_translation_en":"","content_status":"index_only"},{"id":25,"title_ar":"جده JEDDAH","title_en":"Jeddah diving","category":"diving","year":"","source_url":"https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%B9%D8%A7%D9%84%D9%85-%D8%A7%D9%84%D8%A8%D8%AD%D8%A7%D8%B1/%D8%A7%D9%84%D8%BA%D9%88%D8%B5-diving/%D8%AC%D8%AF%D9%87-jeddah","extracted_text_ar":"","editorial_translation_en":"","content_status":"index_only"},{"id":26,"title_ar":"القطب الشمالي","title_en":"The North Pole","category":"snow","year":"2022","source_url":"https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%A7%D9%84%D8%AB%D9%84%D9%88%D8%AC/%D8%A7%D9%84%D9%82%D8%B7%D8%A8-2022","extracted_text_ar":"","editorial_translation_en":"","content_status":"index_only"},{"id":27,"title_ar":"القطب الشمالي","title_en":"The North Pole","category":"snow","year":"2020","source_url":"https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%A7%D9%84%D8%AB%D9%84%D9%88%D8%AC/%D8%A7%D9%84%D9%82%D8%B7%D8%A8-2020","extracted_text_ar":"","editorial_translation_en":"","content_status":"index_only"},{"id":28,"title_ar":"جبال الألب ALPS mt","title_en":"Alps","category":"snow","year":"","source_url":"https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%A7%D9%84%D8%AB%D9%84%D9%88%D8%AC/%D8%AC%D8%A8%D8%A7%D9%84-%D8%A7%D9%84%D8%A3%D9%84%D8%A8-alps-mt","extracted_text_ar":"","editorial_translation_en":"","content_status":"index_only"},{"id":29,"title_ar":"استراليا AUSTRALIA","title_en":"Australia","category":"snow","year":"","source_url":"https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%A7%D9%84%D8%AB%D9%84%D9%88%D8%AC/%D8%A7%D8%B3%D8%AA%D8%B1%D8%A7%D9%84%D9%8A%D8%A7-australia","extracted_text_ar":"","editorial_translation_en":"","content_status":"index_only"},{"id":30,"title_ar":"لبنان LEBANON","title_en":"Lebanon","category":"snow","year":"","source_url":"https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%A7%D9%84%D8%AB%D9%84%D9%88%D8%AC/%D9%84%D8%A8%D9%86%D8%A7%D9%86-lebanon","extracted_text_ar":"","editorial_translation_en":"","content_status":"index_only"},{"id":31,"title_ar":"سلوفاكيا","title_en":"Slovakia","category":"snow","year":"","source_url":"https://sites.google.com/view/karimsaab/%D9%85%D8%BA%D8%A7%D9%85%D8%B1%D8%A7%D8%AA%D9%8A/%D8%A7%D9%84%D8%AB%D9%84%D9%88%D8%AC/%D8%B3%D9%84%D9%88%D9%81%D8%A7%D9%83%D9%8A%D8%A7","extracted_text_ar":"","editorial_translation_en":"","content_status":"index_only"},{"id":32,"title_ar":"كيف كنت وكيف اصبحت","title_en":"How I Was and How I Became","category":"books","year":"","source_url":"https://sites.google.com/view/karimsaab/%D9%83%D8%AA%D8%A8%D9%8A/%D9%83%D9%8A%D9%81-%D9%83%D9%86%D8%AA-%D9%88%D9%83%D9%8A%D9%81-%D8%A7%D8%B5%D8%A8%D8%AD%D8%AA","extracted_text_ar":"","editorial_translation_en":"","content_status":"index_only"},{"id":33,"title_ar":"حول العالم في ثمان سنوات","title_en":"Around the World in Eight Years","category":"books","year":"","source_url":"https://sites.google.com/view/karimsaab/%D9%83%D8%AA%D8%A8%D9%8A/%D8%AD%D9%88%D9%84-%D8%A7%D9%84%D8%B9%D8%A7%D9%84%D9%85-%D9%81%D9%8A-%D8%AB%D9%85%D8%A7%D9%86-%D8%B3%D9%86%D9%88%D8%A7%D8%AA","extracted_text_ar":"","editorial_translation_en":"","content_status":"index_only"},{"id":34,"title_ar":"اليابان في عشرين يوم","title_en":"Japan in Twenty Days","category":"books","year":"","source_url":"https://sites.google.com/view/karimsaab/%D9%83%D8%AA%D8%A8%D9%8A/%D8%A7%D9%84%D9%8A%D8%A7%D8%A8%D8%A7%D9%86-%D9%81%D9%8A-%D8%B9%D8%B4%D8%B1%D9%8A%D9%86-%D9%8A%D9%88%D9%85","extracted_text_ar":"","editorial_translation_en":"","content_status":"index_only"},{"id":35,"title_ar":"القطب الشمالي","title_en":"The North Pole","category":"books","year":"","source_url":"https://sites.google.com/view/karimsaab/%D9%83%D8%AA%D8%A8%D9%8A/%D8%A7%D9%84%D9%82%D8%B7%D8%A8-%D8%A7%D9%84%D8%B4%D9%85%D8%A7%D9%84%D9%8A","extracted_text_ar":"","editorial_translation_en":"","content_status":"index_only"},{"id":36,"title_ar":"حفر آبار","title_en":"Well building","category":"community","year":"","source_url":"","extracted_text_ar":"","editorial_translation_en":"","content_status":"listed_no_exact_link"},{"id":37,"title_ar":"إفطار صائم مصر","title_en":"Iftar in Egypt","category":"community","year":"","source_url":"","extracted_text_ar":"","editorial_translation_en":"","content_status":"listed_no_exact_link"},{"id":38,"title_ar":"إفطار صائم سيريلانكا","title_en":"Iftar in Sri Lanka","category":"community","year":"","source_url":"","extracted_text_ar":"","editorial_translation_en":"","content_status":"listed_no_exact_link"},{"id":39,"title_ar":"كفالة أيتام","title_en":"Orphan sponsorship","category":"community","year":"","source_url":"","extracted_text_ar":"","editorial_translation_en":"","content_status":"listed_no_exact_link"},{"id":40,"title_ar":"ندوات عقارية","title_en":"Real estate seminars","category":"media","year":"","source_url":"","extracted_text_ar":"","editorial_translation_en":"","content_status":"listed_no_exact_link"},{"id":41,"title_ar":"زيارات رسمية","title_en":"Official visits","category":"media","year":"","source_url":"","extracted_text_ar":"","editorial_translation_en":"","content_status":"listed_no_exact_link"},{"id":42,"title_ar":"مقابلات صحفية","title_en":"Press interviews","category":"media","year":"","source_url":"","extracted_text_ar":"","editorial_translation_en":"","content_status":"listed_no_exact_link"},{"id":43,"title_ar":"معارض عقارية","title_en":"Property exhibitions","category":"media","year":"","source_url":"","extracted_text_ar":"","editorial_translation_en":"","content_status":"listed_no_exact_link"},{"id":44,"title_ar":"توزيع سيارات للعملاء","title_en":"Client car giveaways","category":"media","year":"","source_url":"","extracted_text_ar":"","editorial_translation_en":"","content_status":"listed_no_exact_link"},{"id":45,"title_ar":"تسلسل حكام العالم الإسلامي","title_en":"Rulers of the Islamic world","category":"books","year":"","source_url":"","extracted_text_ar":"","editorial_translation_en":"","content_status":"listed_no_exact_link"},{"id":46,"title_ar":"اللغة الإنجليزية وميلاد الرسول","title_en":"English and the Prophet’s birth","category":"books","year":"","source_url":"","extracted_text_ar":"","editorial_translation_en":"","content_status":"listed_no_exact_link"},{"id":47,"title_ar":"العطور","title_en":"Perfumes","category":"products","year":"","source_url":"","extracted_text_ar":"","editorial_translation_en":"","content_status":"listed_no_exact_link"},{"id":48,"title_ar":"الكاب","title_en":"Caps","category":"products","year":"","source_url":"","extracted_text_ar":"","editorial_translation_en":"","content_status":"listed_no_exact_link"},{"id":49,"title_ar":"تيشيرت","title_en":"T-shirts","category":"products","year":"","source_url":"","extracted_text_ar":"","editorial_translation_en":"","content_status":"listed_no_exact_link"}];
const $=s=>document.querySelector(s), app=$('#app');
let state={lang:'ar',route:'',filter:'all',searchOpen:false,mobileOpen:false};
function text(k){return COPY[state.lang][k]||k}function v(item,key){return item[key][state.lang==='ar'?0:1]}
function path(route='',lang=state.lang){return `#/${lang}/${route}`}
function nav(){return [{r:'',label:text('nav')[0]},{r:'about',label:text('nav')[1],planned:true},{r:'journeys',label:text('nav')[2],planned:true},{r:'books',label:text('nav')[3],planned:true},{r:'products',label:text('nav')[4],planned:true},{r:'more',label:text('nav')[5],planned:true}].map((item,i)=>({...item,label:String(i+1).padStart(2,'0')+'. '+item.label}))}

// First-level dropdowns transcribed from the owner's screenshots (165750.jpg, 165751.jpg).
// URLs and further nested children must be supplied; these are deliberately NOT hyperlinks.
const OWNER_DROPDOWNS = {"about":[{"ar":"المؤسس","en":"Founder","child_menu":false,"contentId":"founder","route":"content/founder"},{"ar":"كياناتنا","en":"Our Entities","child_menu":false,"contentId":"entities","route":"content/entities"},{"ar":"نهج الصعب","en":"Al Saab Philosophy","child_menu":false,"contentId":"philosophy","route":"content/philosophy"},{"ar":"طريقتنا","en":"Our Approach","child_menu":false,"contentId":"method","route":"content/method"},{"ar":"أعمال تطوعية","en":"Volunteer Work","child_menu":true,"contentId":"volunteer","route":"content/volunteer"},{"ar":"عبدالكريم بن إبراهيم الصعب","en":"Abdulkarim bin Ibrahim Al Saab","child_menu":true,"contentId":"bio","route":"content/bio","sub_links":[{"ar":"يوتيوب YOUTUBE","en":"YouTube","url":"https://www.youtube.com/@alsaabb"},{"ar":"KARIMSAAB.COM","en":"KARIMSAAB.COM","route":""},{"ar":"سناب شات SNAPCHAT","en":"Snapchat","url":"https://www.snapchat.com/add/alsaab"},{"ar":"فيسبوك FACEBOOK","en":"Facebook","url":"https://www.facebook.com/alsaab.sa/"},{"ar":"إنستغرام INSTAGRAM","en":"Instagram","url":"https://www.instagram.com/alsaab.co/"},{"ar":"تيك توك TIKTOK","en":"TikTok","url":"https://www.tiktok.com/@alsaabb"},{"ar":"تويتر TWITTER","en":"Twitter / X","url":"https://twitter.com/karim_saab?lang=ar"}]}],"journeys":[{"ar":"هبوط بالمظلات","en":"Parachuting","child_menu":false,"contentId":"adventure-skydive","route":"content/adventure-skydive"},{"ar":"رحلاتي بالدراجة","en":"My Cycling Journeys","child_menu":true,"contentId":"cycling","route":"content/cycling"},{"ar":"تسلق الجبال","en":"Mountain Climbing","child_menu":true,"contentId":"hiking","route":"content/hiking","nested_groups":[{"ar":"السعودية","en":"Saudi Arabia","items":["archive-19","archive-20","archive-21","archive-22","archive-23"]},{"ar":"الهند","en":"India","items":["mount-munnar"]}]},{"ar":"عالم البحار","en":"Marine World","child_menu":true,"contentId":"diving","route":"content/diving"},{"ar":"الثلوج","en":"Snow Adventures","child_menu":true,"contentId":"snow","route":"content/snow"}],"books":[{"ar":"كيف كنت وكيف أصبحت","en":"How I Was and How I Became","legacy_ar":"كيف كنت وكيف اصبحت","contentId":"book-how","route":"content/book-how"},{"ar":"حول العالم في ثمان سنوات","en":"Around the World in Eight Years","legacy_ar":"حول العالم في ثمان سنوات","contentId":"book-world","route":"content/book-world"},{"ar":"اليابان في عشرين يوم","en":"Japan in Twenty Days","legacy_ar":"اليابان في عشرين يوم","contentId":"book-japan","route":"content/book-japan"},{"ar":"القطب الشمالي","en":"The North Pole","legacy_ar":"القطب الشمالي","contentId":"book-pole","route":"content/book-pole"},{"ar":"تسلسل حكام العالم الإسلامي","en":"Chronology of Rulers of the Islamic World","contentId":"book-rulers","route":"content/book-rulers"},{"ar":"اللغة الإنجليزية وميلاد الرسول","en":"The English Language and the Birth of the Prophet","contentId":"book-birth","route":"content/book-birth"},{"ar":"طفولتي بنجد","en":"My Childhood in Najd","contentId":"book-childhood-najd","route":"content/book-childhood-najd"},{"ar":"شيل الماء على الماء","en":"Carrying Water on Water","contentId":"book-shiel","route":"content/book-shiel"},{"ar":"كنت 150 كجم","en":"I Weighed 150 kg","contentId":"book-150kg","route":"content/book-150kg"},{"ar":"بعد الستين","en":"After Sixty","contentId":"book-after-sixty","route":"content/book-after-sixty"},{"ar":"كيف وُلدت English وما معنى England؟","en":"How Was English Born, and What Does England Mean?","contentId":"book-english-origins","route":"content/book-english-origins"},{"ar":"اليابان من شمالها إلى جنوبها","en":"Japan from North to South","contentId":"book-japan-north-south","route":"content/book-japan-north-south"}],"products":[{"ar":"عطور","en":"Perfumes","contentId":"product-perfumes","route":"content/product-perfumes"},{"ar":"كاب","en":"Caps","contentId":"product-caps","route":"content/product-caps"},{"ar":"تيشيرت","en":"T-Shirts","contentId":"product-tshirts","route":"content/product-tshirts"},{"ar":"هودي","en":"Hoodies","contentId":"product-hoodies","route":"content/product-hoodies"},{"ar":"لوحات فنية","en":"Artworks","contentId":"product-artworks","route":"content/product-artworks"},{"ar":"فيست","en":"Vests","contentId":"product-vests","route":"content/product-vests"},{"ar":"شنط","en":"Bags","contentId":"product-bags","route":"content/product-bags"},{"ar":"مجات","en":"Mugs","contentId":"product-mugs","route":"content/product-mugs"}],"more":[{"ar":"المركز الإعلامي","en":"Media Center","child_menu":true,"contentId":"media-center","route":"content/media-center","nested_items":["archive-40","archive-41","archive-42","archive-43","archive-44"]},{"ar":"اتصل بنا","en":"Contact Us","route":"contact","contentId":"contact"},{"ar":"مواقع التواصل الاجتماعي","en":"Social Media","child_menu":true,"route":"links","contentId":"social-directory","sub_links":[{"ar":"تويتر TWITTER","en":"Twitter / X","url":"https://twitter.com/karim_saab?lang=ar"},{"ar":"يوتيوب YOUTUBE","en":"YouTube","url":"https://www.youtube.com/@alsaabb"},{"ar":"واتساب WhatsApp","en":"WhatsApp","url":"https://wa.me/966127502211"},{"ar":"فيسبوك Facebook","en":"Facebook","url":"https://www.facebook.com/alsaab.sa/"},{"ar":"إنستغرام Instagram","en":"Instagram","url":"https://www.instagram.com/alsaab.co/"},{"ar":"تيك توك TikTok","en":"TikTok","url":"https://www.tiktok.com/@alsaabb"},{"ar":"سناب شات Snapchat","en":"Snapchat","url":"https://www.snapchat.com/add/alsaab"},{"ar":"لينكدإن LinkedIn","en":"LinkedIn","url":"https://www.linkedin.com/in/alsaab/"}]},{"ar":"ENGLISH site","en":"English Site","route":"","lang":"en","contentId":"switch-en"}]};
function originalBookLink(it){
  if(!it.legacy_ar)return '';
  const rec=legacyRecords.find(x=>x.title_ar===it.legacy_ar&&x.source_url);
  return rec?rec.source_url:'';
}
function ownerSubLink(it,cls='owner-menu-leaf'){
  const ar=state.lang==='ar',label=esc(it[ar?'ar':'en']);
  if(it.lang==='en')return `<a class="${cls} owner-menu-active" href="${path('', 'en')}" title="English version">${label}<span class="owner-link-mark">↗</span></a>`;
  if(it.route!==undefined)return `<a class="${cls} owner-menu-active" href="${path(it.route)}">${label}<span class="owner-link-mark">↗</span></a>`;
  const orig=originalBookLink(it);
  if(orig)return `<a class="${cls} owner-menu-active" href="${esc(orig)}" target="_blank" rel="noopener noreferrer" title="${ar?'فتح الصفحة الأصلية في تبويب جديد':'Open the original page in a new tab'}">${label}<span class="owner-link-mark" aria-hidden="true">↗</span></a>`;
  return `<span class="${cls} owner-menu-pending" title="${ar?'بانتظار إرسال رابط هذه الصفحة':'Awaiting the page URL'}">${label}<span class="owner-pending-dot" aria-hidden="true">·</span></span>`;
}
function navNode(x){
  let active=state.route.split('/')[0]===x.r?'active':'';
  let dd=OWNER_DROPDOWNS[x.r];
  if(!dd)return `<a href="${path(x.r)}" class="${active}">${x.label}</a>`;
  const ar=state.lang==='ar';
  const sub=dd.map(it=>{
    let label=esc(it[ar?'ar':'en']);
    if(it.child_menu){
      const data=window.KARIM_LIBRARY?.[it.contentId]||{};
      const children=(data.items||[]).map(id=>window.KARIM_LIBRARY[id]).filter(Boolean);
      const quick=it.route!==undefined?`<a class="owner-subgroup-route" href="${path(it.route)}">${ar?'فتح قسم':'Open section'} ${label} ↗</a>`:'';
      let childHTML=children.map(k=>`<a href="${path('content/'+k.id)}" class="owner-deep-link">${esc(k[ar?'ar':'en'])} ↗</a>`).join('');
      if(it.nested_items){childHTML=it.nested_items.map(id=>window.KARIM_LIBRARY[id]).filter(Boolean).map(k=>`<a href="${path('content/'+k.id)}" class="owner-deep-link">${esc(k[ar?'ar':'en'])} ↗</a>`).join('')}
      if(it.nested_groups){childHTML=it.nested_groups.map(g=>`<div class="owner-menu-region"><strong class="owner-region-name">${esc(g[ar?'ar':'en'])}</strong>${g.items.map(id=>window.KARIM_LIBRARY[id]).filter(Boolean).map(k=>`<a href="${path('content/'+k.id)}" class="owner-deep-link">${esc(k[ar?'ar':'en'])} ↗</a>`).join('')}</div>`).join('')}
      if(it.sub_links){childHTML=it.sub_links.map(l=>l.pending?`<span class="owner-deep-link owner-deep-pending" title="${ar?'بانتظار رابط الحساب المباشر':'Account link pending'}">${esc(l[ar?'ar':'en'])}<small>${ar?'الرابط قيد الإضافة':'Link pending'}</small></span>`:l.url?`<a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer" class="owner-deep-link">${esc(l[ar?'ar':'en'])} ↗</a>`:`<a href="${path(l.route)}" class="owner-deep-link">${esc(l[ar?'ar':'en'])} ↗</a>`).join('')}

      const fallback=ar?'تفاصيل إضافية لهذا القسم قيد استكمالها من المصادر.':'Additional details await verified source material.';
      return `<details class="owner-subgroup"><summary>${label}<span class="nav-chevron" aria-hidden="true">⌄</span></summary><div class="owner-subgroup-pending">${quick}${childHTML|| (it.contentId==='social-directory'?`<a href="${path('links')}">${ar?'كل روابط التواصل':'All social links'} ↗</a>`:fallback)}</div></details>`;
    }
    return ownerSubLink(it);
  }).join('');
  return `<div class="owner-nav-group" data-nav-group><a href="${path(x.r)}" class="owner-main-nav ${active}">${x.label}</a><button class="owner-menu-toggle" type="button" data-owner-menu-toggle aria-expanded="false" aria-label="${ar?'فتح قائمة':'Open menu'} ${x.label}">⌄</button><div class="owner-dropdown-panel">${sub}</div></div>`;
}

function arrow(){return state.lang==='ar'?'←':'→'}
function brand(){return `<a class="brand" href="${path()}" aria-label="${state.lang==='ar'?'عبدالكريم بن إبراهيم الصعب':'KARIM SAAB — Abdulkarim bin Ibrahim Al Saab'}"><span class="brand-symbol" aria-hidden="true"><span>✦</span></span><span class="brand-word">${state.lang==='ar'?'عبدالكريم بن إبراهيم الصعب':'KARIM SAAB'}<small>${state.lang==='ar'?'KARIM SAAB • AROUND THE WORLD BY BICYCLE':'ABDULKARIM BIN IBRAHIM AL SAAB'}</small></span></a>`}
function header(){const items=nav();return `<div class="notice-bar">${text('top')}</div><header class="site-header"><div class="container header-wrap">${brand()}<nav class="desktop-nav" aria-label="${text('siteMap')}">${items.map(x=>navNode(x)).join('')}</nav><div class="header-actions"><button id="search-toggle" class="search-btn" type="button" aria-expanded="false" aria-label="${text('search')}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg></button><button id="lang-toggle" class="lang-btn" type="button" aria-label="Change language">🌐 &nbsp; ${state.lang==='ar'?'English':'العربية'}</button><button id="mobile-toggle" class="menu-btn" type="button" aria-expanded="false" aria-label="Menu">☰</button></div></div><nav class="mobile-nav" id="mobile-nav" aria-label="Mobile navigation">${items.map(x=>navNode(x)).join('')}</nav><div id="search-panel" class="search-panel" hidden><form class="container search-panel-inner" id="search-form"><input name="q" type="search" required autocomplete="off" placeholder="${text('searchPlaceholder')}" aria-label="${text('search')}"/><button class="btn btn-gold" type="submit">${text('searchGo')}</button></form></div></header>`}

// Public social profiles listed in the owner's social-links document. Not scraped or guessed.
const SOCIAL_PROFILES = [
  {id:'youtube',name:'YouTube',handle:'KARIM SAAB',url:'https://www.youtube.com/c/Abdulkarimalsaabcomsa',monogram:'▶',primary:true},
  {id:'email',name:'Email',handle:'alsaabb@gmail.com',url:'mailto:alsaabb@gmail.com',monogram:'@',primary:true},
  {id:'whatsapp',name:'WhatsApp',handle:'+966 12 750 2211',url:'https://wa.me/966127502211',monogram:'WA',primary:true},
  {id:'tiktok',name:'TikTok',handle:'@alsaabb',url:'https://www.tiktok.com/@alsaabb',monogram:'♪',primary:true},
  {id:'instagram',name:'Instagram',handle:'@alsaab.co',url:'https://www.instagram.com/alsaab.co/',monogram:'◎',primary:true},
  {id:'snapchat',name:'Snapchat',handle:'alsaab',url:'https://www.snapchat.com/add/alsaab',monogram:'S',primary:true},
  {id:'x',name:'X / Twitter',handle:'@karim_saab',url:'https://twitter.com/karim_saab?lang=ar',monogram:'X',primary:true},
  {id:'facebook',name:'Facebook',handle:'alsaab.sa',url:'https://www.facebook.com/alsaab.sa/',monogram:'f',primary:true},
  {id:'linkedin',name:'LinkedIn',handle:'alsaab',url:'https://www.linkedin.com/in/alsaab/',monogram:'in',primary:true},
  {id:'tumblr',name:'Tumblr',handle:'alsaabb',url:'https://alsaabb.tumblr.com',monogram:'t',primary:true},
  {id:'pinterest',name:'Pinterest',handle:'Saved Pinterest link / رابط محفوظ',url:'https://pin.it/ytpesn76d5qqaf',monogram:'P',primary:false}
];
function socialIcon(s){return `<span class="social-icon social-icon--${s.id}" aria-hidden="true">${s.monogram}</span>`}
function socialLink(s,extra=''){return `<a class="social-link ${extra}" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(s.name)} — ${esc(s.handle)} (${state.lang==='ar'?'يفتح في تبويب جديد':'opens in a new tab'})" title="${esc(s.name)}">${socialIcon(s)}<span class="social-link-name">${esc(s.name)}</span></a>`}
function linksPage(){const ar=state.lang==='ar';return `<main>${pageHeader(text('linksTitle'),text('linksIntro'))}<section class="page-body"><div class="container"><div class="social-page-intro"><span class="eyebrow">SOCIAL & DIGITAL</span><h2>${text('socialFollow')}</h2><p>${text('linksIntro')}</p></div><div class="social-directory">${SOCIAL_PROFILES.filter(x=>x.primary).map(x=>`<a class="social-directory-card" href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${socialIcon(x)}<span class="social-directory-copy"><strong>${esc(x.name)}</strong><small dir="ltr">${esc(x.handle)}</small></span><span class="social-out-arrow" aria-hidden="true">↗</span></a>`).join('')}</div><div class="social-archive-links"><h3>${text('linksMore')}</h3>${SOCIAL_PROFILES.filter(x=>!x.primary).map(x=>`<a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${socialIcon(x)}<span>${esc(x.name)} — ${ar?'رابط Pinterest المحفوظ':'Saved Pinterest link'}</span><span aria-hidden="true">↗</span></a>`).join('')}</div><p class="social-source-note">${text('linksNote')}</p></div></section></main>`}


// Every entry on these three pages comes from the owner's screenshots; the 3 truncated book titles
// were completed using the previously indexed original Google Sites archive.
function sourcesBlock(item){
  const ar=state.lang==='ar', sources=item.sources||[];
  if(!sources.length)return `<p class="source-empty">${ar?'لا يوجد رابط تفصيلي متاح لهذا العنصر في المصادر المراجعة.':'No detailed source URL was available in the reviewed files.'}</p>`;
  return `<div class="content-source-links"><strong>${ar?'روابط المصادر الأصلية':'Original sources'}</strong><div>${sources.map(x=>`<a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.label)} ↗</a>`).join('')}</div></div>`;
}
function sourceTag(x){const ar=state.lang==='ar';if(x.status==='pdf')return ar?'متاح للقراءة PDF':'PDF reading copy';if(x.status==='cover')return ar?'عنوان وغلاف فقط':'Title / cover only';if(x.status==='title')return ar?'العنوان فقط — غير منشور':'Title only — unpublished';const labels={source:["محتوى من المستندات","Sourced"],extracted:["مقتطف من الموقع السابق","Archived excerpt"],index:["عنوان ورابط أرشيفي","Archive listing"],draft:["مسودة للمراجعة","Draft for review"],review:["يحتاج اعتمادًا","Awaiting approval"],asset:["مواد تصميم محفوظة","Design material"],editorial:["نص من خطة الموقع","Editorial brief"]};return (labels[x.status]||labels.review)[ar?0:1]}
function contentCard(x){const ar=state.lang==='ar',lbl=ar?x.ar:x.en,desc=ar?x.summary_ar:x.summary_en;return `<article class="source-content-card ${x.category==='books'?'book-card':''}">${x.image?`<img decoding="async" class="source-card-media" src="${esc(x.image)}" alt="${ar?(x.category==='books'?'صورة غلاف أو معاينة الكتاب':'تصميم بصري من Drive'):(x.category==='books'?'Book cover or document preview':'Design image from Drive')}" loading="lazy">`:x.category==='books'?`<div class="book-no-cover">${ar?'الغلاف غير متوفر':'Cover unavailable'}</div>`:''}<span class="source-state">${esc(sourceTag(x))}</span><h3>${esc(lbl)}</h3><p>${esc(desc)}</p><a class="source-action" href="${path('content/'+x.id)}">${ar?'افتح المادة':'Open item'} ${arrow()}</a></article>`}
function contentDetailPage(){const id=decodeURIComponent(state.route.slice('content/'.length).split('?')[0]);const c=window.KARIM_LIBRARY?.[id];if(!c)return notFound();if(/^archive-(?:[5-9]|1[0-9]|2[0-3])$/.test(id)){const oldroute=state.route;state.route='journey/legacy-'+id.split('-')[1];const page=detailPage();state.route=oldroute;return page;}const ar=state.lang==='ar';const title=ar?c.ar:c.en,summary=ar?c.summary_ar:c.summary_en,children=(c.items||[]).map(id=>window.KARIM_LIBRARY[id]).filter(Boolean);const image=c.image?`<figure class="source-hero-photo"><img decoding="async" src="${esc(c.image)}" alt="${ar?'تصميم بصري من ملفات Google Drive':'Visual concept from Google Drive'}"><figcaption>${c.category==='books'?(ar?(c.image_kind==='preview'?'معاينة من ملف الكتاب، وليست الغلاف الرسمي.':'غلاف من أرشيف المؤلف.'): (c.image_kind==='preview'?'Document preview; not the official book cover.':'Cover from the author archive.')):(ar?'تصميم بصري محفوظ في Google Drive، وليس إثباتًا لتوفر المنتج للبيع.':'Visual concept saved in Drive; not proof of a product for sale.')}</figcaption></figure>`:'';return `<main>${pageHeader(esc(title),esc(summary))}<section class="page-body source-hub"><div class="container"><nav class="source-return"><a href="${path()}" class="plain-link">${ar?'الرئيسية':'Home'} ${arrow()}</a><a href="${path('archive')}" class="plain-link">${ar?'الأرشيف':'Archive'} ${arrow()}</a></nav><div class="source-detail-layout"><article class="source-feature"><span class="source-state">${esc(sourceTag(c))}</span><h2>${esc(title)}</h2><p class="source-intro">${esc(summary)}</p>${image}${sourcesBlock(c)}${c.status!=='extracted'?`<div class="source-caution">${ar?'هذه نسخة عمل من الموقع. المسودات والعناوين الأرشيفية لا تعني أن الوقائع أو حالة المشروع معتمدة للنشر النهائي.':'This is a website preview. Drafts and archive listings are not final verification of events or project status.'}</div>`:''}</article><aside class="source-aside"><h3>${ar?'ما الذي نُقل؟':'What was imported?'}</h3><p>${ar?'اسم المادة، الوصف المستند إلى المصدر، حالتها وروابط الرجوع إلى الأصل.':'Item title, grounded summary, status and links back to its source.'}</p><span>${children.length} ${ar?'عناصر مرتبطة':'linked items'}</span></aside></div>${children.length?`<div class="source-list-heading"><span class="eyebrow">DRIVE & ORIGINAL SITE</span><h2>${ar?'المواد المرتبطة':'Related archive items'}</h2></div><div class="source-card-grid">${children.map(contentCard).join('')}</div>`:''}</div></section></main>`}
function awaitingSubmenuPage(name,kind){const ar=state.lang==='ar';const titles={books:["كتبي","My Books","journal-mountains.webp"],products:["منتجاتي","My Products","hospitality.jpg"],more:["المزيد","More","journal-desert.webp"]};const title=titles[kind][ar?0:1];const items=OWNER_DROPDOWNS[kind].map(it=>{if(it.contentId==='switch-en')return {id:'switch-en',ar:'ENGLISH site',en:'English Site',summary_ar:'انتقل إلى الواجهة الإنجليزية.',summary_en:'Switch to the English version.',status:'source',route:''};if(it.contentId==='contact')return {id:'contact',ar:'اتصل بنا',en:'Contact Us',summary_ar:'صفحة التواصل المهني والتعاون.',summary_en:'Contact and collaborations.',status:'source',route:'contact'};return window.KARIM_LIBRARY[it.contentId]}).filter(Boolean);return `<main>${pageHeader(title,ar?'مواد وعناوين من Google Drive وفهرس موقعك القديم. اضغط على أي مادة لقراءة ملخصها وفتح المصدر.':'Drive-backed entries and original site references. Open any item for details and sources.',titles[kind][2])}<section class="page-body source-hub"><div class="container"><div class="source-list-heading"><span class="eyebrow">KARIM SAAB • SOURCE ARCHIVE</span><h2>${title}</h2><p>${ar?'هذه المواد مأخوذة من أرشيفك ومصادرك؛ حالة كل مادة موضحة بوضوح.':'Every item points to your archived source or Drive record, with a visible content status.'}</p></div><div class="source-card-grid">${items.map(it=>it.route!==undefined?`<article class="source-content-card"><span class="source-state">${ar?'صفحة داخلية':'Internal page'}</span><h3>${esc(ar?it.ar:it.en)}</h3><p>${esc(ar?it.summary_ar:it.summary_en)}</p><a class="source-action" href="${path(it.id==='switch-en'?'':it.route,it.id==='switch-en'?'en':state.lang)}">${ar?'فتح':'Open'} ${arrow()}</a></article>`:contentCard(it)).join('')}</div></div></section></main>`}
function aboutSourcePage(){const ar=state.lang==='ar';const items=OWNER_DROPDOWNS.about.map(x=>window.KARIM_LIBRARY[x.contentId]).filter(Boolean);return `<main>${pageHeader(ar?'عن الصعب':'About Al Saab',ar?'الهوية الشخصية والمهنية كما وردت في مستندات موقعك، مع روابطها الأصلية.':'Personal and professional website brief with original source references.','hero-desert.webp')}<section class="page-body source-hub"><div class="container"><div class="source-list-heading"><span class="eyebrow">ABOUT • KARIM SAAB</span><h2>${ar?'السيرة والنهج والأعمال':'Background, philosophy and work'}</h2><p>${ar?'المعلومات هنا مستمدة من مستندات التخطيط وأرشيف الموقع، وليست اعتمادًا قانونيًا أو تسويقيًا للمشاريع.':'These descriptions originate in your planning documents and archive; project claims await approval.'}</p></div><div class="source-card-grid">${items.map(contentCard).join('')}</div></div></section></main>`}
function projectsFromDrivePage(){const ar=state.lang==='ar',items=['hospitality','ksa-estates','egypt-estates'].map(x=>window.KARIM_LIBRARY[x]);return `<main>${pageHeader(ar?'المشاريع':'Projects',ar?'عرض ثانوي للمشاريع حسب المستندات والمجلدات المتاحة في Google Drive.':'Secondary portfolio from available Google Drive briefs and folders.','hospitality.jpg')}<section class="page-body source-hub"><div class="container"><div class="source-list-heading"><span class="eyebrow">HOSPITALITY & REAL ESTATE</span><h2>${ar?'ملفات المشاريع والمراجع':'Project files and references'}</h2><p>${ar?'هذه صفحات تعريفية تستند إلى أسماء المجلدات ومسودات التخطيط فقط، دون أسعار أو ادعاءات تشغيلية غير موثقة.':'Source-backed project directory without invented prices or operating claims.'}</p></div><div class="source-card-grid">${items.map(contentCard).join('')}</div></div></section></main>`}

function footer(){return `<footer class="footer" id="footer"><div class="container"><div class="footer-columns"><div>${brand()}<p class="footer-copy">${text('footerText')}</p></div><nav class="footer-links" aria-label="Footer">${nav().map(x=>`<a href="${path(x.r)}">${x.label}</a>`).join('')}${[{r:'stories',ar:'الأفلام والقصص',en:'Films & Stories'},{r:'projects',ar:'المشاريع',en:'Projects'},{r:'contact',ar:'التواصل',en:'Contact'},{r:'links',ar:'الروابط',en:'Links'},{r:'archive',ar:'الأرشيف القديم',en:'Original Archive'}].map(x=>`<a href="${path(x.r)}">${x[state.lang]}</a>`).join('')}<a href="${path('review')}">${state.lang==='ar'?'مراجعة المواد':'Review library'}</a><a href="${path('privacy')}">${text('privacy')}</a></nav></div><div class="footer-social"><div class="footer-social-heading"><span>${text('socialFollow')}</span><a href="${path('links')}">${text('linksView')} <span aria-hidden="true">${arrow()}</span></a></div><div class="footer-social-list" aria-label="${text('linksTitle')}">${SOCIAL_PROFILES.filter(x=>x.primary).map(x=>socialLink(x,'social-link--footer')).join('')}</div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} KARIM SAAB. ALL RIGHTS RESERVED.</span><span>THINK · EXPLORE · CREATE · SHARE</span></div></div><div class="prototype-notice">${text('demo')}</div></footer>`}
function homepage(){return `<main>
<section class="hero"><div class="hero-images" aria-hidden="true"><div class="desert"></div><div class="alps"></div></div><div class="container"><div class="hero-star" aria-hidden="true"><span>✦</span></div><span class="eyebrow" style="color:#e5ca9c">${text('heroEyebrow')}</span><h1>${text('heroH')}</h1><div class="hero-en" lang="${state.lang==='ar'?'en':'ar'}">${text('heroAlt')}</div><p class="hero-sub">${text('heroSub')}</p><div class="hero-buttons"><a class="btn btn-gold" href="${path('journeys')}">${text('explore')} <span class="arrow">${arrow()}</span></a><a class="btn btn-outline" href="${path('stories')}">${text('seeStories')} <span class="arrow">${arrow()}</span></a></div></div><div class="container hero-bottom"><span class="hero-label"><span class="line"></span>ARABIA — EUROPE — BEYOND</span><span class="scroll-cue">${text('scroll')}<span></span></span></div></section>
<section class="section"><div class="container"><div class="section-heading"><div><span class="eyebrow">${text('journeyEyebrow')}</span><h2>${text('journeyH')}</h2><p>${text('journeySub')}</p></div><a class="plain-link" href="${path('journeys')}">${text('journeys')} <span>${arrow()}</span></a></div><div class="journey-feature-grid"><a href="${path('journeys?filter=cycling')}" class="feature-card"><img decoding="async" src="assets/cycling.webp" alt="Illustrative European cycling landscape" loading="lazy"><span class="feature-label">CYCLING JOURNEYS</span><div class="feature-body"><div><h3>${text('cycling')}</h3><p>${text('cyclingSub')}</p></div><span class="round-arrow">${arrow()}</span></div></a><a href="${path('journeys?filter=hiking')}" class="feature-card"><img decoding="async" src="assets/hiking.webp" alt="Illustrative rugged hiking landscape" loading="lazy"><span class="feature-label">HIKING & SUMMITS</span><div class="feature-body"><div><h3>${text('hiking')}</h3><p>${text('hikingSub')}</p></div><span class="round-arrow">${arrow()}</span></div></a></div></div></section>
<section class="section intro-section"><div class="container intro-grid"><div class="intro-image"><img decoding="async" src="assets/journal-mountains.webp" alt="Illustrative mountains and lake" loading="lazy"></div><div class="intro-copy"><span class="eyebrow">${text('introEyebrow')}</span><h2>${text('introH')}</h2><p>${text('introP')}</p><div class="quote-mark">${text('introQuote')}</div></div></div></section>
<section class="section story-section"><div class="container"><div class="section-heading"><div><span class="eyebrow">${text('storiesEyebrow')}</span><h2>${text('storiesH')}</h2><p>${text('storiesSub')}</p></div><a href="${path('stories')}" class="plain-link">${text('browseStories')} ${arrow()}</a></div><p>${state.lang==='ar'?'المحتوى قيد المراجعة':'Content under review'}</p></div></section>
<section class="section about-section"><div class="container about-grid"><div><span class="eyebrow">${text('aboutEyebrow')}</span><h2>${text('aboutH')}</h2><p>${text('aboutP')}</p><a href="${path('about')}" class="btn btn-outline">${text('aboutLink')} ${arrow()}</a></div><div class="about-fig"><blockquote>${text('aboutQuote')}</blockquote><span class="signature">KARIM SAAB</span></div></div></section>
<section class="projects-mini"><div class="container"><div class="projects-banner"><img decoding="async" src="assets/hospitality.jpg" alt="Illustrative hospitality architecture — not an actual property" loading="lazy"><div class="projects-text"><span class="eyebrow">${text('projectEyebrow')}</span><h2>${text('projectH')}</h2><p>${text('projectP')}</p><a href="${path('projects')}" class="plain-link">${text('projectLink')} <span>${arrow()}</span></a></div></div></div></section></main>`}
function storyCard(it){return `<a href="${path('story/'+it.slug)}" class="story-card"><div class="photo"><img decoding="async" loading="lazy" src="assets/${it.img}" alt="${text('photoNotice')}"></div><div class="story-body"><span class="category">${text('categoryStory')}</span><h3>${v(it,'title')}</h3><p>${v(it,'desc')}</p><div class="story-tail"><span>${text('read')}</span><span class="arrow">${arrow()}</span></div></div></a>`}
function listCard(it){let route=it.type==='story'?'story':it.type==='project'?'project':'journey';return `<a href="${path(route+'/'+it.slug)}" class="listing-card"><img decoding="async" loading="lazy" src="assets/${it.img}" alt="${text('photoNotice')}"><div class="content"><small>${v(it,'region')}</small><h3>${v(it,'title')}</h3><p>${v(it,'desc')}</p><div class="linkline"><span>${text('discover')}</span><span>${arrow()}</span></div></div></a>`}
function pageHeader(title,desc,bg){return `<section class="page-header ${bg?'has-photo':''}" ${bg?`style="--bg:url('assets/${bg}')"`:''}><div class="container"><div class="bread"><a href="${path()}">${text('nav')[0]}</a> / ${title}</div><h1>${title}</h1><p>${desc}</p></div></section>`}
function hikingGalleryPage(){return `<main>${pageHeader(state.lang==='ar'?'الهايكنج والتخييم':'Hiking & Camping',state.lang==='ar'?'معرض الصور المعتمد للهايكنج والمشي الجبلي والتخييم.':'Approved hiking, mountain walking and camping gallery.','hiking.webp')}${window.karimHikingGallery(state.lang,true)}</main>`}
function journeysPage(){let f=new URLSearchParams((state.route.split('?')[1]||'')).get('filter')||'all';if(!['all','cycling','hiking'].includes(f))f='all';state.filter=f;let items=(f==='all'?journeys:journeys.filter(x=>x.type===f)).filter(x=>x.slug!=='legacy-14');return `<main>${pageHeader(text('journeys'),text('journeysDesc'),'cycling.webp')}<section class="page-body"><div class="container"><div class="source-adventure-tabs">${['adventure-skydive','cycling','hiking','diving','snow'].map(id=>{let x=window.KARIM_LIBRARY[id];return `<a href="${path('content/'+id)}">${esc(state.lang==='ar'?x.ar:x.en)} ↗</a>`}).join('')}</div><div class="filter-bar"><div class="filter-group" role="group" aria-label="${text('journeys')}">${[['all',text('allJourneys')],['cycling',text('filterCycle')],['hiking',text('filterHike')]].map(([s,label])=>`<button type="button" class="chip ${f===s?'active':''}" data-filter="${s}" aria-pressed="${f===s}">${label}</button>`).join('')}</div><div class="filter-counter">${items.length} ${text('items')}</div></div><div class="listing-grid" id="journey-list">${items.map(listCard).join('')}</div></div></section>${window.karimHikingGallery(state.lang,false)}</main>`}


function reviewPage(){return pendingPage()}

function storiesPage(){return pendingPage()}
function projectsPage(){return `<main>${pageHeader(text('projects'),text('projectsDesc'),'hospitality.jpg')}<section class="page-body"><div class="container"><div class="section-heading"><div><span class="eyebrow">PROFESSIONAL PORTFOLIO</span><h2>${text('projectH')}</h2><p>${text('projectP')}</p></div></div><div class="listing-grid">${projects.map(listCard).join('')}</div><div class="note">${text('draft')}</div></div></section></main>`}
function aboutPage(){return `<main>${pageHeader(text('nav')[1],text('aboutDesc'),'hero-desert.webp')}<section class="page-body"><div class="container intro-grid"><div class="intro-image"><img decoding="async" src="assets/alps-clean.webp" alt="Illustrative European mountains"></div><div class="intro-copy"><span class="eyebrow">ABOUT / PHILOSOPHY</span><h2>${text('aboutMoreH')}</h2><p>${text('aboutP')}</p><p>${text('aboutMoreP')}</p><a class="btn btn-ghost" href="${path('journeys')}">${text('explore')} ${arrow()}</a></div></div></section></main>`}
function contactPage(){return `<main>${pageHeader(text('contact'),text('contactDesc'))}<section class="page-body"><div class="container contact-grid"><div class="contact-panel"><span class="eyebrow">STORIES & JOURNEYS</span><h2>${text('contactPersonal')}</h2><p>${text('contactPending')}</p><a class="official-contact-link" href="mailto:alsaabb@gmail.com">✉ alsaabb@gmail.com</a><a class="official-contact-link" href="mailto:alsaabb@gmail.com">✉ alsaabb@gmail.com</a><a class="plain-link" href="${path('stories')}">${text('stories')} ${arrow()}</a></div><div class="contact-panel"><span class="eyebrow">PROFESSIONAL</span><h2>${text('contactBusiness')}</h2><p>${text('contactPending')}</p><a class="plain-link" href="${path('projects')}">${text('projects')} ${arrow()}</a></div></div></section></main>`}
function detailPage(){
 if(state.route.startsWith("story/")||state.route.startsWith("project/"))return pendingPage();
 const [type,slug]=state.route.split('/');
 const list=type==='journey'?journeys:type==='story'?stories:projects;
 const it=list.find(x=>x.slug===slug); if(!it)return notFound();
 const ar=state.lang==='ar',back=type==='journey'?'journeys':type==='story'?'stories':'projects';
 const cat=type==='journey'?(it.type==='cycling'?text('categoryCycle'):text('categoryHike')):type==='story'?text('categoryStory'):text('projectTag');
 const canonical=it.slug==='legacy-14'?journeys.find(x=>x.slug==='legacy-5'):it;
 const article=type==='journey'?VERIFIED_JOURNEY_ARTICLES[it.slug]:null;
 const paras=article?article[ar?'ar':'en'].map(p=>`<p>${esc(p)}</p>`).join(''):`<p>${esc(v(it,'desc'))}</p>`;
 const extraFrance=it.slug==='legacy-5'?journeys.find(x=>x.slug==='legacy-14'):null;
 const sourceLines=type==='journey' ? `<div class="journey-records"><h3>${ar?'المصادر الأصلية':'Original references'}</h3>${[it,...(extraFrance?[extraFrance]:[])].filter(x=>x.sourceUrl).map(x=>`<p><a href="${esc(x.sourceUrl)}" target="_blank" rel="noopener noreferrer">${ar?'سجل الرحلة الأصلي':'Original trip record'}${x.slug==='legacy-14'?' (2022)':x.slug==='legacy-5'?' (2018)':''} ↗</a></p>`).join('')}</div>` : '';
 const note=type==='journey'&&it.slug==='legacy-5'?(ar?'النص التالي قصة فرنسا المعتمدة. ووجهة أمستردام كانت هدفًا للرحلة، وليست إثباتًا للوصول إليها.':'The following is the approved France account. Amsterdam was the intended destination, not a confirmed arrival.'):(ar?'افتتاحية مبنية على سجل الوجهة، وليست رواية مفصلة معتمدة لأحداث الرحلة.':'An editorial introduction based on the destination record, not a verified full trip account.');
 const related=type==='journey'?`<p class="journey-linktree"><a href="https://linktr.ee/ALSAABB" target="_blank" rel="noopener noreferrer">${ar?'جميع حساباتي ومحتواي':'My channels and content'} ↗</a></p>`:'';
 return `<main>${pageHeader(esc(v(canonical,'title')),text('detailSub'),it.img)}<section class="page-body"><div class="container"><a href="${path(back)}" class="plain-link" style="margin-bottom:25px">${arrow()} ${text('back')}</a><div class="detail-layout"><article class="body-prose"><img decoding="async" class="detail-media" src="assets/${it.img}" alt="${text('photoNotice')}"><p class="small muted">${text('photoNotice')}</p><span class="eyebrow">${cat}</span><h2>${esc(v(canonical,'title'))}</h2><p class="journey-reading-note">${note}</p>${paras}${sourceLines}${related}<div class="cta-row"><a class="btn btn-ghost" href="${path(back)}">${text('detailNext')} ${arrow()}</a><button class="btn btn-ghost" type="button" id="share-button">${text('share')}</button></div></article><aside class="side-box"><h3>${ar?'عن هذه الوجهة':'About this destination'}</h3><div class="side-row"><span>${text('labelType')}</span><span>${cat}</span></div><div class="side-row"><span>${text('labelRegion')}</span><span>${esc(v(it,'region'))}</span></div><div class="side-row"><span>${ar?'التحرير':'Editorial status'}</span><span>${type==='journey'&&it.slug==='legacy-5'?(ar?'قصة معتمدة':'Approved account'):(ar?'مدخل موثّق':'Sourced entry')}</span></div><div class="related-links"><a href="${path('journeys')}">${text('journeys')} ${arrow()}</a><a href="${path('stories')}">${text('stories')} ${arrow()}</a></div></aside></div></div></section></main>`;
}

function legacyEntryPage(){
 const match=state.route.match(/^entry\/(\d+)$/);if(!match)return notFound();
 const id=Number(match[1]),rec=legacyRecords.find(x=>x.id===id);if(!rec)return notFound();
 const source=window.KARIM_LIBRARY?.['archive-'+id];
 if(source){const old=state.route;state.route='content/archive-'+id;const html=contentDetailPage();state.route=old;return html;}
 const ar=state.lang==='ar';return `<main>${pageHeader(esc(ar?rec.title_ar:rec.title_en),ar?'سجل المصدر الأصلي':'Original source record')}<section class="page-body"><div class="container"><article class="body-prose"><h2>${esc(ar?rec.title_ar:rec.title_en)}</h2><p>${esc(ar?(rec.extracted_text_ar||'هذه المادة محفوظة في أرشيف الموقع الأصلي.'):(rec.editorial_translation_en||'Entry retained from the original website archive.'))}</p>${rec.source_url?`<p><a href="${esc(rec.source_url)}" target="_blank" rel="noopener noreferrer">${ar?'زيارة المصدر الأصلي':'Open original source'} ↗</a></p>`:''}</article></div></section></main>`;
}
function archivePage(){const ar=state.lang==='ar';const grouped=['cycling','hiking','snow','diving','adventure','books','about','community','media','products','overview'];const titles={cycling:['رحلات الدراجة','Cycling'],hiking:['الهايكنج والجبال','Hiking'],snow:['الثلوج والقطب','Snow & polar'],diving:['الغوص','Diving'],adventure:['مغامرات أخرى','Other adventures'],books:['كتبي','Books'],about:['السيرة والمشاريع','About & business'],community:['مبادرات مجتمعية','Community'],media:['الإعلام','Media'],products:['منتجات','Products'],overview:['الرئيسية','Homepage']};return `<main>${pageHeader(ar?'أرشيف الموقع السابق':'Original website archive',ar?'عناوين وروابط حقيقية من موقع Google Sites القديم. النصوص غير المتاحة لم تُخترع أو تُستبدل.':'Real titles and source links from the former Google Site. Missing page content has not been invented.','journal-mountains.webp')}<section class="page-body"><div class="container"><div class="note">${ar?'تم نقل قائمة الصفحات وروابط المصادر المستخرجة، وبعض النصوص المتاحة. يلزم تصدير Google Sites لنقل المقالات والصور كاملة.':'Page titles, recovered original links and some accessible text have been imported. A Google Sites export is required for full text and images.'}</div><div class="filter-bar"><input id="archive-find" aria-label="${ar?'ابحث في الأرشيف':'Search archive'}" type="search" placeholder="${ar?'ابحث باسم البلد أو الرحلة أو الكتاب':'Search by country, journey or book'}" style="background:#fff;color:#15253c;padding:12px;border-radius:8px;border:1px solid #d8d6cf;max-width:390px;width:100%"><span>${legacyRecords.length} ${ar?'سجلًا':'records'}</span></div><div id="archive-items">${grouped.map(c=>{let items=legacyRecords.filter(x=>x.category===c);return `<section class="archive-group" style="padding:22px 0"><h2>${titles[c][ar?0:1]} <small style="opacity:.55">(${items.length})</small></h2><div class="listing-grid">${items.map(x=>`<article class="listing-card archive-entry" data-search="${esc((x.title_ar+' '+x.title_en+' '+x.year).toLowerCase())}" style="padding:22px"><small>${esc(ar?(x.category==='cycling'?'رحلات الدراجة':x.category==='hiking'?'تسلق الجبال':'من الأرشيف'):(x.category==='cycling'?'CYCLING':x.category==='hiking'?'MOUNTAINS':'ARCHIVE'))}</small><h3>${esc(ar?x.title_ar:x.title_en)}</h3><p>${x.content_status==='text_extracted'?(esc(ar?x.extracted_text_ar:x.editorial_translation_en)):(esc(ar?(x.extracted_text_ar||'تعرّف على هذه الوجهة من سجل الأرشيف ورابطها الأصلي.'):(x.editorial_translation_en||'Explore this destination through the original archive reference.')))}</p><div class="linkline">${x.source_url?`<a href="${esc(x.source_url)}" target="_blank" rel="noopener noreferrer">${ar?'رابط الصفحة الأصلية':'Original page'} ↗</a>`:`<span>${ar?'الرابط التفصيلي غير متاح بعد':'Exact link pending'}</span>`}</div></article>`).join('')}</div></section>`}).join('')}</div></div></section></main>`}
function privacyPage(){return `<main>${pageHeader(text('privacy'),text('privacyText'))}<section class="page-body"><div class="container"><p>${text('privacyText')}</p></div></section></main>`}
function searchPage(){let params=new URLSearchParams((state.route.split('?')[1]||'')),q=params.get('q')||'', all=[...journeys,...stories,...projects], results=all.filter(x=>(v(x,'title')+' '+v(x,'desc')+' '+v(x,'region')).toLowerCase().includes(q.toLowerCase()));let sourceMatches=Object.values(window.KARIM_LIBRARY||{}).filter(x=>((x.ar+' '+x.en+' '+x.summary_ar+' '+x.summary_en).toLowerCase()).includes(q.toLowerCase())).slice(0,40);return `<main>${pageHeader(text('searchRes'),`${text('searchFor')} «${esc(q)}»`)}<section class="page-body"><div class="container">${results.length?`<div class="listing-grid">${results.map(listCard).join('')}</div>`:''}${sourceMatches.length?`<div class="source-card-grid">${sourceMatches.map(contentCard).join('')}</div>`:''}${!results.length&&!sourceMatches.length?`<div class="empty">${text('noResults')}</div>`:''}</div></section></main>`}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function notFound(){return `<main>${pageHeader('404','Page not found')}<section class="page-body"><div class="container"><a class="btn btn-ghost" href="${path()}">${text('nav')[0]} ${arrow()}</a></div></section></main>`}
function readRoute(){let raw=location.hash.replace(/^#\/?/,'');const parts=raw.split('/');state.lang=(parts[0]==='en')?'en':'ar';state.route=(parts[0]==='en'||parts[0]==='ar'?parts.slice(1):parts).join('/').replace(/\/$/,'');return state.route.split('?')[0]}
function render(){let r=readRoute();const legacyRoutes={adventures:'journeys',cycling:'content/cycling',hiking:'content/hiking',snow:'content/snow',diving:'content/diving'};if(legacyRoutes[r]){state.route=legacyRoutes[r];r=state.route;}let body=r===''?homepage():r==='adventures/hiking'?hikingGalleryPage():r==='journeys'?journeysPage():r==='stories'?storiesPage():r==='projects'?projectsFromDrivePage():r==='about'?aboutSourcePage():r==='contact'?contactPage():r==='books'?awaitingSubmenuPage('books','books'):r==='products'?karimProductsPage():r==='more'?awaitingSubmenuPage('more','more'):r==='links'?linksPage():r==='privacy'?privacyPage():r==='archive'?archivePage():r==='review'?reviewPage():r==='search'?searchPage():r.startsWith('entry/')?legacyEntryPage():r.startsWith('content/')?contentDetailPage():['journey','story','project'].includes(r.split('/')[0])?detailPage():notFound();document.documentElement.lang=state.lang;document.documentElement.dir=state.lang==='ar'?'rtl':'ltr';document.title=(r?`${r==='journeys'?text('journeys'):r==='books'?text('nav')[3]:r==='products'?text('nav')[4]:r==='more'?text('nav')[5]:r==='stories'?text('stories'):r==='projects'?text('projects'):r==='about'?text('about'):r==='contact'?text('contact'):r==='links'?text('linksTitle'):''} | `:'')+'KARIM SAAB';app.innerHTML=header()+body+footer();if(window.EMBED_ASSETS){app.querySelectorAll('img[src^="assets/"]').forEach(img=>{let n=img.getAttribute('src').split('/').pop();if(window.EMBED_ASSETS[n])img.src=window.EMBED_ASSETS[n]});app.querySelectorAll('[style*="assets/"]').forEach(el=>{let m=(el.getAttribute('style')||'').match(/assets\/([a-z-]+\.webp)/);if(m&&window.EMBED_ASSETS[m[1]])el.style.setProperty('--bg',`url("${window.EMBED_ASSETS[m[1]]}")`)})}if(window.EMBED_ASSETS){app.querySelectorAll('img[src^="media/"]').forEach(img=>{let n=img.getAttribute('src').split('/').pop();if(window.EMBED_ASSETS[n])img.src=window.EMBED_ASSETS[n]});app.querySelectorAll('a[href^="media/"]').forEach(a=>{let n=a.getAttribute('href').split('/').pop();if(window.EMBED_ASSETS[n])a.href=window.EMBED_ASSETS[n]});app.querySelectorAll('video[poster^="media/"]').forEach(v=>{let n=v.getAttribute('poster').split('/').pop();if(window.EMBED_ASSETS[n])v.poster=window.EMBED_ASSETS[n]})}if(window.EMBED_MEDIA){app.querySelectorAll('video[data-media]').forEach(v=>{let n=v.dataset.media;if(window.EMBED_MEDIA[n]){let src=v.querySelector('source');src.src=window.EMBED_MEDIA[n];v.load()}})}bind();window.scrollTo({top:0,behavior:'instant'});}
function bind(){const searchPanel=$('#search-panel'),mobile=$('#mobile-nav');
  document.querySelectorAll('[data-owner-menu-toggle]').forEach(btn=>btn.addEventListener('click',()=>{
    const group=btn.closest('[data-nav-group]');
    const open=group.classList.toggle('open');
    btn.setAttribute('aria-expanded',String(open));
  }));$('#lang-toggle').addEventListener('click',()=>{const newLang=state.lang==='ar'?'en':'ar';location.hash=path(state.route,newLang);renderIfSameHash(newLang)});$('#search-toggle').addEventListener('click',()=>{let expanded=searchPanel.hidden;searchPanel.hidden=!expanded;$('#search-toggle').setAttribute('aria-expanded',String(expanded));if(expanded)searchPanel.querySelector('input').focus()});$('#mobile-toggle').addEventListener('click',()=>{const open=mobile.classList.toggle('open');$('#mobile-toggle').setAttribute('aria-expanded',String(open));$('#mobile-toggle').textContent=open?'✕':'☰'});$('#search-form').addEventListener('submit',e=>{e.preventDefault();let q=new FormData(e.target).get('q').trim();if(q)location.hash=path('search?q='+encodeURIComponent(q))});document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{location.hash=path(btn.dataset.filter==='all'?'journeys':'journeys?filter='+btn.dataset.filter);renderIfSameHash(state.lang)}));$('#archive-find')?.addEventListener('input',e=>{let q=e.target.value.toLowerCase().trim();document.querySelectorAll('.archive-entry').forEach(el=>{el.hidden=!!q&&!el.dataset.search.includes(q)})});$('#share-button')?.addEventListener('click',async e=>{try{await navigator.clipboard.writeText(location.href);e.target.textContent=text('copied')}catch{e.target.textContent=location.href}});}
function onEscape(e){if(e.key==='Escape'){$('#search-panel').hidden=true;$('#mobile-nav').classList.remove('open')}}
function renderIfSameHash(lang){if(!location.hash)state.lang=lang; /* hashchange handles route updates */}
window.addEventListener('keydown',onEscape);window.addEventListener('hashchange',render);render();
