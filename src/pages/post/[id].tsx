import { useRouter } from "next/router";
import { useEffect, useMemo, useState, type ReactElement } from "react";
import { shallow } from "zustand/shallow";
import { Layout, PostView } from "~/components";
import LogoLoad from "~/components/custom/loading/logoLoad";
import { useStore } from "~/store/post-store";
import { api } from "~/utils/api";

export default function Post() {
  // const router = useRouter()

  const router = useRouter();
  const { id } = router.query;
  // const { data, isLoading, error } = api.userPost.getSavedPostById.useQuery(
  //   id as string
  // );
  const [loading, setLoading] = useState(true);
  const { setContent, setDefaultContent, setShouldReset } = useStore(
    (state) => ({
      setDefaultContent: state.setDefaultContent,
      defaultContent: state.defaultContent,
      setContent: state.setContent,
      setShouldReset: state.setShouldReset,
    }),
    shallow
  );

  const getData = api.savepost.getSavedPostById.useQuery(id as string);

  const fetchData = useMemo(() => {
    return () => {
      try {
        const data = getData.data;
        if (!data) return;
        const defaultContent = data.defaultContent;
        setDefaultContent(defaultContent);
        const localContent = data.content as unknown as PostContent[];
        setContent(localContent);
        setShouldReset(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  }, [getData.data, setDefaultContent, setContent, setShouldReset]);

  useEffect(() => {
    fetchData();

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2-second delay

    return () => {
      clearTimeout(timeout);
    };
  }, [fetchData]);

  if (loading || getData.isLoading) return <LogoLoad size="24" />;
  if (getData.error) return <div>{getData.error.message}</div>;

  return (
    <div>
      <PostView />
    </div>
  );
}

Post.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
