import { GlassLogin } from "@/components/ui/liquid-glass-login";

export default function GlassLoginDemo() {
  return (
    <GlassLogin>
      {/* behind the card, so the glass bends it when you drag the card over */}
      <p className="absolute inset-x-0 bottom-0 m-0 p-4 text-center text-[12px] text-white/60 [text-shadow:0_1px_4px_rgb(0_0_0/0.8)]">
        by{" "}
        <a
          href="https://aakashmehra.com/ref/glasslogin"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/80 underline-offset-4 hover:underline"
        >
          aakashmehra.com
        </a>
      </p>
    </GlassLogin>
  );
}

