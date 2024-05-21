import React from "react";

import styles from "./FullScreenLoader.module.css";

import { MoonLoader } from "react-spinners";

interface Props {
  loading?: boolean;
}

const FullScreenLoader: React.FC<Props> = ({ loading }) => {
  return (
    <div className="z-50">
      {loading && (
        <div className={styles.loadingContainer}>
          <div className="z-50">
            <MoonLoader color="#ff4081" size={100} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FullScreenLoader;
