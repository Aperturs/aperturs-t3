import { useRouter } from "next/router";
import { useEffect, useMemo, useState, type ReactElement } from "react";
import { shallow } from "zustand/shallow";
import { Layout, PostView } from "~/components";
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
  const { setContent, setDefaultContent, setSelectedSocials, setShouldReset } =
    useStore(
      (state) => ({
        setDefaultContent: state.setDefaultContent,
        defaultContent: state.defaultContent,
        setContent: state.setContent,
        setSelectedSocials: state.setSelectedSocials,
        setShouldReset: state.setShouldReset,
      }),
      shallow
    );

  // useEffect(() => {
  //   // if (data) {
  //   //   let localSocialsSelected = [] as SelectedSocial[];
  //   //   const localContent = [] as PostContent[];
  //   //   data.content.forEach((item) => {
  //   //     if (item.socialSelected) {
  //   //       const socialSelected =
  //   //         item.socialSelected as unknown as SelectedSocial[];
  //   //       if (socialSelected.length > 1) {
  //   //         localSocialsSelected = socialSelected;
  //   //         setDefaultContent(item.content);
  //   //       } else if(socialSelected.length === 1) {
  //   //         const selectedSocialIndividual =
  //   //           socialSelected[0] as SelectedSocial;
  //   //         localSocialsSelected.push(selectedSocialIndividual);
  //   //         localContent.push({
  //   //           id: selectedSocialIndividual.id,
  //   //           content: item.content,
  //   //           socialType: selectedSocialIndividual.type,
  //   //           name: selectedSocialIndividual.name,
  //   //         });
  //   //       }
  //   //     }
  //   //   });
  //   //   setSelectedSocials(localSocialsSelected);
  //   //   setContent(localContent);
  //   //   console.log(content,"content")
  //   // }

  //   if(data){
  //     const defaultContent = data.defaultContent as string;
  //     setDefaultContent(defaultContent);
  //     const localSocialsSelected = data.socialSelected as unknown as SelectedSocial[];
  //     setSelectedSocials(localSocialsSelected);
  //     const localContent = data.content as unknown as PostContent[];
  //     setContent(localContent);
  //   }
  //   setLoading(false);
  // }, [data, setContent, setDefaultContent, setSelectedSocials]);
  const getData = api.userPost.getSavedPostById.useQuery(id as string);

  const fetchData = useMemo(() => {
    return () => {
      try {
        const data = getData.data;
        if (!data) return;
        const defaultContent = data.defaultContent as string;
        console.log(defaultContent);
        setDefaultContent(defaultContent);
        const localSocialsSelected =
          data.socialSelected as unknown as SelectedSocial[];
        console.log(localSocialsSelected);
        setSelectedSocials(localSocialsSelected);
        const localContent = data.content as unknown as PostContent[];
        console.log(localContent);
        setContent(localContent);
        setShouldReset(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  }, [
    getData.data,
    setDefaultContent,
    setSelectedSocials,
    setContent,
    setShouldReset,
  ]);

  useEffect(() => {
    setLoading(true);
    fetchData();
    setLoading(false);
    return () => {
      // Cleanup if needed
    };
  }, [fetchData]);

  if (loading) return <div>Loading...</div>;
  // if (error) return <div>{error.message}</div>;

  return (
    <div>
      <PostView />
    </div>
  );
}

Post.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
