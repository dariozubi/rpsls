export function getSalt(address: string) {
  const array = new Uint32Array(1);
  self.crypto.getRandomValues(array);
  localStorage.setItem(address, array[0].toString());
  return BigInt(array[0]);
}

export function reduceAddress(address: string) {
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 5
  )}`;
}
