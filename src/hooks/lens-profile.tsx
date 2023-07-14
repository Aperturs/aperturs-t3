import { useActiveProfile } from '@lens-protocol/react-web';
import { useState, useEffect } from 'react';

function useLensProfile() {
  const { data: LensData, error: lensError, loading: lensLoading } = useActiveProfile();
  const [profile, setProfile] = useState({ name: '', id: '', imageUrl: '' });

  useEffect(() => {
    if (LensData) {
      let LensProfileUrl;
      let lensProfilePic = LensData?.picture;
      if(lensProfilePic)
      if (typeof lensProfilePic === "string") {
        LensProfileUrl = lensProfilePic;
      } else if (lensProfilePic.__typename === "NftImage") {
        LensProfileUrl = lensProfilePic.uri; // replace `uri` with the actual property name
      } else if (lensProfilePic.__typename === "MediaSet") {
        // MediaSet might contain multiple media items. This code assumes you want the URL of the first item.
        LensProfileUrl = lensProfilePic.original.url // replace `original.url` with the actual property names
      }

      setProfile({
        name: LensData.name || LensData.id, // replace `name` with the actual property name
        id: LensData.id, // replace `id` with the actual property name
        imageUrl: LensProfileUrl || '/user.png', // replace `url` with the actual property name
      });
    }
  }, [LensData]);

  return { profile, loading: lensLoading, error: lensError };
}

export default useLensProfile;
