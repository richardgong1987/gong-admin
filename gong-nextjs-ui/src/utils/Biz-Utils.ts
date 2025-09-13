export enum BIZ_TYPE {
  SJ = "sj",
  JD = "jd",
  RY = "ry",
}

export class BizUtils {
  static formatJpDatetime(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }
}

export function deepCopy(obj: any): any {
  return JSON.parse(JSON.stringify(obj));
}

//设置sessionStorage
export function SetSessionStorage(key: string, value: any): void {
  if (key) {
    if (value.constructor !== String) {
      value = JSON.stringify(value);
    }
    sessionStorage.setItem(key, value);
  }
}

//获取sessionStorage
export function GetSessionStorage(key: string): any {
  if (typeof sessionStorage == "undefined") {
    return "";
  }
  const item = sessionStorage.getItem(key);
  if (item) {
    try {
      JSON.parse(item);
    } catch (e) {
      return item;
    }
  }
  return item && JSON.parse(item);
}

//删除sessionStorage
export function RemoveSessionStorage(key: string): void {
  if (key) {
    sessionStorage.removeItem(key);
  }
}

export function formatDateToYYYYMMDD() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(currentDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}年${month}月${day}日`;
  return formattedDate;
}

export function toQueryParam(obj: any) {
  return Object.keys(obj)
    .filter((key) => obj[key] !== undefined && obj[key] !== "")
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join("&");
}
