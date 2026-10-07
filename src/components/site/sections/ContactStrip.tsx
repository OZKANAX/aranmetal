import type { Dictionary } from "@/i18n/get-dictionary";
import type { SectionContent } from "@/lib/content/schema";

/** İletişim bilgileri: üç sütun, ince dikey çizgilerle ayrılmış */
export function ContactStrip({
  general,
  dict,
}: {
  c?: SectionContent<"contact">;
  general: SectionContent<"general">;
  dict: Dictionary;
}) {
  const tel = general.phone.replace(/[^\d+]/g, "");

  return (
    <section className="w-full bg-paper pt-16 lg:pt-20 pb-16 lg:pb-20" id="contact">
      <div className="page-x">
        <dl className="grid grid-cols-1 md:grid-cols-3 md:divide-x divide-rule border-y border-rule">
          <Item label={dict.contact.emailLabel}>
            <a className="hover:text-copper transition-colors break-all" href={`mailto:${general.email}`}>
              {general.email}
            </a>
          </Item>
          <Item label={dict.contact.phoneLabel}>
            <a className="tnum hover:text-copper transition-colors" href={`tel:${tel}`}>
              {general.phone}
            </a>
          </Item>
          <Item label={dict.contact.addressLabel}>
            <address className="not-italic text-body font-normal text-ink-2">{general.address}</address>
          </Item>
        </dl>
      </div>
    </section>
  );
}

function Item({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="py-8 md:px-8 first:md:pl-0 border-b md:border-b-0 border-rule last:border-b-0">
      <dt className="text-caption text-ink-3">{label}</dt>
      <dd className="mt-3 text-subheading text-ink">{children}</dd>
    </div>
  );
}
