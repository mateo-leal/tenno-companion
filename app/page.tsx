export default function Home() {
  const messages = [
    {
      speaker: "Marie",
      text: "iUn viajero parecido a mi! Me haces sonreir. Espero que no mientas para halagarme.",
      tone: "npc-warning",
    },
    {
      speaker: "Marie",
      text: "Simplemente me pregunto, iuestra fe te da paz?",
      tone: "npc",
    },
    {
      speaker: "RuinedKng",
      text: "No lo hace.",
      tone: "player",
    },
    {
      speaker: "Marie",
      text: "Me conmueve profundamente tu honestidad, viajero. Me encantaria volver a hablarte de esto, si me lo permites.",
      tone: "npc-warning",
    },
    {
      speaker: "Marie",
      text: "Solo tengo curiosidad y deseo ayudarte si puedo. Por favor, solo di que no y no volveremos a hablar de esto.",
      tone: "npc",
    },
    {
      speaker: "RuinedKng",
      text: "Por supuesto.",
      tone: "player",
    },
    {
      speaker: "Marie",
      text: "Merci, merci! Hay mucha confianza en lo que me acabas de dar. No la desperdiciare.",
      tone: "npc",
    },
  ];

  const openedApps = [
    { name: "KIM Console", active: false },
    { name: "Historia - Marie", active: true },
    { name: "Pendientes", active: false },
  ];

  return (
    <div className="kim-background min-h-screen text-[#ebdfbf]">
      <main className="mx-auto flex min-h-screen w-full max-w-[1300px] flex-col p-2 sm:p-4">
        <section className="desktop-area relative flex-1 overflow-hidden border border-[#4e3b16] bg-black/45 p-2 sm:p-3">
          <article className="kim-window absolute top-3 left-3 z-20 w-[320px] max-w-[calc(100%-1.5rem)]">
            <header className="window-titlebar">
              <p className="window-title">;Bienvenidos a KIM!</p>
            </header>
            <div className="window-content border-t border-[#8f5d1f] bg-[#060606] p-2">
              <div className="border border-[#8f5d1f] bg-[#0f0903] p-2">
                <p className="font-title text-sm tracking-wide text-[#f0bb5f]">
                  NOMBRE DE USUARIO
                </p>
                <p className="text-3xl leading-none text-[#f4e9cf]">
                  RuinedKng
                </p>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                {["Lotes", "Mapa", "Historia", "Runas"].map((item) => (
                  <button
                    key={item}
                    className="border border-[#8f5d1f] bg-[#1d1308] px-2 py-1 tracking-wider text-[#d4be8a] hover:bg-[#372413]"
                    type="button"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </article>

          <article className="kim-window relative z-30 mt-20 ml-auto flex h-[58svh] w-full max-w-[880px] flex-col md:mt-16 md:mr-10 md:h-[65svh]">
            <header className="window-titlebar">
              <p className="window-title">Historia - Marie.chat</p>
            </header>

            <div className="window-content flex flex-1 flex-col border-t border-[#8f5d1f] bg-[#040404] p-2 sm:p-3">
              <div className="inline-flex w-fit border border-[#8f5d1f] bg-[#101010] px-2 py-1 text-sm text-[#d9d2bc]">
                Me siento mas cerca de Sol.
              </div>

              <div className="mt-3 flex-1 space-y-3 overflow-y-auto border border-[#8f5d1f] bg-black p-2 sm:p-3">
                {messages.map((message, index) => {
                  const toneClass =
                    message.tone === "npc-warning"
                      ? "text-[#f44336]"
                      : message.tone === "player"
                        ? "text-[#f4ede0]"
                        : "text-[#ddd7c9]";

                  return (
                    <article key={`${message.speaker}-${index}`}>
                      <p className="font-title text-2xl text-[#f0bb5f]">
                        {message.speaker}:
                      </p>
                      <p
                        className={`-mt-0.5 text-[1.16rem] leading-snug sm:text-[1.22rem] ${toneClass}`}
                      >
                        {message.text}
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>
          </article>
        </section>

        <footer className="taskbar mt-2 flex flex-wrap items-center gap-2 border border-[#55704e] px-2 py-2 text-[#111a0f] sm:flex-nowrap">
          <button
            type="button"
            className="border border-[#2f402b] bg-[linear-gradient(180deg,#d6e8c8_0,#95b580_100%)] px-3 py-1 font-title text-sm tracking-wider"
          >
            KIM
          </button>

          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 sm:flex-nowrap">
            {openedApps.map((app) => (
              <button
                key={app.name}
                type="button"
                className={`max-w-full truncate border px-2 py-1 text-xs tracking-wide ${
                  app.active
                    ? "border-[#293f2e] bg-[linear-gradient(180deg,#d7ebc9_0,#90ad7f_100%)]"
                    : "border-[#607a5a] bg-[linear-gradient(180deg,#96b285_0,#6f8865_100%)] text-[#e9f0dd]"
                }`}
              >
                {app.name}
              </button>
            ))}
          </div>

          <div className="ml-auto border border-[#3d5840] bg-[linear-gradient(180deg,#c3d8b7_0,#89a57b_100%)] px-3 py-1 text-sm tracking-wider">
            24 ene 1999 | 23:07
          </div>
        </footer>
      </main>
    </div>
  );
}
