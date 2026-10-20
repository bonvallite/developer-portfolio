// Choose one hero image to hint as high priority; avoid blanket preloading.
export function heroPreload(images) {
  const hero = images.find(image => image.isAboveFold && image.isHero);
  return hero ? { href: hero.src, as: "image", fetchpriority: "high" } : null;
}
