import { useState } from "react";
import UserPosts from "./AllUserPosts";
import Followers from "./Followers";
import Following from "./Following";

export default function ProfileTabs({ userId }) {
  const [activeTab, setActiveTab] = useState("posts");

  const tabs = [
    { key: "posts", label: "Posts" },
    { key: "followers", label: "Followers" },
    { key: "following", label: "Following" },
  ];

  return (
    <div>
      <div className="flex justify-center gap-6 mb-6 border-b border-accent/20">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-2 font-semibold ${
              activeTab === tab.key
                ? "text-primary border-b-2 border-primary"
                : "text-accent hover:text-secondary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === "posts" && <UserPosts userId={userId} />}
        {activeTab === "followers" && <Followers userId={userId} />}
        {activeTab === "following" && <Following userId={userId} />}
      </div>
    </div>
  );
}
