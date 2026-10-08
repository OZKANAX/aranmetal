/**
 * Sağ altta sabit WhatsApp düğmesi. Tıklanınca hazır mesajla wa.me sohbeti yeni sekmede açılır.
 * Numara admin'deki "WhatsApp Numarası" ayarından gelir; boşsa düğme çizilmez.
 */
export function WhatsAppButton({ number, label, message }: { number: string; label: string; message: string }) {
  const digits = number.replace(/\D/g, "");
  if (!digits) return null;
  const href = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group fixed z-40 right-4 sm:right-6 bottom-[calc(var(--ticker-h)+1rem)] flex items-center"
    >
      {/* Masaüstünde üzerine gelince etiket sola doğru açılır */}
      <span className="pointer-events-none mr-3 hidden md:block origin-right scale-x-90 opacity-0 translate-x-2 bg-graphite text-white text-small font-medium px-3.5 py-2 whitespace-nowrap shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)] transition-[opacity,transform] duration-300 ease-out-quint group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-x-100 group-focus-visible:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:scale-x-100">
        {label}
      </span>
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_28px_-10px_rgba(0,0,0,0.55)] transition-[background-color,transform] duration-200 group-hover:bg-[#1ebe5b] group-active:scale-95">
        <svg viewBox="0 0 32 32" aria-hidden="true" className="h-7 w-7 fill-current">
          <path d="M16.004 3C8.832 3 3 8.83 3 16c0 2.29.6 4.53 1.74 6.5L3 29l6.68-1.75A12.96 12.96 0 0 0 16.004 29C23.17 29 29 23.17 29 16S23.17 3 16.004 3Zm0 23.8c-2.02 0-4-.54-5.73-1.57l-.41-.24-3.97 1.04 1.06-3.87-.27-.4A10.76 10.76 0 0 1 5.2 16c0-5.96 4.85-10.8 10.8-10.8 5.96 0 10.8 4.84 10.8 10.8 0 5.95-4.84 10.8-10.8 10.8Zm5.92-8.09c-.32-.16-1.92-.95-2.22-1.06-.3-.11-.51-.16-.73.16-.21.32-.84 1.06-1.03 1.27-.19.22-.38.24-.7.08-.32-.16-1.37-.5-2.6-1.6-.96-.86-1.61-1.92-1.8-2.24-.19-.32-.02-.5.14-.66.15-.14.32-.38.48-.57.16-.19.21-.32.32-.54.11-.21.05-.4-.03-.56-.08-.16-.73-1.76-1-2.41-.26-.63-.53-.55-.73-.56h-.62c-.21 0-.56.08-.86.4-.3.32-1.13 1.1-1.13 2.69 0 1.58 1.16 3.12 1.32 3.33.16.22 2.28 3.48 5.53 4.88.77.33 1.37.53 1.84.68.77.25 1.48.21 2.03.13.62-.09 1.92-.78 2.19-1.54.27-.76.27-1.41.19-1.54-.08-.14-.29-.22-.62-.38Z" />
        </svg>
      </span>
    </a>
  );
}
