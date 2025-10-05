"use client";

import * as React from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {type Resolver, useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {FormValues, laptopSchema} from "./schema";

export function LaptopForm({
                               open,
                               onOpenChange,
                               defaults,
                               onSubmit,
                           }: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    defaults: Partial<FormValues>;
    onSubmit: (v: FormValues) => Promise<void>;
}) {
    const form = useForm<FormValues, any, FormValues>({
        resolver: zodResolver(laptopSchema) as Resolver<FormValues>,
        defaultValues: {
            id: 0,
            laptopCode: "",
            officeLicense: "",
            microsoftAccount: "",
            productId: "",
            skuId: "",
            licenseName: "",
            licenseDescription: "",
            betaExpiration: "",
            licenseStatus: "",
            status: "",
            remark: "",
            ...defaults,
        },
        mode: "onChange",
    });

    React.useEffect(() => {
        form.reset({
            id: 0,
            laptopCode: "",
            officeLicense: "",
            microsoftAccount: "",
            productId: "",
            skuId: "",
            licenseName: "",
            licenseDescription: "",
            betaExpiration: "",
            licenseStatus: "",
            status: "",
            remark: "",
            ...defaults,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaults, open]);

    const submit = form.handleSubmit(async (values) => {
        await onSubmit(values);
        onOpenChange(false);
    });

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-3xl overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{(defaults?.id ?? 0) > 0 ? "编辑" : "新增"}</SheetTitle>
                    <SheetDescription>请输入笔记本授权信息。</SheetDescription>
                </SheetHeader>
                <div className="py-4">
                    <Form {...form}>
                        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(Object.keys(laptopSchema.shape) as (keyof FormValues)[])
                                .filter((k) => k !== "id")
                                .map((key) => (
                                    <FormField
                                        key={String(key)}
                                        control={form.control}
                                        name={key as any}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>{String(key)}</FormLabel>
                                                <FormControl>
                                                    {key === "remark" || key === "licenseDescription" ? (
                                                        <Textarea rows={4} {...field} />
                                                    ) : (
                                                        <Input {...field} />
                                                    )}
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            <SheetFooter className="col-span-full mt-2">
                                <div className="flex gap-2">
                                    <Button type="submit">确 定</Button>
                                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                        取 消
                                    </Button>
                                </div>
                            </SheetFooter>
                        </form>
                    </Form>
                </div>
            </SheetContent>
        </Sheet>
    );
}
