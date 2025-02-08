import Link from "@/components/custom/link";

export default function Home() {
  return (
    <div className="flex gap-3">
      <Link href="/">Hello</Link>
      <Link href="https://toakiryu.com">Website</Link>
      <Link href="https://toakiryu.com" isDisabled>isDisabled</Link>
    </div>
  );
}
