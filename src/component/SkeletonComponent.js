import React, { useEffect, useState } from "react";
import { Skeleton } from "@rneui/base";

const SkeletonComponent = ({ Data, children, isAvatar, isButton }) => {
  const [isLoading, setIsLoading] = useState(Boolean);

  // const [Data, children, isAvatar, isButton] = [
  //   skeletonInfo.Data,
  //   skeletonInfo.children,
  //   skeletonInfo.isAvatar,
  //   skeletonInfo.isButton,
  // ];

  // console.log(Data);

  useEffect(() => {
    if (typeof Data === "string") {
      Data.length > 0 ? setIsLoading(false) : setIsLoading(true);
    } else if (typeof Data === "object") {
      const object = Object.keys(Data);
      object.forEach((data) => {
        if (Data[data].length > 0) {
          setIsLoading(false);
          return;
        } else {
          setIsLoading(true);
        }
      });
    }
  }, [Data]);

  const DefaultTextSkeletonComponent = () => {
    return isLoading ? (
      <>
        <Skeleton
          animation="wave"
          circle
          style={{ width: "40%", height: "20%", marginBottom: "2%" }}
        />

        <Skeleton
          animation="wave"
          circle
          style={{ width: "70%", height: "20%" }}
        />
      </>
    ) : (
      <>{children}</>
    );
  };

  const AvatarComponent = () => {
    return isAvatar ? (
      <>
        {isLoading ? (
          <Skeleton circle style={{ width: 40, height: 40 }} />
        ) : (
          children
        )}
      </>
    ) : (
      <DefaultTextSkeletonComponent />
    );
  };

  return isButton ? <>{!isLoading && children}</> : <AvatarComponent />;
};

export default React.memo(SkeletonComponent);

