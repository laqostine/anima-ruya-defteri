# Yeni oturum için prompt — "Ödeme potansiyeli yüksek fikir bul ve değerlendir"

Aşağıdaki bloğu yeni bir Claude Code oturumuna olduğu gibi yapıştır.

> **Önce:** `export APIFY_TOKEN='...'` ile token'ı ortama koy. Prompt'a ham token yazma.
> Bu oturumda kullanılan token sohbete açık yazıldığı için **iptal edilip yenilenmeli**.

---

```
# GÖREV

İnsanların gerçekten para ödeyeceği, inşa edilebilir bir yazılım ürünü fikri bul ve
acımasızca değerlendir. Çıktı: kanıta dayalı, sıralanmış kısa liste + tek bir öneri.

Bana hoşuma gidecek şeyi değil, doğru olanı söyle. Fikri öldüren kanıt, fikri
destekleyen kanıt kadar değerlidir — bulduğunda açıkça yaz.

# BEN KİMİM (kısıtlar)

- Tek kişilik geliştiriciyim. Web + React Native (Expo) yapabiliyorum, tasarım güçlü.
- Türkiye'deyim, Eylül ortasında Milano'ya taşınıyorum. TR ve AB pazarına erişimim var.
- Halihazırda: Mentoras (YKS EdTech), Akilion (AI ajans), Placenta (wellness/Jung ürünleri) ile ilişkim var.
- Nakde acil ihtiyacım yok; ölçüt "para kazandırır mı" değil, "gerçek mi ve ben yapabilir miyim".
- Ekip kiralamam yok. 3 ayda tek başıma çıkaramayacağım şey elenmelidir.

# ARAÇLAR — ne çalışıyor, ne çalışmıyor (test edildi 2026-08-10)

ÇALIŞIYOR:
- `APIFY_TOKEN` ortamda. Plan: **FREE, aylık $5 kredi.** Bu ciddi bir kısıt —
  her actor çağrısından önce maliyeti tahmin et, tek seferde tüm krediyi yakma.
  Doğrulanmış actor: `trudax~reddit-scraper-lite` (erişilebilir).
  Kullanım: POST https://api.apify.com/v2/acts/<actor>/runs?token=$APIFY_TOKEN
  Sonra dataset'i çek: GET https://api.apify.com/v2/datasets/<id>/items?token=...
- WebSearch / WebFetch (harness araçları).
- Playwright (yüklü, gerçek Chromium — JS duvarlarını aşar).
- NotebookLM CLI (`notebooklm`) — 109 defter mevcut. `notebooklm list` ile bak.
  İlgili defterler: "Idea Validation Workflow", "Starter Story — App Revenue Blueprints",
  "Greg Isenberg — Startup & Growth", "Business, Startups & Growth Ideas".
- Yerel bilgi tabanı: `node ~/.claude/tools/knowledge-search.js "sorgu" general`

ÇALIŞMIYOR (tekrar deneme, zaman kaybı):
- `reddit.com` / `old.reddit.com` / `api.reddit.com` doğrudan istek → **403**.
- Redlib aynaları (safereddit.com vb.) → **Anubis proof-of-work duvarı**.
- Sensor Tower API → ücretli, erişim yok. Sadece halka açık blog/rapor sayfaları okunabilir.
  **Erişemediğin bir kaynaktan sayı uydurma.** "Sensor Tower'a göre X" diyeceksen
  o sayfayı gerçekten getirmiş olmalısın.
- Google Trends → doğrudan API yok. WebFetch ile trends sayfaları JS arkasında.
  Playwright ile denenebilir ama pahalı; öncelik verme.

# ÖNCEKİ DENEMEDEN ÇIKAN DERS (bunu tekrarlama)

Reddit'te geniş kalıplarla arama yaptım: "I would pay for", "shut up and take my money",
"I would pay good money". **Sonuç neredeyse tamamen gürültü** — oyun, dizi, şaka.
En üstteki sonuçlar: "GTA klonu Archer evreninde olsa para verirdim", "Gastronaut
şeflerine ikinci fritöz için ayda 7 dolar veririm".

Ders: **Ödeme isteği, cümle kalıbıyla değil bağlamla bulunur.** Doğru yöntem:

1. Önce **para akan bir dikey seç** (meslek grubu, düzenlenmiş sektör, KOBİ operasyonu).
2. O dikeyin kendi topluluğunda ara — genel Reddit'te değil.
   Örnek havuz: r/therapists, r/sysadmin, r/Accounting, r/dentistry, r/realtors,
   r/Construction, r/veterinary, r/msp, r/bookkeeping, r/PhysicalTherapy, r/lawfirm,
   r/restaurantowners, r/Insurance, r/HumanResources, r/logistics
3. Aradığın sinyal "para verirdim" DEĞİL, şunlar:
   - "hâlâ elle yapıyoruz" / "Excel'de tutuyoruz"
   - "bunun için birini tutuyoruz" / "VA'ya yaptırıyoruz"
   - "X yazılımı berbat ama alternatifi yok"
   - aynı şikâyetin farklı kişilerce **tekrar tekrar** yazılması
   - mevcut çözümün fiyatı konuşuluyor olması (fiyat konuşuluyorsa pazar vardır)

# YÖNTEM

## Aşama 1 — Dikey seçimi (araç kullanmadan önce düşün)
6-10 aday dikey listele. Her biri için: para akıyor mu, yazılıma alışkın mı,
ulaşılabilir mi (topluluğu var mı), ve BEN bu alanı anlayabilir miyim?
Zayıf olanları burada ele, Apify kredisini boşa harcama.

## Aşama 2 — Kanıt toplama
Seçtiğin 3-4 dikey için Apify Reddit scraper ile o subreddit'lerin son 12 ayını tara.
Şikâyet kümelerini çıkar. Her küme için: kaç farklı kişi, kaç kez, ne kadar spesifik.
Paralel olarak WebSearch ile: o alanda hâlihazırda satan yazılımlar, fiyatları,
G2/Capterra şikâyetleri.

## Aşama 3 — Değerlendirme (her fikir için doldur)
| Ölçüt | Soru |
|---|---|
| Acı şiddeti | Ağrı kesici mi vitamin mi? Çözülmezse ne kaybediliyor — saat mi, para mı, müşteri mi? |
| Nicelleştirme | Acının bedeli TL/€ cinsinden ne? Hesaplayamıyorsan acı yeterince keskin değil. |
| Zaten ödüyorlar mı | Şu an bu işi kim/ne yapıyor ve ona ne ödeniyor? (İnsan, VA, rakip yazılım, Excel) |
| Ulaşılabilirlik | Bu insanlara reklamsız nasıl ulaşırım? Topluluk, dernek, kurum var mı? |
| Benim yapabilirliğim | 3 ayda tek başıma v1 çıkar mı? Regülasyon/entegrasyon duvarı var mı? |
| Neden şimdi | Son 12-24 ayda ne değişti de bu artık mümkün/gerekli? |
| Öldüren risk | Bu fikri en hızlı ne öldürür? |

## Aşama 4 — Doğrulama planı
Kazanan fikir için, **kod yazmadan** 2 haftalık test tasarla. Eşikler (pazarlıksız):
- 20 derinlemesine görüşme. Aranan tepki "iyi fikir" DEĞİL, **"bunu istiyorum"**.
- Ön satış: ürün yokken, indirimli. **En az 5 satın alma.**
- 4 hafta hizmeti **elle** ver (concierge). Kodu değil süreci iterate et.
Üçü tutmazsa: yapılmaz. Bunu net yaz.

# ÇIKTI FORMATI

1. **Eleme günlüğü** — hangi dikeyleri neden eledin (kısa, tek satır)
2. **Kısa liste: 3 fikir**, her biri için:
   - Tek cümlelik tanım
   - Kanıt: gerçek alıntılar + link + kaç kişi tarafından tekrarlanmış
   - Değerlendirme tablosu (yukarıdaki 7 ölçüt)
   - Kim öder, ne kadar, hangi model
3. **Tek öneri** ve neden diğer ikisi değil
4. **2 haftalık doğrulama planı** (kazanan için)
5. **Bilmediklerim** — hangi veriye erişemedin, hangi varsayım doğrulanmadı

# DÜRÜSTLÜK KURALLARI

- Erişemediğin kaynaktan sayı üretme. "Bu veriye erişemedim" geçerli ve değerli bir cevaptır.
- Her iddianın yanına kanıtını koy. Kanıtsız iddia = tahmin, öyle etiketle.
- Bir fikri sevdiğin için savunma. Kendi kısa listeni çürütmeye çalış.
- Bana "harika fikir" deme. Fikrin en zayıf yerini söyle.
- Fikirlerin hepsi zayıfsa bunu söyle ve neden diye açıkla — zorlama üçleme yapma.

# BAŞLA

Aşama 1 ile başla ve dikey listeni bana göster. Apify kredisi harcamadan önce
hangi 3-4 dikeye yoğunlaşacağımızı birlikte kararlaştıralım.
```

---

## Notlar

**Apify maliyet kontrolü.** FREE plan aylık $5. `reddit-scraper-lite` sonuç başına
ücretlendirir; tek çalıştırmada `maxItems` sınırı koymadan başlatma. Önce 100 sonuçla
dene, maliyeti ölç, sonra ölçekle.

**Kullanılabilecek diğer Apify actor'ları** (denenmedi, arayıp doğrulanmalı):
- App Store / Google Play review scraper — rakip uygulamaların şikâyetleri için
- G2 / Capterra scraper — B2B yazılım şikâyetleri, fiyat sinyali
- Google Maps scraper — yerel işletme yoğunluğu, pazar büyüklüğü tahmini

**Neden Sensor Tower'a takılma.** Halka açık "State of Mobile" raporu kategori
seviyesinde veri veriyor (2026: AI +%254, kısa drama +%115, medya düzenleme +%71,
sağlık-fitness IAP $4,5 milyar) ama tek tek uygulama gelirini görmek ücretli.
Kategori verisi zaten yeter — asıl sinyal Reddit'teki operasyonel şikâyette.
