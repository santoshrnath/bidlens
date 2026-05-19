import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="grid min-h-[70vh] place-items-center px-4">
      <SignIn appearance={{ variables: { colorPrimary: "#7c5cff" } }} />
    </div>
  );
}
