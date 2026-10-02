/* LocalShare download page.
 *
 * One click has to give the visitor the build that runs on the machine they
 * are reading this on, so the page detects the platform and points the
 * single action straight at that asset. Everything is inline: no API calls,
 * so the page cannot show a spinner or a stale release number.
 */
(() => {
  'use strict';

  const REPO = 'https://github.com/BinAref/LocalShare-Releases';
  const DL = `${REPO}/releases/latest/download`;
  const VERSION = '1.5.1';

  /* Assets carry no version in their names, so `releases/latest/download`
     keeps working after every future release. */
  const BUILDS = {
    android:     { file: 'LocalShare.apk',                mb: '82 MB' },
    androidArm64:{ file: 'LocalShare-arm64-v8a.apk',       mb: '31 MB' },
    androidArm:  { file: 'LocalShare-armeabi-v7a.apk',     mb: '27 MB' },
    androidX64:  { file: 'LocalShare-x86_64.apk',          mb: '33 MB' },
    windows:     { file: 'LocalShare-windows-x64-setup.exe', mb: '12 MB' },
    macos:       { file: 'LocalShare-macos.zip',           mb: '23 MB' },
    linux:       { file: 'LocalShare-linux-x64.deb',       mb: '15 MB' },
    windowsZip:  { file: 'LocalShare-windows-x64.zip',     mb: '14 MB' },
    linuxTar:    { file: 'LocalShare-linux-x64.tar.gz',    mb: '18 MB' },
  };

  const T = {
    en: {
      dir: 'ltr', name: 'English', label: 'EN',
      language: 'Language',
      theme: 'Theme',
      themeSystem: 'Match system',
      themeLight: 'Light',
      themeDark: 'Dark',
      heroTitle: 'Files to the device next to you.',
      heroSay: 'LocalShare sends them over the Wi-Fi you are already on. Nothing is uploaded, so nothing waits on your connection and nothing is kept on anyone else’s computer.',
      getFor: 'Download for {os}',
      getSub: '{size}, version {v}',
      getUnknown: 'See all downloads',
      getUnknownSub: 'We could not tell which device you are on',
      getNoBuild: 'No ready-made {os} build in {v} yet: it compiles from source',
      alts: 'Also for {list}',
      afterAndroid: 'Android will warn that this file did not come from the Play Store, because it did not. Allow it for your browser when asked.',
      afterMacos: 'Unzip it and drag LocalShare to Applications. The first time, open it from the right-click menu so macOS lets an unsigned app run.',
      afterLinux: 'Open it with your software installer, or run sudo apt install ./LocalShare-linux-x64.deb. On Fedora or Arch, take the tar.gz below instead.',
      afterWindows: 'Run it and follow the three steps. Windows will warn that the publisher is unknown, because this installer is not signed; choose More info, then Run anyway. On first launch, allow it through the firewall on private networks.',
      qrSay: 'Point a phone camera here to download it on Android.',
      screensTitle: 'What it looks like',
      shotShare: 'Pick what to share, and who sees it.',
      shotReceive: 'Take only what was shared with you.',
      shotDownloads: 'Everything you received, in one place.',
      sheetTitle: 'How it behaves',
      rows: [
        ['Where your files go', 'Straight from one device to the other'],
        ['What the other device can see', 'Only the items you picked, nothing else on your device'],
        ['Largest file', 'No limit. Transfers stream, so storage is the only ceiling'],
        ['If the Wi-Fi drops', 'Picks up at the byte it stopped at'],
        ['How you know a file arrived whole', 'Every file is checked against a SHA-256 hash first'],
        ['Folders', 'Arrive as folders, with the structure you sent'],
        ['If the other side has no app', 'They scan the same code and use a page your device serves'],
        ['Account', 'None'],
        ['Internet', 'Once, to download this'],
      ],
      buildsTitle: 'Every build',
      builds: {
        android: ['Android', 'Runs on any phone or tablet'],
        androidArm64: ['Android, smaller', 'For phones made since about 2017'],
        windows: ['Windows 10 and 11', 'Installer, with a shortcut and an uninstaller'],
        macos: ['macOS', 'Apple silicon and Intel'],
        linux: ['Linux', 'Debian, Ubuntu and Mint. x86_64, needs GTK 3'],
        ios: ['iPhone and iPad', 'Can receive; hosting needs the screen on'],
        windowsZip: ['Windows, portable', 'A folder you can run from anywhere'],
        linuxTar: ['Linux, portable', 'For Fedora, Arch and anything else'],
      },
      buildsFine: 'Checksums for every file here are in SHA256SUMS.txt on the release page. iPhone and iPad are not on the App Store yet.',
      claimsTitle: 'What it does not do',
      claims: [
        'No account, no sign-in, no email address.',
        'No cloud storage and no relay server in the middle.',
        'No index of your device: it only knows the items you added.',
        'No analytics, no tracking, no advertising.',
        'Each session uses a new key that stops working when you stop sharing.',
      ],
      claimsFine: 'All of it is in the open repository, so none of it has to be taken on trust.',
      footLicence: 'MIT licensed.',
    },

    ar: {
      dir: 'rtl', name: 'العربية', label: 'عربي',
      language: 'اللغة',
      theme: 'المظهر',
      themeSystem: 'حسب النظام',
      themeLight: 'فاتح',
      themeDark: 'داكن',
      heroTitle: 'ملفاتك إلى الجهاز الذي بجانبك.',
      heroSay: 'يرسلها LocalShare عبر شبكة Wi‑Fi التي أنت متصل بها أصلًا. لا شيء يُرفَع، فلا شيء ينتظر سرعة اتصالك، ولا شيء يبقى على حاسوب أحد آخر.',
      getFor: 'نزّله لنظام {os}',
      getSub: '{size}، الإصدار {v}',
      getUnknown: 'اعرض كل النسخ',
      getUnknownSub: 'لم نتعرّف على نظام جهازك',
      getNoBuild: 'لا توجد نسخة جاهزة لـ {os} في {v} بعد، تُبنى من المصدر',
      alts: 'ومتوفر أيضًا لـ {list}',
      afterAndroid: 'سينبّهك أندرويد أن الملف لم يأتِ من متجر Play، وهذا صحيح. اسمح لمتصفحك بتثبيته عند السؤال.',
      afterMacos: 'فُكّ الضغط واسحب LocalShare إلى مجلد التطبيقات. في أول مرة افتحه من قائمة الزر الأيمن ليسمح macOS بتشغيل تطبيق غير موقّع.',
      afterLinux: 'افتحه ببرنامج تثبيت الحزم، أو نفّذ sudo apt install ./LocalShare-linux-x64.deb. وعلى فيدورا أو آرتش خذ ملف tar.gz من الأسفل بدلًا منه.',
      afterWindows: 'شغّله واتبع الخطوات الثلاث. سينبّهك ويندوز أن الناشر غير معروف لأن هذا المثبِّت غير موقَّع؛ اختر «مزيد من المعلومات» ثم «تشغيل على أي حال». وفي أول تشغيل اسمح له عبر جدار الحماية على الشبكات الخاصة.',
      qrSay: 'وجّه كاميرا الهاتف هنا لتنزيله على أندرويد.',
      screensTitle: 'كيف يبدو',
      shotShare: 'اختر ما تشاركه ومن يراه.',
      shotReceive: 'خذ فقط ما شُورك معك.',
      shotDownloads: 'كل ما استلمته في مكان واحد.',
      sheetTitle: 'كيف يعمل',
      rows: [
        ['إلى أين تذهب ملفاتك', 'من الجهاز إلى الجهاز مباشرة'],
        ['ما يراه الجهاز الآخر', 'ما اخترته فقط، ولا شيء آخر على جهازك'],
        ['أكبر حجم ملف', 'بلا حد. النقل بالبثّ، فالمساحة وحدها هي السقف'],
        ['إذا انقطع الـ Wi‑Fi', 'يكمل من البايت الذي توقف عنده'],
        ['كيف تعرف أن الملف وصل سليمًا', 'يُطابَق كل ملف مع بصمة SHA-256 قبل اعتماده'],
        ['المجلدات', 'تصل مجلدات، بالبنية التي أرسلتها'],
        ['إذا لم يكن لدى الطرف الآخر التطبيق', 'يمسح الرمز نفسه ويستعمل صفحة يقدّمها جهازك'],
        ['الحساب', 'لا يوجد'],
        ['الإنترنت', 'مرة واحدة، لتنزيل هذا'],
      ],
      buildsTitle: 'جميع النسخ',
      builds: {
        android: ['أندرويد', 'يعمل على أي هاتف أو جهاز لوحي'],
        androidArm64: ['أندرويد، أصغر حجمًا', 'للهواتف المصنوعة بعد 2017 تقريبًا'],
        windows: ['ويندوز 10 و11', 'مثبِّت، مع اختصار وأداة إزالة'],
        macos: ['macOS', 'لمعالجات Apple و Intel'],
        linux: ['لينكس', 'دبيان وأوبنتو ومِنت. x86_64، يحتاج GTK 3'],
        ios: ['آيفون وآيباد', 'يستقبل؛ والمشاركة تحتاج الشاشة مفتوحة'],
        windowsZip: ['ويندوز، محمولة', 'مجلد تشغّله من أي مكان'],
        linuxTar: ['لينكس، محمولة', 'لفيدورا وآرتش وغيرهما'],
      },
      buildsFine: 'بصمات كل ملف هنا موجودة في SHA256SUMS.txt على صفحة الإصدار. ولا يتوفر التطبيق بعد على App Store للآيفون والآيباد.',
      claimsTitle: 'ما لا يفعله',
      claims: [
        'لا حساب ولا تسجيل دخول ولا بريد إلكتروني.',
        'لا تخزين سحابي ولا خادم وسيط في المنتصف.',
        'لا فهرسة لجهازك، لا يعرف سوى ما أضفته.',
        'لا تحليلات ولا تتبّع ولا إعلانات.',
        'كل جلسة تستخدم مفتاحًا جديدًا يتوقف عن العمل حين توقف المشاركة.',
      ],
      claimsFine: 'كل ذلك موجود في المستودع المفتوح، فلا حاجة لتصديق شيء منه على عواهنه.',
      footLicence: 'رخصة MIT.',
    },

    tr: {
      dir: 'ltr', name: 'Türkçe', label: 'TR',
      language: 'Dil',
      theme: 'Tema',
      themeSystem: 'Sistemle aynı',
      themeLight: 'Açık',
      themeDark: 'Koyu',
      heroTitle: 'Dosyalar yanındaki cihaza.',
      heroSay: 'LocalShare onları hâlihazırda bağlı olduğunuz Wi‑Fi üzerinden gönderir. Hiçbir şey yüklenmez; bu yüzden hiçbir şey bağlantınızı beklemez ve hiçbir şey başkasının bilgisayarında kalmaz.',
      getFor: '{os} için indir',
      getSub: '{size}, sürüm {v}',
      getUnknown: 'Tüm indirmeleri gör',
      getUnknownSub: 'Hangi cihazda olduğunuzu anlayamadık',
      getNoBuild: '{v} sürümünde hazır {os} derlemesi yok: kaynaktan derlenir',
      alts: 'Ayrıca {list} için',
      afterAndroid: 'Android bu dosyanın Play Store’dan gelmediği konusunda uyaracak, çünkü gelmiyor. Sorulduğunda tarayıcınıza izin verin.',
      afterMacos: 'Arşivi açıp LocalShare’i Applications klasörüne sürükleyin. İlk seferde sağ tık menüsünden açın ki macOS imzasız uygulamayı çalıştırsın.',
      afterLinux: 'Yazılım yükleyicinizle açın veya sudo apt install ./LocalShare-linux-x64.deb komutunu çalıştırın. Fedora veya Arch kullanıyorsanız aşağıdaki tar.gz dosyasını alın.',
      afterWindows: 'Çalıştırın ve üç adımı izleyin. Bu kurulum imzalı olmadığı için Windows yayıncının bilinmediğini söyleyecek; Ek bilgi, sonra Yine de çalıştır deyin. İlk açılışta özel ağlarda güvenlik duvarından geçmesine izin verin.',
      qrSay: 'Android’e indirmek için telefon kameranızı buraya tutun.',
      screensTitle: 'Nasıl görünüyor',
      shotShare: 'Neyi paylaşacağınızı ve kimin göreceğini seçin.',
      shotReceive: 'Yalnızca sizinle paylaşılanı alın.',
      shotDownloads: 'Aldığınız her şey tek bir yerde.',
      sheetTitle: 'Nasıl davranır',
      rows: [
        ['Dosyalarınız nereye gider', 'Doğrudan bir cihazdan diğerine'],
        ['Karşı cihaz ne görebilir', 'Yalnızca seçtikleriniz, cihazınızdaki başka hiçbir şey'],
        ['En büyük dosya', 'Sınır yok. Aktarım akış hâlinde; tek sınır depolama'],
        ['Wi‑Fi kesilirse', 'Durduğu bayttan devam eder'],
        ['Dosyanın eksiksiz geldiğini nasıl bilirsiniz', 'Her dosya önce SHA-256 özetiyle doğrulanır'],
        ['Klasörler', 'Gönderdiğiniz yapıyla, klasör olarak ulaşır'],
        ['Karşı tarafta uygulama yoksa', 'Aynı kodu tarar ve cihazınızın sunduğu sayfayı kullanır'],
        ['Hesap', 'Yok'],
        ['İnternet', 'Bir kez, bunu indirmek için'],
      ],
      buildsTitle: 'Tüm sürümler',
      builds: {
        android: ['Android', 'Her telefon ve tablette çalışır'],
        androidArm64: ['Android, daha küçük', 'Yaklaşık 2017 sonrası telefonlar için'],
        windows: ['Windows 10 ve 11', 'Kurulum, kısayol ve kaldırıcı ile'],
        macos: ['macOS', 'Apple silicon ve Intel'],
        linux: ['Linux', 'Debian, Ubuntu ve Mint. x86_64, GTK 3 gerekir'],
        ios: ['iPhone ve iPad', 'Alabilir; paylaşmak için ekranın açık olması gerekir'],
        windowsZip: ['Windows, taşınabilir', 'Her yerden çalıştırabileceğiniz bir klasör'],
        linuxTar: ['Linux, taşınabilir', 'Fedora, Arch ve diğerleri için'],
      },
      buildsFine: 'Buradaki her dosyanın özeti sürüm sayfasındaki SHA256SUMS.txt içinde. iPhone ve iPad için App Store sürümü henüz yok.',
      claimsTitle: 'Yapmadıkları',
      claims: [
        'Hesap yok, giriş yok, e-posta yok.',
        'Bulut depolama ve arada aktarma sunucusu yok.',
        'Cihazınızın dizini çıkarılmaz: yalnızca eklediklerinizi bilir.',
        'Analitik yok, takip yok, reklam yok.',
        'Her oturum, paylaşımı bıraktığınızda geçersizleşen yeni bir anahtar kullanır.',
      ],
      claimsFine: 'Hepsi açık depoda; dolayısıyla hiçbirini olduğu gibi kabul etmeniz gerekmiyor.',
      footLicence: 'MIT lisanslı.',
    },

    ur: {
      dir: 'rtl', name: 'اردو', label: 'اردو',
      language: 'زبان',
      theme: 'تھیم',
      themeSystem: 'سسٹم کے مطابق',
      themeLight: 'ہلکا',
      themeDark: 'گہرا',
      heroTitle: 'فائلیں آپ کے ساتھ والی ڈیوائس تک۔',
      heroSay: 'LocalShare انہیں اُسی Wi‑Fi پر بھیجتا ہے جس سے آپ پہلے ہی جڑے ہیں۔ کچھ اپ لوڈ نہیں ہوتا، اس لیے کچھ آپ کے کنکشن کا انتظار نہیں کرتا اور کچھ کسی اور کے کمپیوٹر پر نہیں رہتا۔',
      getFor: '{os} کے لیے ڈاؤن لوڈ کریں',
      getSub: '{size}، ورژن {v}',
      getUnknown: 'تمام ڈاؤن لوڈز دیکھیں',
      getUnknownSub: 'ہم آپ کی ڈیوائس پہچان نہیں سکے',
      getNoBuild: '{v} میں {os} کا تیار ورژن نہیں، سورس سے بنتا ہے',
      alts: 'نیز {list} کے لیے',
      afterAndroid: 'اینڈرائیڈ خبردار کرے گا کہ یہ فائل Play Store سے نہیں آئی، اور واقعی نہیں آئی۔ پوچھے جانے پر اپنے براؤزر کو اجازت دیں۔',
      afterMacos: 'ان زپ کریں اور LocalShare کو Applications میں ڈالیں۔ پہلی بار رائٹ کلک مینو سے کھولیں تاکہ macOS غیر دستخط شدہ ایپ چلنے دے۔',
      afterLinux: 'اپنے سافٹ ویئر انسٹالر سے کھولیں، یا sudo apt install ./LocalShare-linux-x64.deb چلائیں۔ Fedora یا Arch پر نیچے والی tar.gz لیں۔',
      afterWindows: 'چلائیں اور تین مراحل پر عمل کریں۔ یہ انسٹالر دستخط شدہ نہیں، اس لیے Windows کہے گا کہ پبلشر نامعلوم ہے؛ More info پھر Run anyway چنیں۔ پہلی بار نجی نیٹ ورکس پر فائر وال سے گزرنے کی اجازت دیں۔',
      qrSay: 'اینڈرائیڈ پر ڈاؤن لوڈ کرنے کے لیے فون کا کیمرہ یہاں کریں۔',
      screensTitle: 'یہ کیسا دکھتا ہے',
      shotShare: 'چنیں کیا شیئر کرنا ہے اور کون دیکھے۔',
      shotReceive: 'صرف وہی لیں جو آپ کے ساتھ شیئر کیا گیا۔',
      shotDownloads: 'جو کچھ موصول ہوا، ایک ہی جگہ۔',
      sheetTitle: 'یہ کیسے کام کرتا ہے',
      rows: [
        ['آپ کی فائلیں کہاں جاتی ہیں', 'ایک ڈیوائس سے دوسری تک براہِ راست'],
        ['دوسری ڈیوائس کیا دیکھ سکتی ہے', 'صرف وہی جو آپ نے چنا، آپ کی ڈیوائس کی کوئی اور چیز نہیں'],
        ['سب سے بڑی فائل', 'کوئی حد نہیں۔ منتقلی اسٹریم ہوتی ہے، صرف اسٹوریج حد ہے'],
        ['اگر Wi‑Fi ٹوٹ جائے', 'جہاں رُکا تھا اُسی بائٹ سے جاری رہتا ہے'],
        ['فائل پوری پہنچی، یہ کیسے پتہ چلے', 'ہر فائل پہلے SHA-256 ہیش سے جانچی جاتی ہے'],
        ['فولڈرز', 'اُسی ساخت کے ساتھ فولڈر بن کر پہنچتے ہیں'],
        ['اگر دوسری طرف ایپ نہ ہو', 'وہ یہی کوڈ اسکین کرکے آپ کی ڈیوائس کا صفحہ استعمال کرتے ہیں'],
        ['اکاؤنٹ', 'کوئی نہیں'],
        ['انٹرنیٹ', 'ایک بار، اسے ڈاؤن لوڈ کرنے کے لیے'],
      ],
      buildsTitle: 'تمام ورژن',
      builds: {
        android: ['اینڈرائیڈ', 'کسی بھی فون یا ٹیبلٹ پر چلتا ہے'],
        androidArm64: ['اینڈرائیڈ، چھوٹا', 'تقریباً 2017 کے بعد کے فونز کے لیے'],
        windows: ['ونڈوز 10 اور 11', 'انسٹالر، شارٹ کٹ اور ان انسٹالر کے ساتھ'],
        macos: ['macOS', 'Apple سلیکون اور Intel'],
        linux: ['لینکس', 'Debian، Ubuntu اور Mint۔ x86_64، GTK 3 درکار'],
        ios: ['آئی فون اور آئی پیڈ', 'وصول کر سکتا ہے؛ شیئرنگ کے لیے اسکرین آن ہونی چاہیے'],
        windowsZip: ['Windows، پورٹیبل', 'ایک فولڈر جو کہیں سے بھی چل جائے'],
        linuxTar: ['Linux، پورٹیبل', 'Fedora، Arch اور باقی سب کے لیے'],
      },
      buildsFine: 'یہاں ہر فائل کا ہیش ریلیز صفحے پر SHA256SUMS.txt میں ہے۔ آئی فون اور آئی پیڈ کے لیے ابھی App Store پر دستیاب نہیں۔',
      claimsTitle: 'یہ کیا نہیں کرتا',
      claims: [
        'کوئی اکاؤنٹ، کوئی سائن اِن، کوئی ای میل نہیں۔',
        'کوئی کلاؤڈ اسٹوریج اور درمیان میں کوئی ریلے سرور نہیں۔',
        'آپ کی ڈیوائس کی فہرست سازی نہیں، صرف وہی جانتا ہے جو آپ نے شامل کیا۔',
        'کوئی اینالیٹکس، کوئی ٹریکنگ، کوئی اشتہار نہیں۔',
        'ہر سیشن نئی کلید استعمال کرتا ہے جو شیئرنگ روکنے پر بے کار ہو جاتی ہے۔',
      ],
      claimsFine: 'یہ سب کھلے مستودع میں موجود ہے، اس لیے کسی بات کو بھروسے پر ماننے کی ضرورت نہیں۔',
      footLicence: 'MIT لائسنس۔',
    },

    my: {
      dir: 'ltr', name: 'မြန်မာ', label: 'MY',
      language: 'ဘာသာစကား',
      theme: 'အပြင်အဆင်',
      themeSystem: 'စနစ်အတိုင်း',
      themeLight: 'အလင်း',
      themeDark: 'အမှောင်',
      heroTitle: 'ဖိုင်များကို ဘေးနားက စက်ဆီသို့။',
      heroSay: 'LocalShare သည် သင် ချိတ်ဆက်ထားပြီးသား Wi‑Fi ပေါ်မှ တိုက်ရိုက် ပို့ပေးသည်။ ဘာမှ အပ်လုဒ် မတင်ရသဖြင့် သင့်အင်တာနက်ကို မစောင့်ရဘဲ အခြားသူ၏ ကွန်ပျူတာပေါ်တွင်လည်း မကျန်ရစ်ပါ။',
      getFor: '{os} အတွက် ဒေါင်းလုဒ်',
      getSub: '{size}၊ ဗားရှင်း {v}',
      getUnknown: 'ဒေါင်းလုဒ် အားလုံး ကြည့်ရန်',
      getUnknownSub: 'သင့်စက်အမျိုးအစားကို မခွဲခြားနိုင်ပါ',
      getNoBuild: '{v} တွင် {os} အတွက် အဆင်သင့် ဗားရှင်း မရှိသေးပါ: ရင်းမြစ်မှ တည်ဆောက်ရမည်',
      alts: '{list} အတွက်လည်း ရနိုင်သည်',
      afterAndroid: 'ဤဖိုင်သည် Play Store မှ မဟုတ်ကြောင်း Android က သတိပေးပါမည်၊ အမှန်ပင် မဟုတ်ပါ။ မေးလာလျှင် သင့်ဘရောက်ဇာကို ခွင့်ပြုပါ။',
      afterWindows: 'ဖွင့်ပြီး အဆင့်သုံးဆင့် လိုက်လုပ်ပါ။ ဤတပ်ဆင်ဖိုင်ကို လက်မှတ်မထိုးထားသဖြင့် Windows က ထုတ်ဝေသူ မသိကြောင်း သတိပေးမည်။ More info ပြီးလျှင် Run anyway ကို ရွေးပါ။ ပထမအကြိမ်တွင် သီးသန့်ကွန်ရက်များအတွက် firewall ကို ခွင့်ပြုပါ။',
      afterMacos: 'ဖြေပြီး LocalShare ကို Applications ထဲ ဆွဲထည့်ပါ။ ပထမအကြိမ်တွင် macOS က လက်မှတ်မထိုးထားသော အက်ပ်ကို ခွင့်ပြုရန် ညာကလစ် မီနူးမှ ဖွင့်ပါ။',
      afterLinux: 'သင့် software installer ဖြင့် ဖွင့်ပါ၊ သို့မဟုတ် sudo apt install ./LocalShare-linux-x64.deb ကို run ပါ။ Fedora သို့မဟုတ် Arch တွင် အောက်က tar.gz ကို ယူပါ။',
      qrSay: 'Android တွင် ဒေါင်းလုဒ်ဆွဲရန် ဖုန်းကင်မရာကို ဤနေရာသို့ ချိန်ပါ။',
      screensTitle: 'ပုံပန်းသဏ္ဌာန်',
      shotShare: 'မျှဝေမည့်အရာနှင့် မြင်ရမည့်သူကို ရွေးပါ။',
      shotReceive: 'သင့်အား မျှဝေထားသည်ကိုသာ ယူပါ။',
      shotDownloads: 'လက်ခံရရှိသမျှ တစ်နေရာတည်းတွင်။',
      sheetTitle: 'မည်သို့ အလုပ်လုပ်သနည်း',
      rows: [
        ['သင့်ဖိုင်များ ဘယ်ကို သွားသနည်း', 'စက်တစ်ခုမှ နောက်တစ်ခုသို့ တိုက်ရိုက်'],
        ['တစ်ဖက်စက် ဘာမြင်နိုင်သနည်း', 'သင်ရွေးထားသည်များသာ၊ စက်ထဲက အခြားအရာ မမြင်ရပါ'],
        ['အကြီးဆုံး ဖိုင်', 'ကန့်သတ်ချက် မရှိပါ။ စီးဆင်းပို့သဖြင့် သိုလှောင်မှုသာ အကန့်အသတ်'],
        ['Wi‑Fi ပြတ်သွားလျှင်', 'ရပ်သွားသည့် နေရာအတိအကျမှ ပြန်ဆက်သည်'],
        ['ဖိုင် အပြည့်အစုံ ရောက်ကြောင်း ဘယ်လိုသိမလဲ', 'ဖိုင်တိုင်းကို SHA-256 ဖြင့် အရင် စစ်ဆေးသည်'],
        ['ဖိုင်တွဲများ', 'ပို့လိုက်သည့် ဖွဲ့စည်းပုံအတိုင်း ဖိုင်တွဲအဖြစ် ရောက်သည်'],
        ['တစ်ဖက်တွင် အက်ပ် မရှိလျှင်', 'တူညီသော ကုဒ်ကို စကင်ဖတ်ပြီး သင့်စက်က ပေးသော စာမျက်နှာကို သုံးသည်'],
        ['အကောင့်', 'မလိုပါ'],
        ['အင်တာနက်', 'ဤအရာ ဒေါင်းလုဒ်ဆွဲရန် တစ်ကြိမ်သာ'],
      ],
      buildsTitle: 'ဗားရှင်း အားလုံး',
      builds: {
        android: ['Android', 'ဖုန်း သို့မဟုတ် တက်ဘလက် မဆို'],
        androidArm64: ['Android၊ သေးငယ်', '၂၀၁၇ ခန့်နောက်ပိုင်း ဖုန်းများအတွက်'],
        windows: ['Windows 10 နှင့် 11', 'တပ်ဆင်ဖိုင်၊ shortcut နှင့် ဖယ်ရှားစနစ်ပါ'],
        macos: ['macOS', 'Apple silicon နှင့် Intel'],
        linux: ['Linux', 'Debian၊ Ubuntu နှင့် Mint။ x86_64၊ GTK 3 လိုအပ်သည်'],
        ios: ['iPhone နှင့် iPad', 'လက်ခံနိုင်သည်၊ မျှဝေရန် ဖန်သားပြင် ဖွင့်ထားရမည်'],
        windowsZip: ['Windows၊ သယ်ဆောင်ရလွယ်', 'ဘယ်နေရာမှမဆို run နိုင်သော ဖိုဒါ'],
        linuxTar: ['Linux၊ သယ်ဆောင်ရလွယ်', 'Fedora၊ Arch နှင့် အခြားအားလုံးအတွက်'],
      },
      buildsFine: 'ဤနေရာမှ ဖိုင်တိုင်း၏ စစ်ဆေးကုဒ်များကို ထုတ်ဝေမှု စာမျက်နှာရှိ SHA256SUMS.txt တွင် ရှိသည်။ iPhone နှင့် iPad အတွက် App Store တွင် မရှိသေးပါ။',
      claimsTitle: 'မလုပ်သော အရာများ',
      claims: [
        'အကောင့်၊ ဝင်ရောက်မှု၊ အီးမေးလ် မလိုပါ။',
        'ကလောက် သိုလှောင်မှုနှင့် ကြားခံ ဆာဗာ မရှိပါ။',
        'သင့်စက်ကို စာရင်းမပြုစုပါ: ထည့်ထားသည်များကိုသာ သိသည်။',
        'ခြေရာခံမှု၊ ကြော်ငြာ မရှိပါ။',
        'ချိတ်ဆက်မှုတိုင်းသည် မျှဝေမှု ရပ်လိုက်သည်နှင့် အလုပ်မလုပ်တော့သော ကီးအသစ် သုံးသည်။',
      ],
      claimsFine: 'အားလုံး ပွင့်လင်းသော ရင်းမြစ်တွင် ရှိသဖြင့် ယုံကြည်ရုံဖြင့် လက်ခံရန် မလိုပါ။',
      footLicence: 'MIT လိုင်စင်။',
    },
  };

  const CODES = Object.keys(T);
  const $ = (id) => document.getElementById(id);
  const read = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
  const write = (k, v) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } };
  const fill = (s, vars) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');

  /* ── platform ──────────────────────────────────────────────── */

  function platform() {
    const ua = navigator.userAgent || '';
    const plat = (navigator.userAgentData && navigator.userAgentData.platform)
      || navigator.platform || '';
    if (/android/i.test(ua)) return 'android';
    // iPadOS reports a Mac platform, so touch points disambiguate it.
    if (/iphone|ipad|ipod/i.test(ua) || (plat === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'ios';
    if (/win/i.test(plat)) return 'windows';
    if (/mac/i.test(plat)) return 'macos';
    if (/linux|cros/i.test(plat)) return 'linux';
    return null;
  }

  const HERE = platform();
  const OS_NAME = { android: 'Android', ios: 'iOS', windows: 'Windows', macos: 'macOS', linux: 'Linux' };

  /* ── render ────────────────────────────────────────────────── */

  let code = 'en';

  function apply(next) {
    code = T[next] ? next : 'en';
    const t = T[code];

    document.documentElement.lang = code;
    document.documentElement.dir = t.dir;

    if (code === 'ur') loadNastaliq();

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const v = t[el.dataset.i18n];
      if (typeof v === 'string') el.textContent = v;
    });

    // Real screens from the app, in Arabic when the page is; English
    // otherwise. The caption doubles as the description for screen readers.
    document.querySelectorAll('img[data-shot]').forEach((img) => {
      const shot = img.dataset.shot;
      img.src = `assets/screens/${code === 'ar' ? 'ar' : 'en'}-${shot}.webp`;
      img.alt = t[`shot${shot[0].toUpperCase()}${shot.slice(1)}`] || '';
    });

    renderLangs(t);
    renderTheme(t);
    renderAction(t);
    renderRows(t);
    renderBuilds(t);
    renderClaims(t);
  }

  /* Nastaliq is a large face; only Urdu readers pay for it. */
  let nastaliqAsked = false;
  function loadNastaliq() {
    if (nastaliqAsked) return;
    nastaliqAsked = true;
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400..700&display=swap';
    document.head.appendChild(l);
  }

  function renderLangs(t) {
    const sel = $('lang');
    sel.textContent = '';
    for (const c of CODES) {
      const o = document.createElement('option');
      o.value = c;
      o.textContent = T[c].name;
      o.lang = c;
      sel.appendChild(o);
    }
    sel.value = code;
    sel.setAttribute('aria-label', t.language);
    $('lang-label').textContent = t.language;
  }

  function renderTheme(t) {
    const sel = $('theme');
    const current = read('ls.theme') || 'system';
    sel.textContent = '';
    for (const [value, key] of [['system', 'themeSystem'], ['light', 'themeLight'], ['dark', 'themeDark']]) {
      const o = document.createElement('option');
      o.value = value;
      o.textContent = t[key];
      sel.appendChild(o);
    }
    sel.value = current;
    sel.setAttribute('aria-label', t.theme);
    $('theme-label').textContent = t.theme;
  }

  function renderAction(t) {
    const direct = BUILDS[HERE] ?? null;
    const label = $('get-label');
    const sub = $('get-sub');
    const after = $('after');
    const a = $('get');

    if (direct) {
      a.href = `${DL}/${direct.file}`;
      a.setAttribute('download', '');
      label.textContent = fill(t.getFor, { os: OS_NAME[HERE] });
      sub.textContent = fill(t.getSub, { size: direct.mb, v: VERSION });
      const note = t['after' + HERE[0].toUpperCase() + HERE.slice(1)];
      after.textContent = note ?? '';
      after.hidden = note == null;
    } else {
      // Unknown platform, or one with no published build: send them to the
      // full list rather than hand over a file that will not run.
      a.href = `${REPO}/releases/latest`;
      a.removeAttribute('download');
      label.textContent = t.getUnknown;
      sub.textContent = HERE
        ? fill(t.getNoBuild, { os: OS_NAME[HERE], v: VERSION })
        : t.getUnknownSub;
      after.hidden = true;
    }

    renderAlts(t);
  }

  /* Quiet alternates, skipping whatever the big button already offers. */
  function renderAlts(t) {
    const alts = $('alts');
    alts.textContent = '';
    const others = ['android', 'windows', 'macos', 'linux'].filter((p) => p !== HERE);
    const [before, afterText = ''] = t.alts.split('{list}');
    alts.appendChild(document.createTextNode(before));
    others.forEach((p, i) => {
      if (i) alts.appendChild(document.createTextNode(', '));
      const build = BUILDS[p] ?? null;
      const link = document.createElement('a');
      link.href = build ? `${DL}/${build.file}` : '#builds';
      if (build) link.setAttribute('download', '');
      link.textContent = OS_NAME[p];
      alts.appendChild(link);
    });
    alts.appendChild(document.createTextNode(afterText));
  }

  function renderRows(t) {
    const dl = $('rows');
    dl.textContent = '';
    for (const [k, v] of t.rows) {
      const row = document.createElement('div');
      const dt = document.createElement('dt');
      dt.textContent = k;
      const dd = document.createElement('dd');
      dd.textContent = v;
      row.append(dt, dd);
      dl.appendChild(row);
    }
  }

  function renderBuilds(t) {
    const order = [
      ['android', BUILDS.android],
      ['androidArm64', BUILDS.androidArm64],
      ['windows', BUILDS.windows],
      ['macos', BUILDS.macos],
      ['linux', BUILDS.linux],
      ['ios', null],
      // The archives come last. They exist for the cases the packages do not
      // cover — a machine where nothing may be installed, and every Linux
      // that is not Debian-derived.
      ['windowsZip', BUILDS.windowsZip],
      ['linuxTar', BUILDS.linuxTar],
    ];
    const ul = $('build-list');
    ul.textContent = '';
    for (const [key, build] of order) {
      const [name, note] = t.builds[key];
      const li = document.createElement('li');
      if (!build) li.setAttribute('data-soon', '');

      const row = document.createElement(build ? 'a' : 'div');
      row.className = 'build-row';
      if (build) {
        row.href = `${DL}/${build.file}`;
        row.setAttribute('download', '');
      }

      const os = document.createElement('span');
      os.className = 'build-os';
      const n = document.createElement('span');
      n.className = 'build-name';
      n.textContent = name;
      const s = document.createElement('span');
      s.className = 'build-note';
      s.textContent = note;
      os.append(n, s);

      const size = document.createElement('span');
      size.className = 'build-size';
      size.textContent = build ? build.mb : '';

      row.append(os, size);
      li.appendChild(row);
      ul.appendChild(li);
    }
  }

  function renderClaims(t) {
    const ul = $('claim-list');
    ul.textContent = '';
    for (const c of t.claims) {
      const li = document.createElement('li');
      li.textContent = c;
      ul.appendChild(li);
    }
  }

  /* ── theme ─────────────────────────────────────────────────── */

  function paintTheme() {
    const saved = read('ls.theme');
    if (saved === 'light' || saved === 'dark') {
      document.documentElement.dataset.theme = saved;
    } else {
      delete document.documentElement.dataset.theme;
    }
  }

  $('theme').addEventListener('change', (e) => {
    const v = e.target.value;
    // "System" is the absence of a preference, so the OS setting keeps
    // applying if it changes later.
    if (v === 'system') {
      try { localStorage.removeItem('ls.theme'); } catch { /* private mode */ }
    } else {
      write('ls.theme', v);
    }
    paintTheme();
  });

  $('lang').addEventListener('change', (e) => {
    write('ls.lang', e.target.value);
    apply(e.target.value);
  });

  /* ── start ─────────────────────────────────────────────────── */

  function preferredLang() {
    const saved = read('ls.lang');
    if (saved && T[saved]) return saved;
    for (const l of navigator.languages || [navigator.language]) {
      const c = (l || '').toLowerCase().split('-')[0];
      if (T[c]) return c;
    }
    return 'en';
  }

  paintTheme();
  apply(preferredLang());
})();
