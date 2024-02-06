import Dropzone from "components/dropzone";
import {
  Code as CodeIcon,
  Download as DownloadIcon,
  Info as InfoIcon,
  XCircle as StartOverIcon,
} from "lucide-react";
import Link from "next/link";

export default function Footer({ events, startOver, handleImageDropped }) {
  return (
    <footer className="w-full my-8">
      <div className="text-center">
        <Link href="/about" className="lil-button">

          <InfoIcon className="icon" />What is this?
        </Link>

        {events.length > 1 && (
          <button className="lil-button" onClick={startOver}>
            <StartOverIcon className="icon" />
            အစကနေပြန်စ
          </button>
        )}

        <Dropzone onImageDropped={handleImageDropped} />

        {events.length > 2 && (
          (<Link
            href={events.findLast((ev) => ev.image).image}
            className="lil-button"
            target="_blank"
            rel="noopener noreferrer">

            <DownloadIcon className="icon" />Download image
          </Link>)
        )}

      
      </div>

      <div className="text-center lil-text mt-8">
      <div className="inline-block py-2 px-4 border border-yellow-200 rounded-lg bg-[#fef6aa]">
      🤔Writtech AI Myanmar မှာ Membership plan များဝယ်ယူအသုံးပြုလိုပါက ဒီလင့်လေးကိုနိပ်ပါ Check out the{" "}
        <Link
          href="https://ai.writtech.com"
          target="_blank">
          README
        </Link>.
      </div>
      </div>

      <div className="text-center lil-text mt-8">
        Powered by{" "}
        <Link href="https://www.facebook.com/infinitytechmyanmar" target="_blank">
          Infinith Tech
        </Link>
        ,{" "}
        <Link
          href="https://infinitai.online"
          target="_blank">
          Infinity AI
        </Link>
        ,{" "}
        <Link href="https://writtech.com" target="_blank">
          Writtech Global
        </Link>
        , and{" "}
        <Link href="https://ai.writtech.com" target="_blank">
          Writtech မြန်မာ
        </Link>
      </div>
    </footer>
  );
}
