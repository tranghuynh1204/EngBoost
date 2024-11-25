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

import { Input } from "@/components/ui/input";
import { z } from "zod";

import { closeModal } from "@/lib/store/modal-slice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";

const formSchema = z.object({
  title: z.string().min(2, { message: "title phải có ít nhất 2 ký tự." }),
  description: z.string(),
});
export const UpdateFlashcardModal = () => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOpen, data, type } = useSelector((state: RootState) => state.modal);
  const { flashcard } = data;
  const isModalOpen = isOpen && type === "UpdateFlashcard";
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: flashcard?.title,
      description: flashcard?.description,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/flashcards/${flashcard?._id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      form.reset();
      dispatch(closeModal());
      window.location.reload();
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    form.setValue("title", flashcard?.title ?? "");
    form.setValue("description", flashcard?.description ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flashcard]);
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
          <DialogTitle>Chỉnh sửa list từ vựng</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
