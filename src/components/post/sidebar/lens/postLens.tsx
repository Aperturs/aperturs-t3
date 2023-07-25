
import { useActiveProfile } from '@lens-protocol/react-web';
import React from 'react';
import { Composer } from './Compose';

const PostWeb = ({content}:{content:string}) => {
  const { data, loading } = useActiveProfile();

  if (loading) return <p>Loading...</p>;
  if (data === null) return <button className='btn btn-outline  btn-primary w-full' disabled={true} >Post to Lens</button>;
  if (data === undefined) return <p>undefined</p>;

  return (
    <>
        <Composer publisher={data} content={content} />
    </>
  );
};

export default PostWeb;
