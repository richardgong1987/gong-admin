import {toast} from "sonner"
import {HTTP_STATUS, PAGES} from "@/lib/constant";
import {unknown} from "zod";
import {USER_STORAGE_KEY} from "@/store/constant";


export interface CommonResponse<T = any> {
    code: number;
    msg: string;
    data?: T;
}


export class HttpService {
    static IMAGE_HOST = process.env.NEXT_PUBLIC_IMG_HOST;

    public getHeaders() {
        return {
            "Content-Type": "application/json",
            "x-token": HttpService.getToken(),
        };
    }

    static getToken(): string {
        let token = "";
        try {
            const sessionData = sessionStorage.getItem(USER_STORAGE_KEY);
            if (sessionData) {
                const parsed = JSON.parse(sessionData);
                token = parsed?.state?.token || "";
                return token;
            }
        } catch (err) {
            console.warn("Failed to parse user token from sessionStorage:", err);
        }
        return ""
    }

    private wrapUrl(url: string) {
        if (!url.startsWith("/api/")) {
            if (url.startsWith("/")) {
                url = url.slice(1);
            }
            return `/api/${url}`;
        }
        return url;
    }

    private async request<T>(method: "GET" | "POST" | "PUT" | "DELETE", url: string, data?: any, needStringfy = true): Promise<T> {
        const options: RequestInit = {
            method,
            headers: this.getHeaders(),
            credentials: "include",
        };


        if (data && ({"GET": false, "DELETE": false, "POST": true, "PUT": true}[method])) {
            if (needStringfy) {
                options.body = JSON.stringify(data);
            } else {
                options.body = data;
            }
        }

        try {
            const response = await fetch(this.wrapUrl(url), options);
            if (response.status == HTTP_STATUS.UNAUTHORIZED) {
                location.href = PAGES.LOGIN
                return unknown as T;
            }
            const result: any = await response.json();


            if (result.code !== 0) {
                toast.error(result.msg || "エラーが発生しました");
                return result;
            }

            const newToken = response.headers.get("new-token");
            const newExpiresAt = response.headers.get("new-expires-at");
            if (newToken) {
                try {
                    const sessionData = sessionStorage.getItem(USER_STORAGE_KEY);
                    if (sessionData) {
                        const parsed = JSON.parse(sessionData);
                        parsed.state.token = newToken;
                        parsed.expiresAt = newExpiresAt;
                        sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(parsed));
                        console.log("✅ sessionStorage 中的 token 已自动更新");
                    }
                } catch (err) {
                    console.warn("❌ 更新 token 失败:", err);
                }
            }
            return result;
        } catch (error) {
            console.error("Network Error:", error);
            // toast.error("ネットワークエラー: サーバーに接続できませんでした");
            // @ts-ignore
            return {code: -1, msg: "Network Error"};
        }
    }

    public GET<T>(url: string): Promise<T> {
        return this.request<T>("GET", url);
    }

    public DELETE<T>(url: string): Promise<T> {
        return this.request<T>("GET", url);
    }

    public POST<T>(url: string, data: any): Promise<T> {
        return this.request<T>("POST", url, data);
    }

    public Upload<T>(url: string, data: any): Promise<T> {
        return this.request<T>("POST", url, data, false);
    }

    public PUT<T>(url: string, data: any): Promise<T> {
        return this.request<T>("PUT", url, data);
    }

    async getNoticeList(): Promise<any[]> {
        const res: any = await this.GET<{ list: any[] }>("/info/getInfoPublic");
        if (res.code === 0 && res.data?.list?.length) {
            return res.data.list.map((item: any) => ({
                ...item,
                title: item.title.replace(/\\"/g, '"'),
                content: item.content.replace(/\\"/g, '"'),
            }));
        }
        return [];
    }
}

// 单例导出
export const httpService = new HttpService();
