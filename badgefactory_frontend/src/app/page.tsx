import Image from "next/image";
// Landing page will be wrapped in
// WagmiContext - for wallet connection
// SessionContext - for nextauth - session across protected pages like customer and entity
export default function Home() {
  return (
    <div className="flex min-h-[88%] w-[100%] flex-col items-center justify-between mt-4 p-4 bg-bf-comp-bg rounded-xl">
      <h3> This is landing page, under-construction page </h3>
    </div>
  );
}
