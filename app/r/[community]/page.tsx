import { getCommunityInfoAction } from "@/features/community";
import { CommunityInfoPageClient } from "@/features/community";

interface CommunityInfoPageProps {
  params: Promise<{
    community: string;
  }>;
}

const CommunityInfoPage = async ({ params }: CommunityInfoPageProps) => {
  const { community } = await params;

  const response = await getCommunityInfoAction(community);

  const { community: initialCommunity, viewerContext } = response.data;

  return (
    <CommunityInfoPageClient
      initialCommunity={initialCommunity}
      initialViewerContext={viewerContext}
      communityName={community}
    />
  );
};

export default CommunityInfoPage;
