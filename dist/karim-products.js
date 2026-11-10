
/* Standalone KARIM SAAB Products hub — registered by the existing router. */
function karimProductsPage(){
  const ar=state.lang==='ar';
  const products=OWNER_DROPDOWNS.products;
  const symbols={'product-perfumes':'✦','product-caps':'◠','product-tshirts':'♧','product-hoodies':'♢','product-artworks':'▧','product-vests':'♙','product-bags':'▣','product-mugs':'♨'};
  const photos={'product-perfumes':'assets/perfume-japan-concept.webp','product-artworks':'assets/journal-mountains.webp'};
  const cards=products.map(item=>{
    const label=ar?item.ar:item.en;
    const sub=ar?item.en:item.ar;
    const photo=photos[item.contentId];
    return `<a class="ks-store-card" href="${path(item.route)}" aria-label="${esc(label)}">${photo?`<img src="${photo}" loading="lazy" alt="${esc(ar?'صورة تصورية للفئة':'Illustrative category image')}">`:`<span class="ks-store-icon" aria-hidden="true">${symbols[item.contentId]||'✦'}</span>`}<div class="ks-store-card-content"><strong>${esc(label)}</strong><span>${esc(sub)}</span><small>${ar?'استكشف الفئة':'Explore category'} ↗</small></div></a>`;
  }).join('');
  return `<main class="ks-store">
    <section class="ks-store-hero"><div class="ks-store-hero-inner">
      <nav class="ks-store-breadcrumb" aria-label="${ar?'مسار التنقل':'Breadcrumb'}"><a href="${path()}">${ar?'الرئيسية':'Home'}</a> / ${ar?'منتجاتي':'My Products'}</nav>
      <span class="ks-store-kicker">KARIM SAAB · PRODUCTS</span>
      <h1>${ar?'منتجاتي':'My Products'}</h1>
      <p class="ks-store-en">${ar?'MY PRODUCTS':'منتجاتي'}</p>
      <p class="ks-store-tagline">${ar?'منتجات مستوحاة من السفر والمغامرة':'Products inspired by travel and adventure'}</p>
      <div class="ks-store-actions">
        <a class="ks-store-action ks-store-action-primary" href="#ks-store-categories">${ar?'استكشف المنتجات':'Explore products'} ↓</a>
        <a class="ks-store-action ks-store-action-secondary" href="${path('journeys')}">${ar?'شاهد المغامرات':'Explore adventures'} ↗</a>
      </div>
    </div></section>
    <section id="ks-store-categories" class="ks-store-cats ks-store-container" aria-labelledby="ks-store-heading">
      <div class="ks-store-heading"><span class="ks-store-kicker">PRODUCT COLLECTIONS</span><h2 id="ks-store-heading">${ar?'تسوّق حسب الفئة':'Browse by category'}</h2><p>${ar?'ثماني فئات من قائمة منتجاتي':'Eight categories from My Products'}</p></div>
      <div class="ks-store-grid">${cards}</div>
      <p class="ks-store-disclaimer">${ar?'التصنيفات لا تعني توفر منتجات للشراء حاليًا. تفاصيل المنتجات والأسعار والتوافر تُعرض بعد اعتمادها.':'Categories do not confirm items currently available for sale. Prices and availability will appear when verified.'}</p>
    </section>
    <section class="ks-store-bottom"><div class="ks-store-container ks-store-bottom-inner"><div><span class="ks-store-kicker">KARIM SAAB · JOURNEYS</span><h2>${ar?'من رحلاتي إلى منتجاتي':'From my journeys to my products'}</h2><p>${ar?'استكشف رحلات الدراجة والمغامرات التي تشكّل روح هذا القسم.':'Explore the cycling journeys and adventures behind this section.'}</p></div><a class="ks-store-action ks-store-action-secondary" href="${path('journeys')}">${ar?'استكشف المغامرات':'Explore adventures'} ↗</a></div></section>
  </main>`;
}
