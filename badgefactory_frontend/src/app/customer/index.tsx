// Customer Dashboard entry page,
// only for customers, only after signin message is signed
// nextuaht and wallet connection is required to view content
// otherwise error message + loading skeletons or error component indicating what's missing

export default function Customer() {
    return (
      <div className="flex min-h-[88%] w-[100%] flex-col items-center justify-between mt-4 p-4 bg-bf-comp-bg rounded-xl">
        <h3> BadgeFactory - Customer Dashboard </h3>
        <h3> Should only viewed after signin/signup </h3>
      </div>
    );
  }
  