/* =========================================================
   Anima — sample notebook ("örnek defter")
   A demonstration series, written to exercise the most prevalent
   themes in Nielsen et al. (2003) so the map and the reading have
   something true to work on during a demo.

   These are NOT records of anyone's dreams. Every entry carries
   demo: true, the UI labels the notebook as a sample while it is
   loaded, and one tap removes all of them. Real entries are never
   touched by loading or clearing the sample.
   ========================================================= */

window.SAMPLE_DREAMS = {
  tr: [
    { ago: 0, title: 'Bodrumdaki anahtar', mood: 'curious', clarity: 4, recurring: false,
      archetypes: ['anima', 'shadow'], symbols: ['Ev', 'Anahtar', 'Merdiven', 'Kapı / Eşik'],
      body: 'Çocukluğumuzun evindeyim ama bodrumu hiç böyle değildi. Merdivenler ıslak, aşağısı karanlık. En altta tanımadığım bir kadın bekliyor; sakin, acelesi yok. Elinde eski bir anahtar var, konuşmadan bana uzatıyor. Anahtarı aldığım anda duvarda daha önce hiç görmediğim bir kapı beliriyor. Açmadan uyanıyorum.' },
    { ago: 1, title: 'Küreksiz sandal', mood: 'peaceful', clarity: 5, lucid: true, recurring: false,
      archetypes: ['self'], symbols: ['Deniz / Okyanus', 'Balık', 'Dağ', 'Su'],
      body: 'Açık denizde bir sandaldayım, kürekler yok. Korkmam gerektiğini biliyorum ama korkmuyorum. Su o kadar berrak ki dibi görüyorum; altımdan çok büyük bir balık yavaşça geçiyor, bana bakıyor. Uzakta tek bir dağ var ve sandal kendiliğinden ona doğru gidiyor. Rüyada olduğumu fark ediyorum ve hiçbir şeyi değiştirmek istemiyorum.' },
    { ago: 2, title: 'Hazırlıksız sınav', mood: 'anxious', clarity: 3, recurring: true,
      archetypes: ['persona'], symbols: ['Sınav', 'Çıplaklık'],
      body: 'Sınav salonuna giriyorum, dersi hiç almamışım. Herkes yazmaya başlamış. Sıralar arasında yürürken üzerimde bir şey olmadığını fark ediyorum ama kimse dönüp bakmıyor. Gözetmen yanıma gelip adımı soruyor ve hatırlayamıyorum. Kâğıda bakıyorum, sorular başka bir alfabeyle yazılmış.' },
    { ago: 4, title: 'Ormanda dönüp bakmak', mood: 'afraid', clarity: 4, recurring: true,
      archetypes: ['shadow'], symbols: ['Orman', 'Kovalanmak', 'Karanlık figür'],
      body: 'Karanlık bir ormanda koşuyorum. Arkamdan biri geliyor, adımları benimkilerle aynı ritimde. Ayaklarım gittikçe ağırlaşıyor, ağaçlar sıklaşıyor. Sonunda koşmayı bırakıp duruyorum ve dönüp bakıyorum. Yüzünü göremiyorum ama duruşu bana tanıdık geliyor. Yaklaşıyor ve hiçbir şey yapmıyor.' },
    { ago: 6, title: 'Düşerken uyanmak', mood: 'confused', clarity: 2, recurring: true,
      archetypes: [], symbols: ['Düşmek', 'Merdiven'],
      body: 'Bir apartman boşluğunda merdivenlerden iniyorum, basamaklar gittikçe daralıyor. Bir noktada basamak yok ve düşüyorum. Düşüş uzun sürüyor, altımda bir şey görünmüyor. Çarpma anını hiç görmeden yatağımda uyanıyorum, kalbim hızlı.' },
    { ago: 8, title: 'Bahçedeki çember', mood: 'peaceful', clarity: 4, recurring: false,
      archetypes: ['sage', 'self'], symbols: ['Mandala / Çember', 'Bahçe', 'Ev'],
      body: 'Hiç bilmediğim bir bahçedeyim. Yaşlı bir adam bana ortadaki ağacı gösteriyor, "bunu sen dikmişsin" diyor. İnanmıyorum ama itiraz da etmiyorum. Ağacın çevresinde taşlar tam bir çember oluşturmuş, dört yöne birer patika ayrılıyor. Adam gidiyor, ben çemberin içinde kalıyorum.' },
    { ago: 11, title: 'Bilinmeyen oda', mood: 'curious', clarity: 3, recurring: false,
      archetypes: ['self', 'mother'], symbols: ['Ev', 'Kapı / Eşik', 'Deniz / Okyanus'],
      body: 'Yıllardır oturduğumuz evde bir kapı fark ediyorum, daha önce hiç dikkatimi çekmemiş. Açıyorum: içerisi bomboş ama çok aydınlık. Tek bir pencere var ve pencereden deniz görünüyor — oysa evimiz denize çok uzak. Odada hiçbir eşya yok, yine de burada yaşandığını biliyorum.' },
    { ago: 14, title: 'Uçmak ama alçalamamak', mood: 'joyful', clarity: 4, lucid: true, recurring: false,
      archetypes: ['hero'], symbols: ['Uçmak', 'Dağ'],
      body: 'Şehrin üstünde uçuyorum, kollarımı açmama bile gerek yok. Önce inanılmaz bir hafiflik var. Sonra inmek istiyorum ve inemiyorum; ne kadar uğraşsam yükseklik hep aynı kalıyor. Aşağıda tanıdığım insanlar var, bana bakıyorlar ama seslerini duyamıyorum.' },
    { ago: 17, title: 'Deri değiştiren yılan', mood: 'confused', clarity: 5, lucid: true, recurring: false,
      archetypes: ['shadow', 'healer'], symbols: ['Yılan', 'Su'],
      body: 'Bileğime bir yılan dolanıyor. Isırmasını bekliyorum ama ısırmıyor, sadece sıkıyor — acıtmadan. Sonra derisini değiştirmeye başlıyor ve eski deri benim elimde kalıyor. Elimdeki deri kâğıt gibi hafif. Yılan suya girip gözden kayboluyor.' },
    { ago: 21, title: 'Köprüde durmak', mood: 'neutral', clarity: 3, recurring: false,
      archetypes: ['self'], symbols: ['Köprü', 'Deniz / Okyanus', 'Ateş'],
      body: 'Uzun bir köprünün tam ortasında duruyorum. İki yaka da sisli, hangisinden geldiğimi hatırlamıyorum. Suyun üstünde uzakta bir şey yanıyor, dumanı dümdüz yukarı çıkıyor. Ne ileri ne geri gidiyorum; sadece bakıyorum ve bunun yanlış olmadığını hissediyorum.' }
  ],

  en: [
    { ago: 0, title: 'The key in the cellar', mood: 'curious', clarity: 4, recurring: false,
      archetypes: ['anima', 'shadow'], symbols: ['House', 'Key', 'Stairs', 'Door / Threshold'],
      body: 'I am in the house of my childhood, but the cellar was never like this. The stairs are wet, the bottom is dark. A woman I do not know is waiting there; calm, in no hurry. She holds an old key and offers it to me without speaking. The moment I take it, a door appears in the wall I have never seen before. I wake before opening it.' },
    { ago: 1, title: 'A boat without oars', mood: 'peaceful', clarity: 5, lucid: true, recurring: false,
      archetypes: ['self'], symbols: ['Sea / Ocean', 'Fish', 'Mountain', 'Water'],
      body: 'I am in a boat on open sea and there are no oars. I know I should be afraid and I am not. The water is so clear I can see the bottom; an enormous fish passes slowly beneath me and looks at me. There is a single mountain in the distance and the boat moves toward it by itself. I realise I am dreaming and I do not want to change anything.' },
    { ago: 2, title: 'The unprepared exam', mood: 'anxious', clarity: 3, recurring: true,
      archetypes: ['persona'], symbols: ['Exam', 'Nakedness'],
      body: 'I enter the examination hall having never taken the course. Everyone has already started writing. Walking between the desks I notice I am wearing nothing, but nobody turns to look. The invigilator comes over and asks my name and I cannot remember it. I look at the paper: the questions are written in another alphabet.' },
    { ago: 4, title: 'Turning to look in the forest', mood: 'afraid', clarity: 4, recurring: true,
      archetypes: ['shadow'], symbols: ['Forest', 'Being chased', 'Dark figure'],
      body: 'I am running through a dark forest. Someone is behind me, their steps in the same rhythm as mine. My feet grow heavier, the trees close in. Finally I stop running and turn to look. I cannot see a face but the way it stands is familiar. It comes closer and does nothing.' },
    { ago: 6, title: 'Waking mid-fall', mood: 'confused', clarity: 2, recurring: true,
      archetypes: [], symbols: ['Falling', 'Stairs'],
      body: 'I am going down a stairwell and the steps get narrower. At some point there is no step and I fall. The fall lasts a long time and there is nothing below me. I wake in my bed without ever seeing the impact, heart going fast.' },
    { ago: 8, title: 'The circle in the garden', mood: 'peaceful', clarity: 4, recurring: false,
      archetypes: ['sage', 'self'], symbols: ['Mandala / Circle', 'Garden', 'House'],
      body: 'I am in a garden I have never seen. An old man shows me the tree at its centre and says, "you planted this." I do not believe him but I do not argue either. Stones around the tree form a complete circle, with a path leaving in each of four directions. He walks away and I stay inside the circle.' },
    { ago: 11, title: 'The unknown room', mood: 'curious', clarity: 3, recurring: false,
      archetypes: ['self', 'mother'], symbols: ['House', 'Door / Threshold', 'Sea / Ocean'],
      body: 'In the flat we have lived in for years I notice a door I have somehow never seen. I open it: the room is completely empty but very bright. There is one window and through it I can see the sea — though our home is far inland. Nothing is in the room, and still I know it has been lived in.' },
    { ago: 14, title: 'Flying, unable to descend', mood: 'joyful', clarity: 4, lucid: true, recurring: false,
      archetypes: ['hero'], symbols: ['Flying', 'Mountain'],
      body: 'I am flying above the city, I do not even need to spread my arms. At first there is an incredible lightness. Then I want to come down and I cannot; however hard I try, the altitude stays exactly the same. People I know are below, looking up at me, but I cannot hear their voices.' },
    { ago: 17, title: 'The snake that sheds', mood: 'confused', clarity: 5, lucid: true, recurring: false,
      archetypes: ['shadow', 'healer'], symbols: ['Snake', 'Water'],
      body: 'A snake winds around my wrist. I wait for it to bite and it does not; it only tightens, without hurting. Then it begins to shed, and the old skin is left in my hand. The skin is as light as paper. The snake enters the water and disappears.' },
    { ago: 21, title: 'Standing on the bridge', mood: 'neutral', clarity: 3, recurring: false,
      archetypes: ['self'], symbols: ['Bridge', 'Sea / Ocean', 'Fire'],
      body: 'I am standing exactly at the middle of a long bridge. Both shores are in fog and I cannot remember which one I came from. Far out on the water something is burning, its smoke rising straight up. I go neither forward nor back; I only look, and it does not feel wrong.' }
  ]
};
