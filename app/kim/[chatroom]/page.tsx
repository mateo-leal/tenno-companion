export default async function Page({ params }: PageProps<'/kim/[chatroom]'>) {
  const { chatroom } = await params

  return (
    <article className="kim-window relative z-10 mt-20 ml-auto flex h-[58svh] w-full max-w-220 flex-col md:mt-16 md:mr-10 md:h-[65svh]">
      <header className="window-titlebar">
        <p className="capitalize text-2xl">{chatroom}</p>
      </header>

      <div className="window-content flex flex-1 flex-col border-t border-[#8f5d1f] bg-[#040404] p-2 sm:p-3">
        <div className="mt-3 flex-1 space-y-3 overflow-y-auto border border-[#8f5d1f] bg-black p-2 sm:p-3">
          {/* {messages.map((message, index) => {
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
                })} */}
        </div>
      </div>
    </article>
  )
}
