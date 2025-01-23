import { cookies } from "next/headers";
import Bar from "./bar";
import Navbar from "./navbar";

export default function TheBar({ children }: { children: React.ReactNode }) {
  const access_token = cookies().get("authorization")?.value; 

  return (
    <div className="min-h-screen flex">
      {access_token ? (
 
        <div className="flex w-full min-h-screen">
          <Navbar />
          <div className="flex-grow flex-1 bg-gray-100 p-0">{children}</div>
        </div>
      ) : (
  
        <div className="w-full">
          <Bar />
          <div className="p-0">{children}</div>
        </div>
      )}
    </div>
  );
}
