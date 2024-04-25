// Entity Dashboard entry page,
// only for entity registrants, only after signin message is signed
// nextuaht and wallet connection is required to view content
// otherwise error message - same as /customer protected page

export default function Entity() {
    return (
      <div className="flex min-h-[88%] w-[100%] flex-col items-center justify-between mt-4 p-4 bg-bf-comp-bg rounded-xl">
        <h3> BadgeFactory - Entity Dashboard </h3>
        <h3> Should only viewed after signin/signup </h3>
      </div>
    );
  }
  