# Anima — Gerçek Bir İhtiyacı Çözmek

**Ürün tasarım notu · Jungian Studies İstanbul · 10 Ağustos 2026**

Kaynaklar: NotebookLM defterleri — *Starter Story App Revenue Blueprints*, *Greg Isenberg Startup & Growth*, *Addictive Design & Viral UX*, *Idea Validation Workflow* — ve bu iş için yeni kurulan **“Rüya Defteri — Gerçek İhtiyaç”** defteri (86 kaynak: PubMed/PMC rüya hatırlama nörobilimi, IAAP, klinik IRT literatürü, rakip uygulama listeleri, r/LucidDreaming kullanıcı tartışmaları).

---

## 1. Dürüst tanı: şu an elimizde bir vitamin var, ağrı kesici değil

Bunu ben yaptım, o yüzden savunmaya geçmeden söyleyeyim.

Notebook'lardaki kurucular gerçek ihtiyacı üç sinyalden tanıyor:

1. **Ürün yokken para ödüyorlar.** John Rush 100 kişilik bekleme listesine %90 indirimli ön satış açıyor; **en az 5 kişi satın alırsa** kod yazmaya başlıyor.
2. **Ürün bozukken kullanıyorlar.** Sam'in MVP'si "application error" veriyor, kullanıcılar yine de kullanmaya devam ediyor. Fernando'nun ürünü berbat, ilk gün 5 kişi abone oluyor: *"Bu kadar buggy bir şeye para ödüyorlarsa burada fırsat var."*
3. **Sormadan istiyorlar.** Eşik, "iyi fikir" değil, **"Bunu istiyorum"**. İnsanlar kibar olmak için yalan söyler.

Anima'nın şu an hiçbirinde sinyali yok. Çünkü **QR'la gelen isimsiz bir ziyaretçinin acil bir problemi yok.** Rüya günlüğü tutmak isteğe bağlı, ertelenebilir ve dış sorumluluğu sıfır bir davranış.

Dahası, rüya günlüğü **günün en zor alışkanlık slotunda** duruyor: uyandıktan sonraki ilk on dakika, karanlıkta, yarı uykulu, kimse beklemiyorken. Bu yüzden rüya günlüğü uygulamalarının bırakılma oranı yapısal olarak yüksektir. Güzel bir arayüz bunu çözmez.

**Sonuç: ürünü değil, çerçeveyi değiştirmemiz gerekiyor.**

---

## 2. Asıl acı: rüya ile seans arasındaki boşluk

Greg Isenberg defterindeki test net: **acıyı zaman veya para cinsinden nicelleştir.** Nicelleştirdiğimizde ortaya çıkan şey rüya kaydı değil, şu:

> Bir danışan 50 dakikalık seansa gelir ve *"Bir rüya gördüm ama hatırlamıyorum"* der. O seansın parası yanmıştır.

Ölçülebilir. Seans ücreti belli, kaç seansın böyle başladığı sorulabilir. **Bu bir ağrı kesici.**

Aynı defter şunu da ekliyor: psikoloji, sağlık, hukuk gibi alanlarda yanlış kararın faturası ağır olduğu için kullanıcılar "herhangi bir" genel çözüme gitmez, derinlemesine araştırır ve güvene para öder. Bu bizim lehimize.

### Kim gerçekten acı çekiyor — üç aday, sıralı

| # | Kitle | Acı | Tür |
|---|---|---|---|
| **1** | **Eğitim programı öğrencisi** (JSİ analitik psikoloji eğitimi) | Kendi analizine ve süpervizyona **rüya materyali getirmek zorunda**. Ödev, hobi değil. Takvimi ve süpervizörü var. | 🔴 Ağrı kesici |
| **2** | **Analizdeki danışan** | Seans başına ücret ödüyor, elinde materyal olmadan gidince parası yanıyor. | 🔴 Ağrı kesici |
| 3 | Meraklı genel kullanıcı | "Rüyalarım ilginç." Ertelenebilir. | 🟡 Vitamin |

**Şu anki uygulama 3 numaraya hizmet ediyor.** Oysa 1 ve 2 numara zaten JSİ'nin içinde — ve onlara ulaşmanın maliyeti sıfır.

---

## 3. Dağıtım: kurumun tabanı en değerli varlık

Notebook'taki kural: *"İlk kez kuranlar ürüne, ikinci kez kuranlar dağıtıma odaklanır."* JSİ'nin hazır tabanını kullanmak dört şey veriyor:

- **Sıfır CAC.** Mobil uygulamaların en büyük ölüm nedeni pazarlama bütçesi. Burada reklam yok.
- **Hazır güven duvarı.** Rüya, bir insanın verebileceği en mahrem veri. Soğuk reklamla bu güven kurulmaz; köklü bir kurumun referansıyla anında kurulur.
- **Hoşgörülü ilk kullanıcılar.** MVP buggy olacak. Sıcak topluluk buna yapıcı yaklaşır.
- **Yüksek LTV.** Niş ve sadık kitle → yıllık abonelikte yüksek yaşam boyu değer.

---

## 4. Ürün ne olmalı: "günlük" değil, **seans hazırlığı**

