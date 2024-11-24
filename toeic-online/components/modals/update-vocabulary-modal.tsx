"use client";
import { RootState } from "@/lib/store/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Input } from "@/components/ui/input";
import { z } from "zod";

import { closeModal } from "@/lib/store/modal-slice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { ok } from "assert";

const formSchema = z.object({
  word: z.string().min(2, { message: "Từ mới phải có ít nhất 2 ký tự." }),
  mean: z.string().min(2, { message: "Định nghĩa phải có ít nhất 2 ký tự." }),
  partOfSpeech: z.string(),
  pronunciation: z.string(),
  notes: z.string(),
  example: z.string(),
  file: z.instanceof(File).optional(),
  image: z.string(),
});
export const UpdateVocabularyModal = () => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOpen, data, type } = useSelector((state: RootState) => state.modal);
  const { vocabulary } = data;
  const isModalOpen = isOpen && type === "UpdateVocabulary";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      word: vocabulary?.word,
      mean: vocabulary?.mean,
      partOfSpeech: vocabulary?.partOfSpeech,
      pronunciation: vocabulary?.pronunciation,
      notes: vocabulary?.notes,
      example: vocabulary?.example,
      image: vocabulary?.image,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    const formData = new FormData();

    if (values.file) {
      formData.append("file", values.file);
    }

    formData.append("word", values.word);
    formData.append("mean", values.mean);
    formData.append("partOfSpeech", values.partOfSpeech);
    formData.append("pronunciation", values.pronunciation);
    formData.append("notes", values.notes);
    formData.append("example", values.example);
    formData.append("image", values.image);

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/vocabularies/${vocabulary?._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      form.reset({
        word: "",
        mean: "",
        partOfSpeech: "",
        pronunciation: "",
        notes: "",
        example: "",
        image: "",
        file: undefined,
      });
      dispatch(closeModal());
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    form.setValue("word", vocabulary?.word ?? "");
    form.setValue("mean", vocabulary?.mean ?? "");
    form.setValue("partOfSpeech", vocabulary?.partOfSpeech ?? "");
    form.setValue("pronunciation", vocabulary?.pronunciation ?? "");
    form.setValue("notes", vocabulary?.notes ?? "");
    form.setValue("example", vocabulary?.example ?? "");
    form.setValue("image", vocabulary?.image ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vocabulary]);
  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={() => {
        dispatch(closeModal());
      }}
    >
      <DialogContent
        ria-labelledby="dialog-title"
        className="w-[600px] max-w-full max-h-full lg:max-w-screen-lg overflow-y-scroll"
      >
        {/* Chỉnh độ dài ở đây nè nhưng tuyệt đối không được bỏ cái max-w-full */}
        <DialogHeader>
          <DialogTitle>Chỉnh sửa từ vựng</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="word"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Từ mới</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mean"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Định nghĩa</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Accordion type="single" collapsible className="border-2 px-2">
              <AccordionItem value="item-1">
                <AccordionTrigger className="border-2">
                  Thêm phiên âm, ví dụ, ảnh, ghi chú ...
                </AccordionTrigger>
                <AccordionContent>
                  <FormField
                    control={form.control}
                    name="file"
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>Ảnh</FormLabel>
                        <FormControl>
                          <Input
                            {...fieldProps}
                            type="file"
                            accept="image/*"
                            onChange={(event) =>
                              onChange(
                                event.target.files && event.target.files[0]
                              )
                            }
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="partOfSpeech"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Từ loại</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pronunciation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phiên âm</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="example"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ví dụ</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ghi chú</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Button type="submit" disabled={isSubmitting}>
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
