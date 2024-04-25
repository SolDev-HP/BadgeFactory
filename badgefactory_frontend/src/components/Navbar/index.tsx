// Navbar Design plan
// -------------------------------------------------------
// |  [icon]-bfactory_logo                  [wallet_btn] |
// |                --------------------------------------
// | [icn] home     |
// | [icn] CustDash |
// | [icn] EntityDsh|
// | [icn] about    |           Page/Route Content
// | [icn] contract |           (practically, props items/components)
// |                |
// |                |
// |                |
// |    [socials]   |
// ------------------

import React from "react";
import Logo from "../Logo"; // BadgeFactory text full logo with badgefactory icon

// export default function Navbar({ children } : { children : React.ReactNode }) {
//     return (<>{children}</>)
// }
export default function Navbar({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="w-full min-w-[600px] h-screen min-h-screen">
        {/**Max width component + height fixed - contains logo + wallet button */}
        <div className="w-full min-w-[600px] h-[64px] min-h[64px] bg-bf-comp-bg flex flex-row flex-nowrap justify-between pl-10 pr-10 pt-2 pb-2">
          <Logo />
        </div>
        <div className="w-[100%] flex flex-row flex-nowrap gap-1">
          {" "}
          {/** this is about sidebar and main content = children param */}
          <aside className="w-[260px] min-w-[260px] float-left bg-bf-comp-bg sticky top-0 max-h-screen h-screen px-4 py-4 shadow-md"></aside>
          <div className="w-[80%] min-w-[600px]">
            <main className="py-4 px-4">
              <h1>Testing Page Title Here</h1>
              {children}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