Tek cümlelik yeniden konumlandırma:

> **Anima, rüyalarını kaydettiğin yer değil; analiz seansına elin dolu gittiğin yer.**

### 4.1 Yeni birinci sınıf nesne: **Seans**

Rüyalar tek tek birikmez, **iki seans arasına** birikir. Uygulama seans tarihini bilir ve şunu üretir:

- **Seans sayfası** — son seanstan bu yana görülen rüyalar, tekrar eden imgeler, baskın arketip, dikkat çeken sapma. Tek ekran, seansa girerken 2 dakikada okunur.
- **Geri dönüş** — geçen seansta konuşulan tema bu dönem tekrar geldi mi?

Bu, zaten yazdığım `constellation.js` ve okuma motorunun **doğru çerçeveye** taşınmasıdır. Kod var; bağlamı yanlıştı.

### 4.2 En kritik tasarım hatası: 4'te klavye yoktur

Şu anki 5 adımlı yakalama akışı güzel — ve **kullanım anı için yanlış**. Sabah 4'te, karanlıkta, yarı uykulu biri yazmaz.

**Adım 1 sesli kayıt olmalı.** Tek tuş, göz kapalı, konuş ve bırak. Yazıya çevirme sonra. Etiketleme, arketip, amplifikasyon — hepsi *sonradan*, kahvenin başında.

**Bu tahmin değil.** r/LucidDreaming'de kullanıcıların rakip uygulamalara attığı başlıklardan biri doğrudan şu:

> *“Rüya günlüğü uygulamaları, bir kayda başlamak için bizi 10 ekran gezdirmeyi bırakın…”*

Lucidity'nin ilk ekranda kayıt zorunluluğu için:

> *“Uygulamanın adından başka hiçbir şey görmeden kayıt olma zorunluluğu beni anında korkuttu — doğrudan silme sebebi.”*

Araştırma raporunun sonucu net: kullanıcılar uyanma anında **görsel şok yaşatmayan** (koyu ekran), **ilk ekranda kayıt dayatmayan**, ve uyku sersemliğini (*sleep inertia*) hesaba katıp **tek tıkla ses kaydı** başlatan bir akış arıyor. Bu sağlanmadığında günlük tutmayı angarya görüp uygulamayı siliyorlar.

**Anima bunların üçünden ikisini zaten kazanıyor:** kayıt yok, koyu tema varsayılan. Eksik olan tek şey sesli kayıt — ve o, listenin en önemli maddesi.

### 4.3 Kendi tasarımımı çürüten bulgu: veri kaybı

Bu kategorideki **en sık ve en öfkeli şikâyet gizlilik değil, veri kaybı.**

> *“Neden sürekli uygulamayı ‘güncelliyorsunuz’, eskisini mağazadan siliyorsunuz? Bildirim görmediğim için tüm verilerimi kaybetmiştim. Şimdi yine aynısı oldu…”*

> *“Uygulama Google Play’den kaldırılmış, artık indiremiyorsunuz.”*

Rüya kaydı zamanla değer kazanan bir varlık — beş yıllık bir defter paha biçilmezdir. Ve **Anima'nın “yalnızca bu cihazda” kararı bu riski azaltmıyor, artırıyor:** tarayıcı verisi temizlenirse defter yok olur.

Gizlilik duruşunu bırakmıyoruz, ama bedelini ödemeyi bırakıyoruz:

- **Yedek hatırlatması ürünün içine gömülür.** 10 kayıttan sonra ve sonra ayda bir, kapatılamayan (ama ertelenebilen) bir hatırlatma.
- **Dosya sistemine otomatik yedek** (File System Access API destekliyorsa) — kullanıcının seçtiği klasöre sessizce yazar.
- **Şifreli isteğe bağlı bulut yedeği** — varsayılan kapalı, anahtar cihazda. Kurum lisansında açık.
- **Veri taşınabilirliği vaadi yazılı olur:** JSON dışa aktarma her zaman çalışır, format belgelenir.

Bu, ürünün en az seksi ama en yüksek getirili işi.

### 4.4 Paylaşım — rıza ile, otomatik değil

Analiste/süpervizöre **seans paketi** gönderme. Ama:

- Kullanıcı neyin gideceğini tek tek seçer.
- Otomatik senkron **yok**. Rüya verisi sunucuya sürekli akmaz.
- Gönderim tek seferlik ve süreli bir bağlantıdır.

Bu alanda gizlilik bir özellik değil, **giriş bileti**. Şu anki "veriler sadece bu cihazda" konumu korunmalı; paylaşım bunun istisnası olarak, açık rıza ile tasarlanmalı.

### 4.5 Öğrenci modu

Eğitim müfredatına göre etiketleme (gölge çalışması, anima/animus, bireyleşme...), süpervizyona götürülecek rüyaların işaretlenmesi, dönem sonu derleme.

---

## 4.6 İkinci bir kapı: kâbus bozukluğu (IRT) — güçlü ama sorumluluğu ağır

