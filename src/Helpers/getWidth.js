export default (size) => {
  if (size <= 414) return 90;
  if (size <= 600) return 85;
  if (size <= 768) return 70;
  if (size <= 1024) return 50;
  if (size <= 1280) return 35;
  if (size <= 1920) return 50;
  return 70;
};
