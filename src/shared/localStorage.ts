function setStorage(name: string, object: Array<any>) {
  localStorage.setItem(name, JSON.stringify(object));
}

function getStorage(name: string): Array<any> {
  return JSON.parse(localStorage.getItem(name) || "[]");
}

export { getStorage, setStorage };
