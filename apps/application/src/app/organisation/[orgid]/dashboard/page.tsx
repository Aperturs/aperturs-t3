import ContentPage from "~/components/dashboard/ContentPage";

function Dashboard({ params }: { params: { orgid: string } }) {
  return <ContentPage orgId={params.orgid} />;
}

export default Dashboard;
