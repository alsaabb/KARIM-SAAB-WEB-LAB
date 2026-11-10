/* KARIM SAAB Products V1.1: approved screenshot-derived visual.
 * Ten actual reference crops are archived in Google Drive under
 * 🔴 05 - تسوّق / KARIM SAAB — Products Reference Assets V1.1 — 2026-11-10.
 * These are visual composites, NOT verified inventory/checkout promises.
 */
function karimProductsPage(){
  const ar=state.lang!=='en';
  const t=(arabic,english)=>ar?arabic:english;
  const asset='assets/products-reference-v1.1/';
  const categories=[
    {id:'product-perfumes',ar:'عطور',en:'Perfumes',image:'perfumes.webp'},
    {id:'product-caps',ar:'كاب',en:'Caps',image:'caps.webp'},
    {id:'product-tshirts',ar:'تيشيرت',en:'T-Shirts',image:'tshirts.webp'},
    {id:'product-hoodies',ar:'هودي',en:'Hoodies',image:'hoodies.webp'},
    {id:'product-artworks',ar:'لوحات فنية',en:'Artworks',image:'artworks.webp'},
    {id:'product-vests',ar:'فيست',en:'Vests',image:'vests.webp'},
    {id:'product-bags',ar:'شنط',en:'Bags',image:'bags.webp'},
    {id:'product-mugs',ar:'مجات',en:'Mugs',image:'mugs.webp'}
  ];
  const indexed=Object.fromEntries((OWNER_DROPDOWNS.products||[]).map(x=>[x.contentId,x]));
  const cards=categories.map(x=>{
    const original=indexed[x.id];
    const route=original?.route||'content/'+x.id;
    const label=t(x.ar,x.en);
    return '<a class="ks-v11-card" href="'+path(route)+'" aria-label="'+esc(label)+'">'+
      '<img loading="lazy" decoding="async" src="'+asset+x.image+'" alt="'+esc(t('صورة من المرجع البصري لفئة '+x.ar,'Approved visual reference for '+x.en))+'">'+
      '<span class="ks-v11-card-fade"></span><span class="ks-v11-card-label"><strong>'+esc(label)+'</strong><small>'+esc(t(x.en,x.ar))+'</small></span>'+
      '<span class="ks-v11-arrow" aria-hidden="true">➜</span></a>';
  }).join('');
  const featureItems=[
    ['gift',t('منتجات مستوحاة من الرحلات','Travel-inspired products'),'♧'],
    ['shield',t('هوية KARIM SAAB','KARIM SAAB identity'),'◇'],
    ['details',t('المواصفات بعد اعتمادها','Details pending approval'),'▤'],
    ['status',t('الطلب الإلكتروني غير مفعل','Online orders unavailable'),'○']
  ];
  return '<main class="ks-v11-store" dir="'+(ar?'rtl':'ltr')+'">'+
    '<section class="ks-v11-hero" aria-label="'+t('مقدمة المنتجات','Product introduction')+'">'+
      '<div class="ks-v11-hero-inner"><div class="ks-v11-hero-copy">'+
      '<span class="ks-v11-hero-mark" aria-hidden="true">⌃⌃⌃</span><h1>KARIM SAAB</h1>'+
      '<p>'+t('مغامرات .. رحلات .. ومنتجات مستوحاة منها','Adventures .. Journeys .. Inspired Products')+'</p>'+
      '<p class="ks-v11-caption-en">'+t('Adventures .. Journeys .. Inspired Products','مغامرات .. رحلات .. ومنتجات مستوحاة منها')+'</p>'+
      '<div class="ks-v11-actions"><a class="ks-v11-btn primary" href="#ks-v11-categories">'+t('استكشف المنتجات','Explore products')+' <span aria-hidden="true">◁</span></a>'+
      '<a class="ks-v11-btn secondary" href="'+path('journeys')+'">'+t('شاهد المغامرات','Explore Adventures')+' <span aria-hidden="true">◉</span></a></div></div></div></section>'+
    '<div class="ks-v11-container"><section class="ks-v11-features" aria-label="'+t('مميزات ومعلومات القسم','Collection information')+'">'+
      featureItems.map(x=>'<div class="ks-v11-feature"><span aria-hidden="true">'+x[2]+'</span><p>'+esc(x[1])+'</p></div>').join('')+'</section>'+
    '<section id="ks-v11-categories" class="ks-v11-section"><div class="ks-v11-heading"><span></span><div><h2>'+t('منتجاتي','My Products')+'</h2><p>'+t('My Products','منتجاتي')+'</p></div><span></span></div>'+
    '<div class="ks-v11-grid">'+cards+'</div></section>'+
    '<section class="ks-v11-journey"><div class="ks-v11-journey-copy"><h2>'+t('منتجات من رحلاتي','Products From My Journeys')+'</h2>'+
       '<p>'+t('تصاميم مستوحاة من مغامرات حقيقية','Designs inspired by real adventures')+'</p>'+
       '<a class="ks-v11-btn primary" href="'+path('journeys')+'">'+t('استكشف الرحلات','Explore Journeys')+' <span aria-hidden="true">➜</span></a></div></section>'+
    '<p class="ks-v11-disclaimer">'+t('هذه صور تصميمية مقتطعة من المرجع البصري المعتمد، وليست دليلًا على توفر المنتجات أو تفعيل الدفع أو الشحن. تُعرض الأسعار والطلبات بعد اعتمادها.','These visuals are crops from the approved design reference, not evidence of available stock, checkout or shipping. Product offers and prices require separate approval.')+'</p>'+
    '<p class="ks-v11-original">'+t('المصدر البصري الرئيسي محفوظ في Google Drive.','Primary visual reference is archived on Google Drive.')+' <a target="_blank" rel="noopener noreferrer" href="https://drive.google.com/drive/folders/1n_X7OTkmqgfy_PwbIZl-lx1yJ0Gr39q6">'+t('فتح الأصول','Open source assets')+' ↗</a></p>'+
    '</div></main>';
}