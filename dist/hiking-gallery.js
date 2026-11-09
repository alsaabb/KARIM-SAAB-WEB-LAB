/* KARIM SAAB • Approved Hiking & Camping gallery • 2026-11-09.
   Source: Google Drive section ADV-07. Real assets are bundled locally. */
(function () {
  'use strict';

  const base = 'assets/hiking/';
  const photos = [
    {
      file: 'hiking_tent_campfire.png',
      ar: 'المخيم ونار المساء',
      en: 'Tent & Campfire',
      descriptionAr: 'خيمة مضاءة ونار المخيم وسط أجواء الطبيعة الهادئة.',
      descriptionEn: 'A glowing tent and campfire in the quiet of the outdoors.'
    },
    {
      file: 'hiking_morning_coffee.png',
      ar: 'قهوة الصباح في الطبيعة',
      en: 'Morning Coffee Outdoors',
      descriptionAr: 'لحظة قهوة هادئة مع نسيم الصباح وإطلالة الطبيعة.',
      descriptionEn: 'A quiet cup of coffee surrounded by the beauty of the morning.'
    },
    {
      file: 'hiking_cooking_waterfall.png',
      ar: 'الطبخ عند الشلال',
      en: 'Cooking by the Waterfall',
      descriptionAr: 'تجهيز الطعام في الهواء الطلق بجوار الشلال.',
      descriptionEn: 'Preparing a meal outdoors beside a waterfall.'
    }
  ];

  window.karimHikingGallery = function (lang, dedicated) {
    const ar = lang !== 'en';
    const home = '#/' + (ar ? 'ar' : 'en') + '/journeys';
    const fullGallery = '#/' + (ar ? 'ar' : 'en') + '/adventures/hiking';
    const title = ar ? 'الهايكنج والتخييم' : 'Hiking & Camping';
    const subtitle = ar
      ? 'صور من أجواء المشي الجبلي والتخييم، من تجهيز المخيم إلى قهوة الصباح والطبخ في الطبيعة.'
      : 'Explore hiking and camping scenes, from a fireside tent to morning coffee and cooking outdoors.';
    const cards = photos.map(function (photo) {
      const label = ar ? photo.ar : photo.en;
      const description = ar ? photo.descriptionAr : photo.descriptionEn;
      return '<a class="hiking-gallery__card" href="' + base + photo.file
        + '" target="_blank" rel="noopener noreferrer" aria-label="' + label
        + (ar ? ' — افتح الصورة بالحجم الكامل' : ' — open full-size image') + '">'
        + '<img src="' + base + photo.file + '" alt="' + label
        + '" loading="lazy" decoding="async" width="1024" height="1024">'
        + '<span class="hiking-gallery__card-body"><strong>' + label + '</strong>'
        + '<span>' + description + '</span>'
        + '<small>' + (ar ? 'عرض الصورة بالحجم الكامل ↗' : 'View full-size image ↗')
        + '</small></span></a>';
    }).join('');

    return '<section id="hiking-camping-gallery" class="hiking-gallery" aria-labelledby="hiking-gallery-title">'
      + '<div class="hiking-gallery__container">'
      + '<div class="hiking-gallery__heading"><span class="hiking-gallery__eyebrow">'
      + 'ADVENTURES / HIKING & CAMPING</span><h2 id="hiking-gallery-title">' + title
      + '</h2><p>' + subtitle + '</p></div>'
      + '<div class="hiking-gallery__feature">'
      + '<a href="' + base + 'hiking_main_hero_poster.jpg" target="_blank" rel="noopener noreferrer"'
      + ' class="hiking-gallery__poster" aria-label="'
      + (ar ? 'فتح الغلاف الكامل لقسم الهايكنج' : 'Open full-size hiking poster') + '">'
      + '<img src="' + base + 'hiking_main_hero_poster.jpg"'
      + ' alt="' + (ar ? 'غلاف المغامرة: الهايكنج والتخييم' : 'Explore the Wild hiking and camping poster')
      + '" loading="lazy" decoding="async" width="747" height="1000"></a>'
      + '<div class="hiking-gallery__story"><span class="hiking-gallery__eyebrow">'
      + (ar ? 'قمم تصنع الحياة' : 'Peaks That Shape a Life') + '</span>'
      + '<h3>' + (ar ? 'من الدروب الجبلية إلى لحظات السكينة' : 'From Mountain Trails to Quiet Moments') + '</h3>'
      + '<p>' + (ar
        ? 'بين الدروب الوعرة وسكون المخيم، لكل رحلة تفاصيل تستحق أن تُحفظ: الطريق، والوقفة عند القمة، ودفء النار، وفنجان القهوة.'
        : 'On rugged trails and at peaceful campsites, every adventure holds moments worth remembering: the route, the summit, the warmth of a fire, and a morning coffee.')
      + '</p><p class="hiking-gallery__byline">'
      + (ar ? 'عبدالكريم بن إبراهيم الصعب' : 'Abdulkarim bin Ibrahim Al Saab')
      + '</p>'
      + (dedicated
        ? '<a class="hiking-gallery__button" href="' + home + '">'
          + (ar ? 'العودة إلى مغامراتي' : 'Back to My Adventures') + '</a>'
        : '<a class="hiking-gallery__button" href="' + fullGallery + '">'
          + (ar ? 'افتح معرض الهايكنج والتخييم' : 'Explore the Hiking Gallery') + '</a>')
      + '</div></div><div class="hiking-gallery__grid">' + cards + '</div>'
      + '</div></section>';
  };
})();
