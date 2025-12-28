import { Globe, Eye, Lock } from "lucide-react";
import { CommunityPage } from "../../types";

interface CommunityInfoAboutProps {
  community: CommunityPage;
}

export const CommunityInfoAbout = ({ community }: CommunityInfoAboutProps) => {
  const getVisibilityIcon = () => {
    switch (community.visibility) {
      case "PUBLIC":
        return <Globe className="h-4 w-4" />;
      case "RESTRICTED":
        return <Eye className="h-4 w-4" />;
      case "PRIVATE":
        return <Lock className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const getVisibilityLabel = () => {
    switch (community.visibility) {
      case "PUBLIC":
        return "Public";
      case "RESTRICTED":
        return "Restricted";
      case "PRIVATE":
        return "Private";
      default:
        return "Public";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">About Community</h2>
        <p className="text-muted-foreground">
          {community.description || "No description provided"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold">Details</h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-muted-foreground">Visibility</span>
              <div className="flex items-center gap-2 mt-1">
                {getVisibilityIcon()}
                <span>{getVisibilityLabel()}</span>
              </div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Created</span>
              <p className="mt-1">{new Date(community.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Community ID</span>
              <p className="mt-1 font-mono text-sm">{community.id}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Members</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Members</span>
              <span className="font-medium">{community.counts.members}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Moderators</span>
              <span className="font-medium">{community.counts.moderators}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Followers</span>
              <span className="font-medium">{community.counts.followers}</span>
            </div>
          </div>
        </div>
      </div>

      {community.rules && community.rules.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Rules</h3>
          <div className="space-y-2">
            {community.rules.map((rule, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="font-medium text-muted-foreground">{index + 1}.</span>
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
