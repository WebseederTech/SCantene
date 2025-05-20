// const Loader = () => {
//   return (
//     <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-customBlue border-opacity-50"></div>
//   );
// };

// export default Loader;

import React from "react";
import { FadeLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="flex justify-center items-center">
      <FadeLoader color="#3498db" height={12} width={5} radius={2} margin={2} />
    </div>
  );
};

export default Loader;
