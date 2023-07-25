import { type ReactElement } from "react";
import { Layout, PostView } from "~/components";

export default function Post() {
  // const router = useRouter()

  return (
    <div>
      <PostView id={1} />
    </div>
  );
}

Post.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
