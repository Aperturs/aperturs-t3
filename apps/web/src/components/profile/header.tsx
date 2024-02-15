import React from "react";

const ProfileHeader = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div
        className="h-[30vh] w-full  rounded-xl bg-cover bg-center bg-no-repeat p-8"
        style={{
          backgroundImage: "url(gradbg.png)",
          //set cover
        }}
      ></div>
      <div className="glassMorphism m-[-7vh] flex w-[95%] justify-between rounded-full p-4 ">
        <div className="flex">
          <img
            className="rounded-xl shadow-md "
            src={"profile.png"}
            width={65}
            height={50}
            alt="profile"
          />
          <div className="ml-6 flex flex-col justify-center">
            <h1 className="text-xl font-medium text-gray-600">Test</h1>
            <h1 className="text-sm font-medium text-gray-500">
              UI/UX Designer
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
