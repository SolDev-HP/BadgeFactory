import Image from "next/image";
// Landing page will be wrapped in 
// WagmiContext - for wallet connection
// SessionContext - for nextauth - session across protected pages like customer and entity
export default function Home() {
  return (
    <div className="flex min-h-screen w-[100%] flex-col items-center justify-between p-4">
    
      <h3> This is landing page </h3>
      
    </div>
  );
}
