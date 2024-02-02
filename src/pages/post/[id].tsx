import { useRouter } from "next/router";
import { useEffect, useMemo, useState, type ReactElement } from "react";
import { shallow } from "zustand/shallow";
import { Layout, PostView } from "~/components";
import LogoLoad from "~/components/custom/loading/logoLoad";
import { useStore } from "~/store/post-store";
import { type PostContentType } from "~/types/post-types";
import { api } from "~/utils/api";

export default function Post() {
  // const router = useRouter()

  const router = useRouter();
  const { id } = router.query;
  // const { data, isLoading, error } = api.userPost.getSavedPostById.useQuery(
  //   id as string
  // );
  const [loading, setLoading] = useState(true);
  const { setContent, setShouldReset } = useStore(
    (state) => ({
      setContent: state.setContent,
      setShouldReset: state.setShouldReset,
    }),
    shallow
  );

  const getData = api.savepost.getSavedPostById.useQuery(id as string);

  const fetchData = useMemo(() => {
    return () => {
      try {
        console.log("runing fetchData");
        const data = getData.data;
        if (!data) return;
        const localContent = data.content;

        setContent(localContent);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  }, [getData.data]);

  useEffect(() => {
    setShouldReset(true);
    fetchData();
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000); // 2-second delay

    return () => {
      clearTimeout(timeout);
    };
  }, [fetchData, setShouldReset]);

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
