/**
 * Site-wide announcement banner — edit messages and styles below.
 */
type BannerMessage = {
  bold: string;
  rest: string;
};

const BANNER_MESSAGES: BannerMessage[] = [
  { bold: "We're open 24 hrs this weekend!", rest: "Sat, Jun 20 & Sun, Jun 21." },
  { bold: "¡Abierto 24 horas este fin de semana!", rest: "Sáb 20 y Dom 21 de Jun." },
  { bold: "We're open 24 hrs this weekend!", rest: "Sat, Jun 20 & Sun, Jun 21." },
  { bold: "¡Abierto 24 horas este fin de semana!", rest: "Sáb 20 y Dom 21 de Jun." },
];

const LOOP_MESSAGES = [...BANNER_MESSAGES, ...BANNER_MESSAGES];

function BannerMessageText({ bold, rest }: BannerMessage) {
  return (
    <span>
      <span className="font-bold">{bold}</span>
      {' '}
      {rest}
    </span>
  );
}

export function AnnouncementBanner() {
  return (
    <div className="announcement-banner bg-[#FFD600] text-black py-2.5 text-sm">
      <div className="announcement-banner__track">
        {LOOP_MESSAGES.map((message, index) => (
          <p
            key={index}
            className="announcement-banner__content"
            aria-hidden={index >= BANNER_MESSAGES.length}
          >
            <BannerMessageText {...message} />
          </p>
        ))}
      </div>
    </div>
  );
}
