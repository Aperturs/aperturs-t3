import { useState, type ReactElement } from "react";
import { CommitsTable, Layout, ProjectLayout } from "~/components";

export interface TableRow {
  id: number;
  message: string;
  author: string;
  date: string;
}

const CommitsPage = () => {
  const [commits, setCommits] = useState([]);
  const [tableRows, setTableRows] = useState([
    {
      id: 1,
      message: "Initial commit",
      author: "John Doe",
      date: "2021-08-01",
    },
    {
      id: 2,
      message: "Add login page",
      author: "John Doe",
      date: "2021-08-02",
    },
  ] as TableRow[]);

  return (
    <div className="">
      <CommitsTable rows={tableRows} />
    </div>
  );
};

CommitsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <ProjectLayout>{page}</ProjectLayout>
    </Layout>
  );
};

export default CommitsPage;
