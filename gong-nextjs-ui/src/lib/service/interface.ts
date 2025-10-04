import {z} from "zod";

type EntityOf<S extends z.ZodTypeAny> = z.infer<S>;

export interface BizService<S extends z.ZodTypeAny> {
    create: (payload: Omit<EntityOf<S>, "id">) => Promise<{ code: number } | void>;
    delete: (id: number) => Promise<{ code: number } | void>;
    deleteByIds: (ids: number[]) => Promise<{ code: number } | void>;
    update: (payload: EntityOf<S>) => Promise<{ code: number } | void>;
    find: (
        id: number
    ) => Promise<{ code: number; data: EntityOf<S> } | EntityOf<S>>;
    list: (
        params: { page: number; pageSize: number } & Partial<EntityOf<S>>
    ) => Promise<{
        code?: number;
        data?: {
            list: EntityOf<S>[];
            total: number;
            page: number;
            pageSize: number;
        };
        list?: EntityOf<S>[];
        total?: number;
        page?: number;
        pageSize?: number;
    }>;
}
