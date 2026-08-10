/* =========================================================
   Anima — Jungian lexicon
   Archetypes, dream symbols and amplification prompts.
   Content is interpretive material for reflection, not diagnosis.
   ========================================================= */

window.LEX = (function () {

  /* ---------- Archetypes ---------- */
  const ARCHETYPES = [
    {
      id: 'shadow', glyph: 'G',
      tr: { name: 'Gölge', gloss: 'Reddedilen, tanınmayan yan',
        body: 'Gölge, benliğin kabul etmeyi reddettiği niteliklerin toplamıdır. Rüyada çoğunlukla sizinle aynı cinsiyetten, rahatsız edici, tehditkâr ya da utandırıcı bir figür olarak görünür; kovalayan, hırsızlık yapan, sınır ihlal eden biri olabilir.',
        ask: 'Bu figürün yaptığı şeyi kendinizde en son ne zaman bastırdınız?' },
      en: { name: 'Shadow', gloss: 'The disowned, unrecognised side',
        body: 'The Shadow is the sum of the qualities the ego refuses to own. In dreams it usually appears as a same-sex figure who is disturbing, threatening or shameful — a pursuer, a thief, someone who crosses a line.',
        ask: 'When did you last suppress in yourself what this figure is doing?' }
    },
    {
      id: 'anima', glyph: 'A',
      tr: { name: 'Anima', gloss: 'Erkekteki içsel dişil',
        body: 'Anima, erkek psişesindeki dişil ilkedir: duygulanım, ilişkisellik, eros ve ruh. Tanımadığınız bir kadın, rehber, baştan çıkarıcı ya da yaralı bir figür olarak belirir. Olgunlaşması dört aşamada okunur: Havva, Helena, Meryem, Sophia.',
        ask: 'Bu figür sizden hangi duyguyu yaşamanızı istiyor?' },
      en: { name: 'Anima', gloss: 'The inner feminine in a man',
        body: 'The Anima is the feminine principle in the male psyche: feeling, relatedness, eros and soul. She appears as an unknown woman, a guide, a seductress or a wounded figure. Her maturation is read in four stages: Eve, Helen, Mary, Sophia.',
        ask: 'What feeling is this figure asking you to actually feel?' }
    },
    {
      id: 'animus', glyph: 'An',
      tr: { name: 'Animus', gloss: 'Kadındaki içsel eril',
        body: 'Animus, kadın psişesindeki eril ilkedir: logos, ayrım gücü, yön ve söz. Bir grup erkek, otorite figürü, hâkim ya da yol gösteren bir yabancı olarak görünebilir. Bilinçdışı kaldığında kesin yargılar ve iç eleştiri sesi olarak konuşur.',
        ask: 'Bu figürün sesi bir kanaat mi, yoksa bir yargı mı?' },
      en: { name: 'Animus', gloss: 'The inner masculine in a woman',
        body: 'The Animus is the masculine principle in the female psyche: logos, discrimination, direction and word. He appears as a group of men, an authority, a judge or a guiding stranger. Unconscious, he speaks as rigid opinion and inner criticism.',
        ask: 'Is this figure’s voice a conviction, or a verdict?' }
    },
    {
      id: 'persona', glyph: 'P',
      tr: { name: 'Persona', gloss: 'Dünyaya dönük maske',
        body: 'Persona, dış dünyayla ilişki kurmak için taşınan maskedir. Kıyafet, üniforma, rol, sahne, sınav ve çıplaklık rüyaları personayla ilgilidir. Uygun bir persona işlevseldir; sorun, kişinin maskeyle özdeşleşmesidir.',
        ask: 'Bu rüyada kim olarak görünüyordunuz — ve gerçekte kim olduğunuz?' },
      en: { name: 'Persona', gloss: 'The mask turned to the world',
        body: 'The Persona is the mask worn to relate to the outer world. Clothing, uniforms, roles, stages, exams and nakedness are its dreams. A fitting persona is functional; the danger is identifying with the mask.',
        ask: 'Who did you appear as in this dream — and who were you?' }
    },
    {
      id: 'self', glyph: 'S',
      tr: { name: 'Benlik (Self)', gloss: 'Bütünlüğün merkezi',
        body: 'Benlik, psişenin hem merkezi hem bütünüdür; egoyu aşar. Mandala, çember, dört köşe, değerli taş, kral-kraliçe çifti, ilahi çocuk ya da yaşlı bilge figürü ile temsil edilir. Görünmesi genellikle bireyleşme sürecinde bir eşiğe işaret eder.',
        ask: 'Rüyada bir merkez, bir simetri ya da dörtlü bir yapı var mıydı?' },
      en: { name: 'Self', gloss: 'The centre of wholeness',
        body: 'The Self is both centre and totality of the psyche; it exceeds the ego. It is figured by mandalas, circles, quaternities, jewels, the royal couple, the divine child or the sage. Its appearance often marks a threshold in individuation.',
        ask: 'Was there a centre, a symmetry or a fourfold structure in the dream?' }
    },
    {
      id: 'sage', glyph: 'B',
      tr: { name: 'Bilge Yaşlı', gloss: 'Anlam ve yönlendirme',
        body: 'Yaşlı bilge (senex), egonun kendi başına çözemediği bir durumda beliren anlam figürüdür: hoca, hekim, derviş, büyücü, dede. Sözü genellikle kısa ve kesindir. Gölge yüzü katı, kuru, hayattan kopuk otoritedir.',
        ask: 'Size ne söyledi — ve bu sözü neden şimdi duyuyorsunuz?' },
      en: { name: 'Wise Old Figure', gloss: 'Meaning and direction',
        body: 'The senex is the figure of meaning who appears when the ego cannot resolve a situation alone: teacher, physician, dervish, magician, grandparent. The words are usually short and definite. Its shadow is rigid, dry, life-denying authority.',
        ask: 'What did it say — and why are you hearing it now?' }
    },
    {
      id: 'mother', glyph: 'M',
      tr: { name: 'Büyük Ana', gloss: 'Besleyen ve yutan',
        body: 'Büyük Ana arketipi iki yüzlüdür: besleyen, saran, doğuran; ve yutan, boğan, salmayan. Ev, mağara, deniz, toprak, bahçe ve kendi anneniz bu arketipin taşıyıcısı olabilir.',
        ask: 'Bu rüyada besleniyor muydunuz, yoksa tutuluyor mu?' },
      en: { name: 'Great Mother', gloss: 'The nourishing and the devouring',
        body: 'The Great Mother is two-faced: nourishing, containing, birthing — and devouring, smothering, never releasing. House, cave, sea, earth, garden and your own mother can all carry her.',
        ask: 'In this dream, were you being fed — or being held down?' }
    },
    {
      id: 'father', glyph: 'Y',
      tr: { name: 'Baba / Yasa', gloss: 'Sınır, otorite, düzen',
        body: 'Baba arketipi yasayı, sınırı ve dünyaya çıkış iznini temsil eder. Devlet, patron, hâkim, asker, kurum ya da kendi babanız olarak görünür. Eksikliği yönsüzlük, fazlası boğucu bir düzen üretir.',
        ask: 'Bu rüyadaki kural kimindi, ve siz onu kabul ettiniz mi?' },
      en: { name: 'Father / Law', gloss: 'Limit, authority, order',
        body: 'The Father archetype stands for law, limit and permission to enter the world. He appears as the state, a boss, a judge, a soldier, an institution or your own father. Too little produces drift; too much, a suffocating order.',
        ask: 'Whose rule was operating in this dream, and did you accept it?' }
    },
    {
      id: 'hero', glyph: 'K',
      tr: { name: 'Kahraman', gloss: 'Eşiği geçen ego',
        body: 'Kahraman, bilinçdışının sularına inip bir değerle geri dönen ego işlevidir. Yolculuk, canavarla karşılaşma, hazine ve dönüş kalıbı izlenir. Enflasyona uğradığında kahramanlık bir savunmaya dönüşür.',
        ask: 'Neyi almak için indiniz — ve geri getirdiniz mi?' },
      en: { name: 'Hero', gloss: 'The ego that crosses the threshold',
        body: 'The Hero is the ego-function that descends into the unconscious and returns with a value. The pattern runs: journey, encounter with the monster, treasure, return. Inflated, heroism becomes a defence.',
        ask: 'What did you descend to retrieve — and did you bring it back?' }
    },
    {
      id: 'trickster', glyph: 'D',
      tr: { name: 'Düzenbaz', gloss: 'Bozan, çeviren, açan',
        body: 'Trickster planı bozar, sınırı çiğner, gülünç duruma düşürür. Nasreddin Hoca, Keloğlan, hokkabaz, hırsız ya da konuşan hayvan olarak gelir. İşlevi yıkım değil: katılaşmış bir tutumu esnetmektir.',
        ask: 'Hangi planınız bozuldu — ve bozulması iyi mi oldu?' },
      en: { name: 'Trickster', gloss: 'Breaker, inverter, opener',
        body: 'The Trickster spoils the plan, crosses the line, makes you ridiculous. He arrives as a jester, a thief, a talking animal, a fool. His function is not destruction but loosening an attitude that has hardened.',
        ask: 'Which plan of yours was spoiled — and was the spoiling a mercy?' }
    },
    {
      id: 'child', glyph: 'Ç',
      tr: { name: 'İlahi Çocuk', gloss: 'Yeni olan, korunmasız olan',
        body: 'Çocuk arketipi henüz doğmuş bir olanağı temsil eder: yeni bir tutum, yeni bir iş, yeni bir ilişki. Rüyada terk edilmiş bebek, kurtarılması gereken çocuk ya da olağanüstü yetenekli bir çocuk olarak belirir.',
        ask: 'Hayatınızda henüz kırılgan olan ve korunması gereken ne var?' },
      en: { name: 'Divine Child', gloss: 'The new, the unprotected',
        body: 'The Child stands for a possibility just born: a new attitude, a new work, a new relationship. It appears as an abandoned infant, a child needing rescue, or a child of uncanny gifts.',
        ask: 'What in your life is still fragile and needs protecting?' }
    },
    {
      id: 'healer', glyph: 'Ş',
      tr: { name: 'Yaralı Şifacı', gloss: 'Yara üzerinden iyileştiren',
        body: 'Şifacı arketipi, kendi yarasını taşıyarak başkasını iyileştirebilen figürdür (Kheiron kalıbı). Hekim, terapist, hemşire, ilaç, hastane ve ameliyat rüyalarında görünür. Gölgesi: kendi yarasını görmeyi reddeden kurtarıcı.',
        ask: 'Şu an başkası için taşıdığınız yük aslında kimin?' },
      en: { name: 'Wounded Healer', gloss: 'Healing through the wound',
        body: 'The Healer carries their own wound and heals through it (the Chiron pattern). Physicians, therapists, medicine, hospitals and surgery carry it. Its shadow is the rescuer who refuses to see their own wound.',
        ask: 'The burden you are carrying for someone — whose is it really?' }
    }
  ];

  /* ---------- Symbols ---------- */
  const S = (id, trName, enName, trGloss, enGloss, trBody, enBody) =>
    ({ id, tr: { name: trName, gloss: trGloss, body: trBody }, en: { name: enName, gloss: enGloss, body: enBody } });

  const SYMBOLS = [
    S('water', 'Su', 'Water', 'Bilinçdışının kendisi', 'The unconscious itself',
      'Su, Jung için bilinçdışının en yaygın simgesidir. Durgun su içe bakışı, akan su hayat enerjisini, bulanık su ayrışmamış içerikleri gösterir. Suya girmek bilinçdışıyla temasa girmektir.',
      'Water is Jung’s most common image of the unconscious. Still water suggests introspection, flowing water libido, murky water undifferentiated content. To enter it is to make contact with the unconscious.'),
    S('sea', 'Deniz / Okyanus', 'Sea / Ocean', 'Kolektif bilinçdışı', 'The collective unconscious',
      'Deniz, kişisel olanın ötesindeki ortak psişik zemindir. Fırtınalı bir deniz güçlü bir duygulanım basıncına, dipteki bir şey unutulmuş ama etkin bir içeriğe işaret eder.',
      'The sea is the shared psychic ground beyond the personal. A storm suggests affective pressure; something on the seabed, a forgotten but still active content.'),
    S('house', 'Ev', 'House', 'Psişenin yapısı', 'The structure of the psyche',
      'Ev genellikle kişinin kendisidir. Üst katlar bilinç ve düşünce, zemin gündelik yaşam, bodrum ve mahzen bilinçdışıdır. Bilmediğiniz bir oda keşfedilmemiş bir kapasitedir.',
      'The house is usually the dreamer. Upper floors are consciousness and thought, the ground floor daily life, the cellar the unconscious. An unknown room is an undiscovered capacity.'),
    S('snake', 'Yılan', 'Snake', 'Dönüşüm ve içgüdü', 'Transformation and instinct',
      'Yılan deri değiştirir: yenilenme, şifa ve tehlike aynı imgede birleşir. Omurga boyunca yükselen enerjiyi, aynı zamanda bastırılmış içgüdüsel gücü temsil eder.',
      'The snake sheds its skin: renewal, healing and danger in one image. It represents energy rising along the spine, and equally the repressed instinctual force.'),
    S('flying', 'Uçmak', 'Flying', 'Yükselme ve kopuş', 'Elevation and detachment',
      'Uçmak özgürleşme duygusu verir; ancak Jung bunu sık sık gerçeklikten kopuş (enflasyon) uyarısı olarak da okur. Yükseklik ne kadar yönetilebilir?',
      'Flight brings a sense of liberation; Jung also reads it as a warning of inflation — detachment from the ground of reality. How governable was the altitude?'),
    S('falling', 'Düşmek', 'Falling', 'Kontrolün bırakılması', 'The release of control',
      'Düşme rüyaları çoğunlukla aşırı gerilmiş bir bilinç tutumunun ardından gelir. Düşüş, egonun tutunduğu yerden aşağıya, gerçek zemine doğru bir düzeltmedir.',
      'Falling dreams often follow an over-stretched conscious attitude. The fall is a correction downward, from where the ego was clinging toward actual ground.'),
    S('chased', 'Kovalanmak', 'Being chased', 'Kaçılan içerik', 'The content being avoided',
      'Kovalayan figür neredeyse her zaman sahiplenilmemiş bir yandır. Kaçmak sürdürür, dönüp bakmak dönüştürür. Kovalayanın kimliği en önemli veridir.',
      'The pursuer is almost always a disowned part. Running sustains it; turning to look transforms it. The identity of the pursuer is the key datum.'),
    S('death', 'Ölüm', 'Death', 'Bir dönemin sonu', 'The end of a phase',
      'Rüyadaki ölüm nadiren fiziksel ölümü gösterir. Bir tutumun, ilişkinin ya da kimliğin sonlanmasıdır; genellikle yeni bir şeyin doğuşundan hemen önce gelir.',
      'Death in dreams rarely means physical death. It marks the ending of an attitude, a relationship or an identity — usually just before something new is born.'),
    S('birth', 'Doğum / Bebek', 'Birth / Baby', 'Yeni bir olanak', 'A new possibility',
      'Doğum imgesi henüz kırılgan olan yeni bir psişik içeriği bildirir. Bebeğe kimin baktığı, sizin bu yeni şeye nasıl davrandığınızı gösterir.',
      'Birth announces a new psychic content, still fragile. Who is caring for the infant shows how you are treating this new thing.'),
    S('mirror', 'Ayna', 'Mirror', 'Kendini görme', 'Self-confrontation',
      'Ayna, bakılmayanı gösterir. Yansımanın bozuk, yabancı ya da yaşlı olması, benlik imgeniz ile gerçekliğiniz arasındaki açıklığa işaret eder.',
      'The mirror shows what is not looked at. A distorted, foreign or aged reflection points to the gap between your self-image and your actuality.'),
    S('door', 'Kapı / Eşik', 'Door / Threshold', 'Geçiş noktası', 'The point of passage',
      'Kapı bir seçim anıdır. Kilitli kapı henüz hazır olunmayan bir içeriği, açık kapı davet edilmiş bir değişimi gösterir.',
      'A door is a moment of choice. A locked door marks content you are not ready for; an open one, a change already inviting you.'),
    S('stairs', 'Merdiven', 'Stairs', 'Bilinç düzeyleri arası hareket', 'Movement between levels',
      'Yukarı çıkmak soyutlama ve bilince, aşağı inmek bedene ve bilinçdışına doğru harekettir. Yönü ve zorluğu önemlidir.',
      'Ascending moves toward abstraction and consciousness; descending toward body and the unconscious. Direction and difficulty both matter.'),
    S('forest', 'Orman', 'Forest', 'Bilinmeyene giriş', 'Entering the unknown',
      'Orman, yolun görünmediği yerdir: bilinçdışının kişisel katmanı. Masallarda kahraman ormanda kaybolmadan dönüşemez.',
      'The forest is where the path disappears: the personal layer of the unconscious. In fairy tales the hero cannot transform without first getting lost in it.'),
    S('cave', 'Mağara', 'Cave', 'İçe çekilme, kuluçka', 'Withdrawal and incubation',
      'Mağara hem barınak hem sınavdır. İçine girmek, dış dünyadan çekilip bir dönüşümü beklemektir. Büyük Ana arketipiyle yakından ilişkilidir.',
      'The cave is both shelter and ordeal. To enter is to withdraw from the world and incubate a transformation. Closely tied to the Great Mother.'),
    S('fire', 'Ateş', 'Fire', 'Dönüştürücü tutku', 'Transforming passion',
      'Ateş yakar ve arıtır. Simyada calcinatio: eskiyi külüne indirgemek. Kontrolsüz ateş yıkıcı bir duygulanımı, ocaktaki ateş toplanmış enerjiyi gösterir.',
      'Fire burns and purifies. In alchemy, calcinatio: reducing the old to ash. Uncontrolled fire is destructive affect; a hearth fire, gathered energy.'),
    S('teeth', 'Diş dökülmesi', 'Teeth falling out', 'Güç ve söz kaybı', 'Loss of power and voice',
      'Diş kaybı rüyaları çoğunlukla güç kaybı, yaşlanma korkusu ya da söylenemeyen bir sözle ilgilidir. Dişler ısırma — yani kendini savunma — kapasitesidir.',
      'Teeth dreams usually concern loss of potency, fear of ageing, or something unsayable. Teeth are the capacity to bite — that is, to defend oneself.'),
    S('naked', 'Çıplaklık', 'Nakedness', 'Persona düşüşü', 'The persona falling',
      'Kalabalıkta çıplak kalmak, maskenin işlemediği bir durumu bildirir. Utanç eşlik ediyorsa, korunmak istenen şey tam olarak nedir?',
      'Being naked in public reports a situation where the mask no longer works. If shame accompanies it, what exactly is being protected?'),
    S('exam', 'Sınav', 'Exam', 'Yeterlilik kaygısı', 'Anxiety of adequacy',
      'Hazırlıksız sınav rüyası, hazır olmadan değerlendirilme korkusudur; genellikle gerçek bir eşiğin (iş, ilişki, rol) hemen öncesinde gelir.',
      'The unprepared-exam dream is the fear of being evaluated before you are ready; it usually arrives just before a real threshold.'),
    S('vehicle', 'Araç / Araba', 'Vehicle / Car', 'Yaşamın gidişatı', 'The course of your life',
      'Aracı kim kullanıyor? Fren tutuyor mu? Araba, hayatınızı ne ölçüde yönettiğinize dair doğrudan bir imgedir.',
      'Who is driving? Do the brakes hold? The car is a direct image of how much you are steering your own life.'),
    S('road', 'Yol', 'Road / Path', 'Bireyleşme çizgisi', 'The line of individuation',
      'Yol, hayat gidişatının imgesidir. Çatallanma bir karar, çıkmaz sokak tıkanmış bir tutum, yeni açılan patika bir olanaktır.',
      'The road images the course of a life. A fork is a decision, a dead end a blocked attitude, a newly opening path a possibility.'),
    S('bridge', 'Köprü', 'Bridge', 'Karşıtları birleştiren', 'What joins opposites',
      'Köprü, iki kıyı arasındaki aşkın işlevi temsil eder: bilinç ile bilinçdışı, eski ile yeni. Sağlam mı, yıkık mı olduğu belirleyicidir.',
      'The bridge represents the transcendent function between two shores: conscious and unconscious, old and new. Whether it holds is the point.'),
    S('animal', 'Hayvan', 'Animal', 'İçgüdüsel doğa', 'Instinctual nature',
      'Hayvan, medenileşmemiş içgüdüdür. Evcil hayvan uyum sağlamış, yabani hayvan bastırılmış içgüdüyü gösterir. Yaralı hayvan zedelenmiş bir doğallıktır.',
      'The animal is uncivilised instinct. A tame animal shows adapted instinct, a wild one repressed instinct. A wounded animal is an injured naturalness.'),
    S('bird', 'Kuş', 'Bird', 'Ruh ve sezgi', 'Spirit and intuition',
      'Kuş, ruhun ve düşüncenin imgesidir; haber getirir. Kafesteki kuş engellenmiş bir sezgiyi, ölü kuş kaybedilmiş bir ilhamı gösterir.',
      'The bird images spirit and thought; it brings news. A caged bird shows blocked intuition; a dead bird, lost inspiration.'),
    S('fish', 'Balık', 'Fish', 'Derinden gelen içerik', 'Content from the depths',
      'Balık, bilinçdışının derinliğinden yüzeye çıkan içeriktir. Simyada ve Hristiyan sembolizminde Benlik ile ilişkilendirilir.',
      'The fish is content surfacing from the depth. In alchemy and Christian symbolism it is associated with the Self.'),
    S('moon', 'Ay', 'Moon', 'Dişil, döngüsel bilgi', 'Feminine, cyclical knowing',
      'Ay, ışığını yansıtan bilinçtir: duygulanımsal, döngüsel, dolaylı bilgi. Simyada luna, sol’un karşıtı ve tamamlayıcısıdır.',
      'The moon is reflected light: affective, cyclical, indirect knowing. In alchemy luna is both opposite and complement of sol.'),
    S('sun', 'Güneş', 'Sun', 'Bilinç ve merkez', 'Consciousness and centre',
      'Güneş, bilinç ve ego-benlik ekseninin imgesidir. Doğuşu yeni bir farkındalığı, tutulması geçici bir bilinç kaybını gösterebilir.',
      'The sun images consciousness and the ego–Self axis. Its rising suggests a new awareness; an eclipse, a temporary loss of it.'),
    S('mandala', 'Mandala / Çember', 'Mandala / Circle', 'Bütünleşme', 'Integration',
      'Çember, kare içinde dörtlü yapı ya da simetrik bahçe: Benlik’in düzenleyici imgesi. Kaotik dönemlerde ortaya çıkması psişenin kendini toparlama girişimidir.',
      'A circle, a quaternity in a square, a symmetrical garden: the ordering image of the Self. Its appearance in chaotic periods is the psyche’s attempt at self-organisation.'),
    S('treasure', 'Hazine / Mücevher', 'Treasure / Jewel', 'Değerli olan', 'The thing of value',
      'Hazine, zor bir yolculuğun sonunda elde edilen psişik değerdir: lapis, inci, altın. Genellikle bir ejderha ya da engel tarafından korunur.',
      'Treasure is the psychic value won at the end of a hard journey: the lapis, the pearl, gold. It is usually guarded by a dragon or an obstacle.'),
    S('key', 'Anahtar', 'Key', 'Erişim imkânı', 'The means of access',
      'Anahtar, kapalı olana erişim demektir: bir içgörü, bir izin, bir yöntem. Anahtarı kaybetmek erişimin geçici olarak yitirilmesidir.',
      'The key is access to what is closed: an insight, a permission, a method. Losing it is a temporary loss of access.'),
    S('labyrinth', 'Labirent', 'Labyrinth', 'Yönsüz arayış', 'Disoriented search',
      'Labirent, merkeze giden dolambaçlı yoldur. Kaybolmak sürecin parçasıdır; labirentin ortasında karşılaşılan şey genellikle gölgedir.',
      'The labyrinth is the winding road to a centre. Getting lost is part of the process; what waits at the centre is usually the shadow.'),
    S('blood', 'Kan', 'Blood', 'Yaşam ve bedel', 'Life and cost',
      'Kan hem hayat enerjisi hem ödenen bedeldir. Kan kaybı tükenmeyi, akan kan bir dönüşümün fiyatını gösterebilir.',
      'Blood is both life-energy and the price paid. Blood loss can show depletion; spilled blood, the cost of a transformation.'),
    S('wedding', 'Düğün / Birleşme', 'Wedding / Union', 'Karşıtların birliği', 'The union of opposites',
      'Kutsal evlilik (hieros gamos, coniunctio), birbirine karşıt psişik güçlerin birleşmesidir: bireyleşmenin doruk imgelerinden biri.',
      'The sacred marriage (hieros gamos, coniunctio) is the union of opposed psychic forces — one of the culminating images of individuation.'),
    S('stranger', 'Yabancı', 'Stranger', 'Tanınmayan yan', 'The unrecognised part',
      'Tanımadığınız bir figür, henüz bilince alınmamış bir kapasitedir. Cinsiyeti, yaşı ve tavrı hangi arketipin konuştuğunu söyler.',
      'An unknown figure is a capacity not yet taken into consciousness. Its sex, age and manner tell you which archetype is speaking.'),
    S('mountain', 'Dağ', 'Mountain', 'Çaba ve perspektif', 'Effort and perspective',
      'Dağ, tırmanılması gereken hedefi ve tepeden görülecek genişlemiş bakışı temsil eder. Çıkışın zorluğu içsel çabanın ölçüsüdür.',
      'The mountain is the goal to be climbed and the widened view from the summit. The difficulty of the ascent measures the inner effort.'),
    S('storm', 'Fırtına', 'Storm', 'Duygulanım basıncı', 'Affective pressure',
      'Fırtına, bastırılmış duygulanımın doğal güç olarak dışa vurumudur. Fırtınadan sonraki durulma çoğunlukla rüyanın asıl mesajıdır.',
      'A storm is repressed affect erupting as natural force. The calm afterwards is often the dream’s actual message.'),
    S('shadowfig', 'Karanlık figür', 'Dark figure', 'Gölgenin kişileşmesi', 'The shadow personified',
      'Yüzü görünmeyen, karanlıkta duran figür gölgenin en yalın hâlidir. Yaklaşmasına izin verildiğinde çoğunlukla saldırganlığını yitirir.',
      'A faceless figure standing in the dark is the shadow in its barest form. When allowed to approach, it usually loses its aggression.')
  ];

  /* ---------- Moods ---------- */
  const MOODS = [
    { id: 'peaceful',  tr: 'Huzurlu',  en: 'Peaceful',  v: 2 },
    { id: 'joyful',    tr: 'Neşeli',   en: 'Joyful',    v: 2 },
    { id: 'curious',   tr: 'Meraklı',  en: 'Curious',   v: 1 },
    { id: 'neutral',   tr: 'Nötr',     en: 'Neutral',   v: 0 },
    { id: 'confused',  tr: 'Şaşkın',   en: 'Confused',  v: 0 },
    { id: 'sad',       tr: 'Hüzünlü',  en: 'Sad',      v: -1 },
    { id: 'anxious',   tr: 'Kaygılı',  en: 'Anxious',   v: -1 },
    { id: 'angry',     tr: 'Öfkeli',   en: 'Angry',     v: -1 },
    { id: 'afraid',    tr: 'Korkmuş',  en: 'Afraid',    v: -2 }
  ];

  /* ---------- Amplification prompts ---------- */
  const PROMPTS = [
    { tr: 'Bu rüyadaki en güçlü duygu neydi ve bedeninizin neresinde hissettiniz?',
      en: 'What was the strongest feeling, and where in your body did you feel it?' },
    { tr: 'Rüyadaki figürlerden biri sizin bir yanınız olsaydı, hangisi olurdu?',
      en: 'If one of the figures were a part of you, which part would it be?' },
    { tr: 'Bu rüya uyanık hayatınızdaki hangi durumu yansıtıyor olabilir?',
      en: 'Which situation in your waking life might this dream be mirroring?' },
    { tr: 'Rüyada kaçındığınız ya da bakmadığınız bir şey var mıydı?',
      en: 'Was there something you avoided or did not look at in the dream?' },
    { tr: 'Rüya bitmeseydi bir sahne daha olsaydı, ne olurdu?',
      en: 'If the dream had one more scene, what would happen next?' },
    { tr: 'Bu imgeyi bir masal, mit ya da anı hatırlatıyor mu?',
      en: 'Does this image recall a fairy tale, a myth or a memory?' },
    { tr: 'Rüyadaki mekân size hangi dönemi hatırlatıyor?',
      en: 'What period of your life does the setting recall?' },
    { tr: 'Rüya size bir şey soruyor olsaydı, sorusu ne olurdu?',
      en: 'If the dream were asking you something, what would the question be?' },
    { tr: 'Bu rüyaya bir başlık verseydiniz — bir film adı gibi — ne olurdu?',
      en: 'If you titled this dream like a film, what would the title be?' },
    { tr: 'Rüyada değiştirmek istediğiniz tek an hangisiydi?',
      en: 'Which single moment in the dream would you want to change?' }
  ];

  return { ARCHETYPES, SYMBOLS, MOODS, PROMPTS };
})();