Araştırmanın en sağlam klinik bulgusu bu: **Imagery Rehearsal Therapy**, Amerikan Uyku Tıbbı Akademisi tarafından kâbus bozukluğu için **Level A kanıt, birinci basamak** davranışsal tedavi olarak öneriliyor. 30 yılı aşkın deneysel kanıt; kâbus sıklığını ve klinik sıkıntıyı yarı yarıya düşürüyor.

Protokol dijitalleşmeye birebir uygun: kâbusu yaz → güvenli bir sonla yeniden yaz → gündüz zihinde prova et. Bir uygulamanın yapabileceği tam olarak budur.

**Ağrı kesici gücü rüya günlüğünden kat kat yüksek.** Kâbus gören insan çözüm arar, ertelemez.

**Ama:** bu bir tıbbi müdahaledir. JSİ bir eğitim merkezi, klinik değil. Bu kapıdan girmek klinik süpervizyon, sorumluluk sınırı ve muhtemelen bir uzman ortaklığı gerektirir. **Öneri: şimdi değil.** Faz 2'de, JSİ'nin klinisyen ağıyla ve ayrı bir ürün olarak değerlendirilmeli. Bu belgeye kaydediliyor ki unutulmasın.

---

## 5. İnşa etmeden önce: 2 haftalık doğrulama

Notebook'lardaki eşikleri aynen alıyorum. **Kod yazmadan.**

| Adım | Ne | Eşik |
|---|---|---|
| **1. Mülakat** | JSİ öğrencileri ve danışanlarıyla derinlemesine görüşme | **20 kişi.** Aranan tepki: *"Bunu istiyorum"* — "iyi fikir" sayılmaz |
| **2. Ön satış** | Yıllık plan, %90 indirim, ürün henüz yok | **≥5 satın alma** (John Rush eşiği) |
| **3. Concierge MVP** | Seans sayfasını **elle** hazırla. 10 kişi, 4 hafta. Kodu değil, süreci iterate et | 4 hafta sonunda kaç kişi devam etmek istiyor? |

3. adım en önemlisi. Jordan (Parakeet Chat) ortada uygulama yokken mahkumlara e-posta üzerinden hizmet verdi, ilk ayda 200 ödeyen kullanıcıya ulaştı, bugüne 1,5 milyon dolar. **Önce elle teslim et.**

**Eğer 20 mülakattan net bir "bunu istiyorum" çıkmazsa ve 5 ön satış olmazsa: bu ürün yapılmamalı.** Bu belgenin en değerli cümlesi bu.

---

## 6. İş modeli

- **B2B2C, kurum lisansı.** JSİ eğitim programı öğrencileri için yıllık koltuk lisansı. Öğrenci ödemez, kurum eğitim paketine dahil eder. Sıfır CAC, yüksek LTV.
- **Danışan katmanı.** Analistler kendi danışanlarına önerir; bireysel yıllık abonelik.
- **Ücretsiz katman = QR.** Şu anki hali kalır: halka açık, hesapsız, cihazda. Bu bir pazarlama kanalı ve kurumun kamu hizmeti yüzü.

---

## 7. Yapılanlardan ne kalıyor, ne erteleniyor

**Kalır — gerçek farklılaştırıcı:**
- 12 arketip + 36 sembol sözlüğü. Rakiplerde yok, kurumun uzmanlığını taşıyor.
- Yerel-öncelikli depolama + **kayıt duvarı olmaması**. Rakiplerin en çok silinme sebebi bu ikisi; biz doğrusunu yapıyoruz.
- Rehber (yöntem + klinik sınır). Güven kurar.
- Desen/okuma motoru — **seans çerçevesine taşınarak**.

**Dürüst olmak gerekirse ertelenir:**
- **Dünya haritası / 3D küre.** Güzel, ve tanıtımda işe yarar — ama *elde tutma* getirmez. Bu bir **pazarlama varlığı**, ürün değeri değil. Fuarda, tanıtımda, basında kullanılır; kullanıcıyı geri getiren şey o değildir.
- Kolektif norm karşılaştırması — ilgi çekici, ama seans hazırlığından sonra gelir.

---

## 8. Etik sınır

Addictive Design defteri sınırı net çiziyor: alışkanlık mekanikleri kullanıcının hayatını **zenginleştiriyorsa** etiktir; onu **israf edici bağımlılığa** sürüklüyorsa değildir.

Bu üründe kırmızı çizgiler:

- **Seri/streak baskısı yok.** Rüya hatırlamamak bir başarısızlık değildir; öyle hissettirmek zarar verir.
- **Yorum dayatmaz.** Uygulama gözlem yapar, yargı vermez — mevcut "her madde soruyla biter" kuralı korunur.
- **Klinik sınır yazılı kalır.** Tekrarlayan kâbus ve travmatik içerik için uzmana yönlendirme.
- **Bildirim yalnızca kullanıcının seçtiği saatte,** ve tek amacı sabah yakalama anıdır.

---

## 9. Sıradaki tek adım

Kod yazmayı bırak. **JSİ ile 20 mülakat ayarla.** Sorulacak tek şey:

> "Son analiz seansına giderken rüyanı hatırlıyor muydun? Hatırlamadığında ne oldu?"

Cevaplar bu belgedeki her şeyi ya doğrular ya çöpe atar.
