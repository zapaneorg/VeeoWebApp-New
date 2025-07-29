export const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.1, delayChildren: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

export const cardHover = {
  scale: 1.03,
  boxShadow: "0px 10px 20px rgba(0,0,0,0.05)",
  transition: { type: "spring", stiffness: 300 }
};