import { Switch } from "@headlessui/react";
import { useEffect, useRef, useState } from "react";

// Aşağıdaki Toggle bileşeni aç/kapat anahtarı (switch) olarak çalışmaktadır.
// Ancak şu anda bazı eksiklikler ve iyileştirilmesi gereken noktalar bulunmaktadır.
// Amacınız useRef kullanarak bileşeni daha sağlam ve kontrollü hale getirmektir.

// ✅ useRef kullanarak bileşenin önceki durumunu saklayın ve console.log ile her değişimde eski ve yeni değeri yazdırın.
// ✅ Toggle değişimlerini takip etmek için useRef kullanarak bir sayaç oluşturun (kaç kere açılıp kapandığını takip edin).
// ✅ useRef ile bileşene odaklanmayı sağlayın. Toggle bileşeni ilk yüklendiğinde otomatik olarak odaklansın.
// ✅ Toggle durumunun son halini kaydetmek için bir useRef değişkeni oluşturun ve bileşen kapandığında son durumu localStorage’a kaydedin.
// ✅ useRef ile bir DOM referansı oluşturarak, toggle bileşenine her tıklandığında hafifçe büyümesini sağlayın (örn: scale animasyonu).

// Bonus:
// ✨ Toggle açık/kapalı durumunda bileşenin genişliğini değiştirin:
//    - Açıkken w-16, kapalıyken w-11 olacak şekilde dinamik genişlik ayarlayın.
// ✨ Toggle değiştiğinde ikon değişimi ekleyin:
//    - Açıkken bir "güneş" ikonu (🌞), kapalıyken bir "ay" ikonu (🌙) gösterin.
// ✨ Butona basıldığında küçük bir vibrate efekti ekleyin (animate-wiggle gibi özel Tailwind animasyonu oluşturun).
// ✨ Switch'in durumuna göre arkaplanına blur ve backdrop-filter efekti ekleyerek cam efekti verin (backdrop-blur-md gibi).
// ✨ Toggle butonuna "arka plan değişimi" efekti ekleyin:
//    - Buton kapalıysa mat renkler, açık olduğunda gradient bir arka plan oluşturun.
// ✨ Kullanıcının Tab tuşuyla navigasyon yapabilmesini sağlamak için Tailwind’in focus-visible özelliklerini kullanın.
// ✨ peer özelliğini kullanarak toggle açıkken yanında ekstra bir bilgi gösterecek şekilde geliştirin (örn: "Premium aktif")

export default function Toggle() {
  const switchRef = useRef(null); // DOM referansı için.
  const previousStateRef = useRef(null); // Önceki durumu saklamak için.
  const toggleRef = useRef(
    JSON.parse(localStorage.getItem("toggleState")) || true
  ); // localStorage'dan okuma.
  const [enabled, setEnabled] = useState(toggleRef.current); // Bileşenin anlık durumu.
  const times = useRef(0); // Kaç kez tıklandığını izlemek için.

  useEffect(() => {
    switchRef.current.focus(); // Bileşen yüklendiğinde odağı sağlama.
  }, []);

  useEffect(() => {
    localStorage.setItem("toggleState", JSON.stringify(enabled)); // Durumu localStorage'a kaydetme.
  }, [enabled]);

  const handleToggle = () => {
    previousStateRef.current = toggleRef.current; // Önceki durumu saklama.
    toggleRef.current = !toggleRef.current; // Yeni durumu güncelleme.
    setEnabled(toggleRef.current);

    console.log("Önceki Durum:", previousStateRef.current);
    console.log("Yeni Durum:", toggleRef.current);

    times.current = times.current + 1; // Tıklanma sayısını artırma.
    console.log(`${times.current} Kez çalıştırıldı`);

    // Hafif büyütme için animasyon tetiklenebilir.
    if (switchRef.current) {
      switchRef.current.style.transform = "scale(1.1)";
      setTimeout(() => {
        switchRef.current.style.transform = "scale(1)";
      }, 200);
    }
  };

  return (
    <div className="p-8 flex justify-center">
      <Switch.Group as="div" className="flex items-center">
        <Switch
          checked={enabled}
          onChange={handleToggle}
          className={classNames(
            enabled ? "bg-indigo-600" : "bg-gray-200",
            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
          )}
          ref={switchRef}
        >
          <span
            aria-hidden="true"
            className={classNames(
              enabled ? "translate-x-5" : "translate-x-0",
              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
            )}
          />
        </Switch>
        <Switch.Label as="span" className="ml-3 text-sm">
          <span className="font-medium text-gray-900">Yıllık fatura</span>{" "}
          <span className="text-gray-500">(%10 Tasarruf Edin)</span>
        </Switch.Label>
      </Switch.Group>
    </div>
  );
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
