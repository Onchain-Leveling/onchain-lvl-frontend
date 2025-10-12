"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Home, Activity, CheckSquare, User } from "lucide-react";

export default function BottomNavbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const character = searchParams.get("character") || "degen";

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      active: pathname === "/"
    },
    {
      name: "Activity",
      href: `/activity?character=${character}`,
      icon: Activity,
      active: pathname === "/activity"
    },
    {
      name: "Tasks",
      href: `/tasks?character=${character}`,
      icon: CheckSquare,
      active: pathname === "/tasks"
    },
    {
      name: "Profile",
      href: `/profile?character=${character}`,
      icon: User,
      active: pathname === "/profile"
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all min-w-[60px] ${
                item.active
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${item.active ? "text-blue-600" : "text-gray-600"}`} />
              <span className={`text-xs font-medium ${item.active ? "text-blue-600" : "text-gray-600"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}