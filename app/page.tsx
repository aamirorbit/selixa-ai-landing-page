import { Background } from "@/components/Background";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";

/** Set to "/background.jpg" (file in /public) when the artwork is ready. */
const BACKGROUND_IMAGE: string | null = null;

export default function Home() {
  return (
    <main className="relative flex min-h-dvh flex-1 flex-col overflow-x-clip">
      <Background src={BACKGROUND_IMAGE} />
      <div className="relative z-10 mx-auto flex w-full max-w-[1536px] flex-1 flex-col px-6 sm:px-10 lg:px-12 xl:px-[57px]">
        <Nav />
        <Hero />
      </div>
    </main>
  );
}
