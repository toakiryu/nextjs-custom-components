"use client";

import Image from "@/components/custom/image";

export default function Home() {
  return (
    <div className="w-full h-dvh p-5">
      <div className="flex flex-wrap gap-5 justify-center items-center">
        <Image
          alt="Image"
          src="/wp-content/3ae6f47b-fdff-45b6-976d-4b33addd1cf5.jpeg"
          width={100}
          classNames={{
            base: "w-full"
          }}
        />
        <Image
          alt="Image"
          src="/wp-content/3ae6f47b-fdff-45b6-976d-4b33addd1cf5.jpeg"
          width={100}
          height={100}
          classNames={{
            base: "w-full"
          }}
        />
        <Image
          alt="Image"
          src="/wp-content/3ae6f47b-fdff-45b6-976d-4b33addd1cf5.jpeg"
          width={200}
          height={200}
        />
        <Image
          alt="Image"
          src="/wp-content/3ae6f47b-fdff-45b6-976d-4b33addd1cf5.jpeg"
          width={300}
          height={300}
        />
        <Image
          alt="Image"
          src="/wp-content/3ae6f47b-fdff-45b6-976d-4b33addd1cf5.jpeg"
          width={400}
          height={400}
        />
      </div>
    </div>
  );
}
