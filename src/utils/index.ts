export const transformArrToJson = (arr: Array<any>) => {
  return arr.map(obj => obj.toJSON())
}

// Generate message id with snowflake
export const generateId = async (uid) => {
  return { uid, genId: await uid.asyncGetUniqueID() }
}

export function extractURLs(str: string) {
  let arr = []
  if (!str)
    return arr

  const urls = str.match(/((((ftp|https?):\/\/)|(w{3}\.))[\-\w@:%_\+.~#?,&\/\/=]+)/g);
  if (urls) {
    urls.forEach(function (url) {
      arr.push(url)
    });
  }
  return arr;
}


export const isValidUrl = urlString => {
  let url: any;
  try {
    url = new URL(urlString);
  }
  catch (e) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}