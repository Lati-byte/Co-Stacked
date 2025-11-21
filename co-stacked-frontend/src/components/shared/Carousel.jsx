import React from "react";
import styles from "./Carousel.module.css";

export const Carousel = ({ items, renderItem }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className={styles.carouselWrapper}>
      <div className={styles.carouselTrack}>
        {items.map((item) => (
          <div className={styles.carouselSlide} key={item._id}>
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
};