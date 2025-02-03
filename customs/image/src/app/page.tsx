"use client";

import Image from "@/components/custom/image";

export default function Home() {
  return (
    <div className="w-full h-dvh">
      <div className="flex justify-center items-center">
        <Image
          alt="Image"
          src="/wp-content/icon.png"
          width={100}
          height={100}
          priority
          quality={1}
        />
      </div>
    </div>
  );
}
