// About page describing what BadgeFactory is
// and how it operates, other links like socials + docs
// currently Navbar has this format
// [twitter] | [discrd] | [tg]
// [home] | [Docs] | [API] (future) | [SDKs] (future)
// [.0 home] | [.0 lnkdIn] | [.0 twitter] <--- (future versions @todo fix when needed)
// This page can be viewed without wallet connection requirement

export default function About() {
  return (
    <div className="flex min-h-[88%] w-[100%] flex-col items-center justify-between mt-4 p-4 bg-bf-comp-bg rounded-xl">
      <h3> BadgeFactory - About Page </h3>
    </div>
  );
}
