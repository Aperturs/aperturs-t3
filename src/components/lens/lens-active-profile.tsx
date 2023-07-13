import { useActiveProfile } from '@lens-protocol/react-web';

export function MyProfile() {
  const { data, error, loading } = useActiveProfile();

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error: {error.message}</p>;

  if (data === null) return <p>No active profile</p>;

  return (
    <div>
      <p>Active profile: {data.handle}</p>
    </div>
  );
}
